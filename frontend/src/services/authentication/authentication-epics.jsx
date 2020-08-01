import { of, merge } from "rxjs";
import { mergeMap, map, switchMap, filter, catchError } from "rxjs/operators";
import { ofType } from "redux-observable";
import { ErrorSources, setLastError } from "../error/error-actions";
import { requestEventBusConnection, addEventBusHeaders, deleteEventBusHeaders } from "../eventBus/eventBus-actions";
import { EventBusConnectionStates, eventBusClient } from "../eventBus/eventBus-services";
import { replaceSafeContent, fetchCvByAccountId } from "../safe/safe-actions";
import { requestLogin, requestLogout, setLoginState, LoginStates, setAccountInfo, fetchAccountInfo } from "./authentication-actions";
import { authorizeAtOpenIdProvider, fetchAccountInfoFromRemote } from "./authentication-services";

export const authenticationEpics = [
  // Handle requests to login or logout.
  (action$) => action$.pipe(
    ofType(requestLogin.type, requestLogout.type),
    map((action) => action.type === requestLogin.type),
    switchMap((mustLogin) => mustLogin
      ? merge(
        of(setLoginState(LoginStates.LOGGING_IN)),
        of(1).pipe(
          mergeMap(() => authorizeAtOpenIdProvider()),
          // When requested to login then fetch the accountInfo data.
          mergeMap((loginResponse) => of(
            // When requested to login then fetch the accountInfo data.
            addEventBusHeaders({ Authorization: "Bearer " + loginResponse.idToken }),
            requestEventBusConnection(true),
            fetchAccountInfo()
          ))
        )
      )
      : of(
        setLoginState(LoginStates.LOGGING_OUT),
        // TODO: revoke JWT
        deleteEventBusHeaders({ Authorization: "" }),
        // When requested to logout then delete the accountInfo data and disconnect the EventBus.
        setAccountInfo(undefined),
        requestEventBusConnection(false)
      )
    )
  ),

  // Fetch the accountInfo. But first ensure the EventBus is connected.
  (action$) => action$.pipe(
    ofType(fetchAccountInfo.type),
    map((action) => action.payload),
    switchMap(() => eventBusClient.getConnectionState() === EventBusConnectionStates.CONNECTED
      ? of(1).pipe(
        mergeMap(() => fetchAccountInfoFromRemote(eventBusClient.sendEvent)),
        map((accountInfo) => setAccountInfo(accountInfo))
      )
      : eventBusClient.monitorConnectionState().pipe(
        // When the EventBus is connected then fetch the accountInfo data from remote.
        filter((connectionState) => connectionState === EventBusConnectionStates.CONNECTED),
        mergeMap(() => fetchAccountInfoFromRemote(eventBusClient.sendEvent)),
        map((accountInfo) => setAccountInfo(accountInfo))
      )
    ),
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
    mergeMap((accountInfoId) => {
      if (accountInfoId) { // When accountInfo is available, then fetch the cv data, otherwise erase it.
        return of(
          setLoginState(LoginStates.LOGGED_IN),
          fetchCvByAccountId(accountInfoId));
      } else {
        return of(
          setLoginState(LoginStates.LOGGED_OUT),
          replaceSafeContent(undefined));
      }
    })
  )
];