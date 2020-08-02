import { of, merge, EMPTY } from "rxjs";
import { mergeMap, map, switchMap, filter, catchError, delay } from "rxjs/operators";
import { ofType } from "redux-observable";
import { ErrorSources, setLastError } from "../error/error-actions";
import { requestEventBusConnection } from "../eventBus/eventBus-actions";
import { EventBusConnectionStates, eventBusClient } from "../eventBus/eventBus-services";
import { replaceSafeContent, fetchCvByAccountId } from "../safe/safe-actions";
import { requestLogin, requestLogout, setLoginState, LoginStates, setAccountInfo, fetchAccountInfo, setAuthenticationInfo } from "./authentication-actions";
import { authorizeAtOpenIdProvider, fetchAccountInfoFromRemote, refreshTokenAtOpenIdProvider } from "./authentication-services";

export const authenticationEpics = [
  // Handle requests to login or logout.
  (action$) => action$.pipe(
    ofType(requestLogin.type, requestLogout.type),
    map((action) => action.type === requestLogin.type),
    switchMap((mustLogin) =>
      mustLogin
        ? merge(
          of(setLoginState(LoginStates.LOGGING_IN)),
          of(1).pipe(
            mergeMap(() => authorizeAtOpenIdProvider()),
            mergeMap((authenticationInfo) => of(
              setAuthenticationInfo(authenticationInfo),
              // When requested to login then fetch the accountInfo data.
              requestEventBusConnection(true),
              fetchAccountInfo()
            ))
          )
        )
        : of(
          setLoginState(LoginStates.LOGGING_OUT),
          // When requested to logout then delete the accountInfo data and disconnect the EventBus.
          setAccountInfo(undefined),
          requestEventBusConnection(false),
          setAuthenticationInfo(undefined)
        )
    )
  ),

  // Refresh the JWT when it is about to expire.
  (action$) => action$.pipe(
    ofType(setAuthenticationInfo.type),
    map((action) => action.payload),
    switchMap((oldAuthenticationInfo) =>
      oldAuthenticationInfo
        ? of(1).pipe(
          delay(new Date(oldAuthenticationInfo.expiresOn.getTime() + 1)), // refresh just after expiration time
          mergeMap(() => refreshTokenAtOpenIdProvider(oldAuthenticationInfo)),
          map((newAuthenticationInfo) => setAuthenticationInfo(newAuthenticationInfo))
        )
        : EMPTY)
  ),

  // Fetch the accountInfo. But first ensure the EventBus is connected.
  (action$) => action$.pipe(
    ofType(fetchAccountInfo.type),
    map((action) => action.payload),
    switchMap(() => eventBusClient.getConnectionState() === EventBusConnectionStates.CONNECTED
      ? of(EventBusConnectionStates.CONNECTED)
      : eventBusClient.monitorConnectionState().pipe(
        // When the EventBus is connected then fetch the accountInfo data from remote.
        filter((connectionState) => connectionState === EventBusConnectionStates.CONNECTED)
      )
    ),
    mergeMap(() => fetchAccountInfoFromRemote(eventBusClient.sendEvent)),
    map((accountInfo) => setAccountInfo(accountInfo)),
    catchError((error, source$) => merge(
      of(
        setLastError(`Error logging in: ${error.message}`, ErrorSources.REDUX_MIDDLEWARE),
        requestLogout()
      ),
      source$
    ))
  ),

  // Store or clear the accountInfo (and other data).
  (action$) => action$.pipe(
    ofType(setAccountInfo.type),
    map((action) => action.payload?._id),
    switchMap((accountInfoId) =>
      // When accountInfo is available, then fetch the cv data, otherwise erase it.
      accountInfoId
        ? of(
          setLoginState(LoginStates.LOGGED_IN),
          fetchCvByAccountId(accountInfoId))
        : of(
          setLoginState(LoginStates.LOGGED_OUT),
          replaceSafeContent(undefined))
    )
  )
];