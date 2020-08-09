import { of, merge } from "rxjs";
import { map, distinctUntilChanged, switchMap, mergeMap, delay, filter, catchError, take } from "rxjs/operators";
import { ofType } from "redux-observable";
import * as errorActions from "../error/error-actions";
import * as eventBusActions from "../eventBus/eventBus-actions";
import * as eventBusServices from "../eventBus/eventBus-services";
import * as safeActions from "../safe/safe-actions";
import * as authenticationActions from "./authentication-actions";
import * as authenticationServices from "./authentication-services";

export const authenticationEpics = [
  // Handle requests to login or logout.
  (action$) => action$.pipe(
    ofType(authenticationActions.requestLogin.type, authenticationActions.requestLogout.type),
    map((action) => action.type === authenticationActions.requestLogin.type),
    distinctUntilChanged(),
    switchMap((mustLogin) =>
      mustLogin
        ? of(
          authenticationActions.setLoginState(authenticationActions.LoginStates.LOGGING_IN),
          authenticationActions.fetchAuthenticationInfo()
        )
        : of(
          authenticationActions.setLoginState(authenticationActions.LoginStates.LOGGING_OUT),
          // When requested to logout then delete the accountInfo data and disconnect the EventBus.
          authenticationActions.setAccountInfo(undefined),
          authenticationActions.setAuthenticationInfo(undefined),
          eventBusActions.requestEventBusConnection(false)
        )
    )
  ),

  // Authenticate at the OpenID provider.
  (action$) => action$.pipe(
    ofType(authenticationActions.fetchAuthenticationInfo.type),
    mergeMap(() => authenticationServices.authorizeAtOpenIdProvider()),
    mergeMap((authenticationInfo) => of(
      authenticationActions.setAuthenticationInfo(authenticationInfo),
      // When requested to login then fetch the accountInfo data.
      eventBusActions.requestEventBusConnection(true),
      authenticationActions.fetchAccountInfo()
    )),
    catchError((error, source$) => merge(
      of(
        errorActions.setLastError(`Error authenticating: ${error.message}`, errorActions.ErrorSources.REDUX_MIDDLEWARE),
        authenticationActions.requestLogout()
      ),
      source$
    ))
  ),

  // Refresh the JWT when it is about to expire.
  (action$) => action$.pipe(
    ofType(authenticationActions.setAuthenticationInfo.type),
    map((action) => action.payload),
    filter((authenticationInfo) => authenticationInfo),
    switchMap((authenticationInfo) => of(1).pipe(
      delay(new Date(authenticationInfo.expiresOn.getTime() + 1)), // refresh just after expiration time
      mergeMap(() => authenticationServices.refreshTokenAtOpenIdProvider(authenticationInfo)),
      map((refreshedAuthenticationInfo) => authenticationActions.setAuthenticationInfo(refreshedAuthenticationInfo)),
      catchError((error, source$) => merge(
        of(
          errorActions.setLastError(`Error authenticating: ${error.message}`, errorActions.ErrorSources.REDUX_MIDDLEWARE),
          authenticationActions.requestLogout()
        ),
        source$
      ))
    ))
  ),

  // Fetch the accountInfo. But first ensure the EventBus is connected.
  (action$) => action$.pipe(
    ofType(authenticationActions.fetchAccountInfo.type),
    map((action) => action.payload),
    switchMap(() => eventBusServices.eventBusClient.monitorConnectionState().pipe(
      // Fetch the accountInfo data as soon as the EventBus is connected.
      filter((connectionState) => connectionState === eventBusServices.ConnectionStates.CONNECTED),
      take(1) // don't retry automatically
    )),
    mergeMap(() => authenticationServices.fetchAccountInfoFromRemote(eventBusServices.eventBusClient.sendEvent)),
    map((accountInfo) => authenticationActions.setAccountInfo(accountInfo)),
    catchError((error, source$) => merge(
      of(
        errorActions.setLastError(`Error fetching accountInfo: ${error.message}`, errorActions.ErrorSources.REDUX_MIDDLEWARE),
        authenticationActions.requestLogout()
      ),
      source$
    ))
  ),

  // Store or clear the accountInfo (and other data).
  (action$) => action$.pipe(
    ofType(authenticationActions.setAccountInfo.type),
    map((action) => action.payload?._id),
    switchMap((accountInfoId) =>
      // When accountInfo is available, then fetch the cv data, otherwise erase it.
      accountInfoId
        ? of(
          authenticationActions.setLoginState(authenticationActions.LoginStates.LOGGED_IN),
          safeActions.fetchCvByAccountId(accountInfoId))
        : of(
          authenticationActions.setLoginState(authenticationActions.LoginStates.LOGGED_OUT),
          safeActions.replaceSafeContent(undefined))
    )
  )
];