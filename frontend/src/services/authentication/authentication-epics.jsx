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
  (action$, state$) => action$.pipe(
    ofType(authenticationActions.requestLogin.type, authenticationActions.requestLogout.type),
    map((action) => action.type === authenticationActions.requestLogin.type),
    distinctUntilChanged(),
    switchMap((mustLogin) =>
      mustLogin
        ? of(
          authenticationActions.setLoginState(authenticationActions.LoginStates.LOGGING_IN_OPENID),
          authenticationActions.fetchAuthenticationInfo(),
          eventBusActions.requestEventBusConnection(true),
        )
        : merge(
          // When requested to logout then first save any changes...
          of(safeActions.save(false)),
          state$.pipe(
            // ...and wait for the data to be saved.
            filter((state) => !state.safe?.lastEditedTimestamp || state.safe.lastSavedTimestamp >= state.safe.lastEditedTimestamp),
            take(1),
            mergeMap(() => of(
              authenticationActions.setLoginState(authenticationActions.LoginStates.LOGGING_OUT),
              // Then delete the accountInfo data and disconnect the EventBus.
              authenticationActions.setAccountInfo(undefined),
              authenticationActions.setAuthenticationInfo(undefined),
              eventBusActions.requestEventBusConnection(false)
            ))
          )
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
      authenticationActions.setLoginState(authenticationActions.LoginStates.LOGGING_IN_BACKEND),
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
      delay(new Date(authenticationInfo.expiresOn.getTime() - 60000)), // Obtain a new token 1 minute before the current one expires.
      mergeMap(() => authenticationServices.authorizeAtOpenIdProvider()),
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
      take(1) // Connect once; don't automatically fetch accountInfo at future reconnects.
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
    map((action) => action.payload),
    switchMap((accountInfo) => {
      // When accountInfo is available, then fetch the cv data (and also the admin data if applicable), otherwise erase everything.
      const actions = [];
      if (accountInfo) {
        actions.push(
          authenticationActions.setLoginState(authenticationActions.LoginStates.LOGGED_IN),
          safeActions.fetchCvByAccountId(accountInfo._id)
        );
        if (accountInfo.privileges.includes("ADMIN")) {
          actions.push(safeActions.fetchAdminContent());
        }
      } else {
        actions.push(
          authenticationActions.setLoginState(authenticationActions.LoginStates.LOGGED_OUT),
          safeActions.resetEntities(null)
        );
      }
      return of(...actions);
    })
  )
];