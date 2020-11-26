import { of, merge } from "rxjs";
import { map, distinctUntilChanged, switchMap, mergeMap, delay, filter, catchError, take } from "rxjs/operators";
import { ofType } from "redux-observable";
import * as errorActions from "../error/error-actions";
import * as eventBusActions from "../eventBus/eventBus-actions";
import * as eventBusServices from "../eventBus/eventBus-services";
import * as safeActions from "../safe/safe-actions";
import * as authActions from "./auth-actions";
import * as authServices from "./auth-services";

export const authEpics = [

  // Handle requests to login or logout.
  (action$, state$) => action$.pipe(
    ofType(authActions.requestLogin.type, authActions.requestLogout.type),
    map(action => action.type === authActions.requestLogin.type),
    distinctUntilChanged(),
    switchMap(mustLogin =>
      mustLogin
        ? of(
          authActions.setLoginState(authActions.LoginStates.LOGGING_IN_OPENID),
          authActions.authenticate(),
          eventBusActions.requestEventBusConnection(true),
        )
        : merge(
          // When requested to logout then first save any changes...
          of(safeActions.save(false)),
          state$.pipe(
            // ...and wait for the data to be saved.
            filter(state => !state.safe?.lastEditedTimestamp || state.safe.lastSavedTimestamp >= state.safe.lastEditedTimestamp),
            take(1),
            mergeMap(() => of(
              authActions.setLoginState(authActions.LoginStates.LOGGING_OUT),
              // Then delete the authInfo data and disconnect the EventBus.
              authActions.setAuthInfo(undefined),
              authActions.setAuthenticationResult(undefined),
              eventBusActions.requestEventBusConnection(false)
            ))
          )
        )
    )
  ),

  // Authenticate at the OpenID provider.
  (action$) => action$.pipe(
    ofType(authActions.authenticate.type),
    mergeMap(() => authServices.authenticateAtOpenIdProvider()),
    mergeMap(authenticationResult => of(
      authActions.setAuthenticationResult(authenticationResult),
      // When requested to login then fetch the authInfo data.
      authActions.setLoginState(authActions.LoginStates.LOGGING_IN_BACKEND),
      authActions.fetchAuthInfo(authenticationResult)
    )),
    catchError((error, source$) => merge(
      of(
        errorActions.setLastError(`Authenticatie is mislukt: ${error.message}`, errorActions.ErrorSources.REDUX_MIDDLEWARE),
        authActions.requestLogout()
      ),
      source$
    ))
  ),

  // Refresh the JWT when it is about to expire.
  (action$) => action$.pipe(
    ofType(authActions.setAuthenticationResult.type),
    map(action => action.payload),
    filter(authenticationResult => authenticationResult),
    switchMap(authenticationResult => of(1).pipe(
      delay(new Date(authenticationResult.expiresOn.getTime() - 60000)), // Obtain a new token 1 minute before the current one expires.
      mergeMap(() => authServices.authenticateAtOpenIdProvider()),
      map(refreshedAuthenticationResult => authActions.setAuthenticationResult(refreshedAuthenticationResult)),
      catchError((error, source$) => merge(
        of(
          errorActions.setLastError(`Authenticatie is mislukt: ${error.message}`, errorActions.ErrorSources.REDUX_MIDDLEWARE),
          authActions.requestLogout()
        ),
        source$
      ))
    ))
  ),

  // Fetch the authInfo. But first ensure the EventBus is connected.
  (action$) => action$.pipe(
    ofType(authActions.fetchAuthInfo.type),
    map(action => action.payload),
    switchMap(authenticationResult => eventBusServices.eventBusClient.monitorConnectionState().pipe(
      // Fetch the authInfo data as soon as the EventBus is connected.
      filter(connectionState => connectionState === eventBusServices.ConnectionStates.CONNECTED),
      take(1), // Connect once; don't automatically fetch authInfo at future reconnects.
      map(() => authenticationResult)
    )),
    mergeMap(authenticationResult => authServices.fetchAuthInfoFromRemote(authenticationResult, eventBusServices.eventBusClient.sendEvent)),
    map(authInfo => authActions.setAuthInfo(authInfo)),
    catchError((error, source$) => merge(
      of(
        errorActions.setLastError(`Fout bij ophalen accountgegevens: ${error.message}`, errorActions.ErrorSources.REDUX_MIDDLEWARE),
        authActions.requestLogout()
      ),
      source$
    ))
  ),

  // Store or clear the authInfo (and other data).
  (action$) => action$.pipe(
    ofType(authActions.setAuthInfo.type),
    map(action => action.payload),
    switchMap(authInfo => {
      // When authInfo is available, then fetch the cv data (and also the admin data if applicable), otherwise erase everything.
      const actions = [];
      if (authInfo) {
        actions.push(
          authActions.setLoginState(authActions.LoginStates.LOGGED_IN),
          safeActions.fetchCvByAccountId(authInfo.accountId)
        );
        if (authInfo.roles.includes("ADMIN") || authInfo.roles.includes("EE_LEAD") || authInfo.roles.includes("SALES")) {
          actions.push(
            safeActions.fetchAllInstances("account"),
            safeActions.fetchAllInstances("businessUnit")
          );
        }
        if (authInfo.roles.includes("ADMIN")) {
          actions.push(safeActions.fetchAllInstances("role"));
        }
      } else {
        actions.push(
          authActions.setLoginState(authActions.LoginStates.LOGGED_OUT),
          safeActions.resetEntities(null)
        );
      }
      return of(...actions);
    })
  )
];