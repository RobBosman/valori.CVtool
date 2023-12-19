import { from, of, merge, EMPTY } from "rxjs";
import * as rx from "rxjs/operators";
import { ofType } from "redux-observable";
import * as utils from "../../utils/CommonUtils";
import * as errorActions from "../error/error-actions";
import * as eventBusActions from "../eventBus/eventBus-actions";
import * as eventBusServices from "../eventBus/eventBus-services";
import * as cvActions from "../cv/cv-actions";
import * as safeActions from "../safe/safe-actions";
import * as authActions from "./auth-actions";
import * as authServices from "./auth-services";

const AUTHENTICATION_VERIFY_MILLIS = 5 * 60 * 1000; // 5 minutes
const AUTHENTICATION_REFRESH_SECONDS = 15 * 60; // 15 minutes

export const authEpics = [

  // Handle requests to login or logout.
  (action$, state$) => action$.pipe(
    ofType(authActions.requestLogin.type, authActions.requestLogout.type),
    rx.map(action => action.type === authActions.requestLogin.type),
    rx.distinctUntilChanged(),
    rx.switchMap(mustLogin =>
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
            rx.filter(state => !state.safe?.lastEditedTimeString
               || utils.parseTimeString(state.safe.lastSavedTimeString) >= utils.parseTimeString(state.safe.lastEditedTimeString)),
            rx.take(1),
            rx.mergeMap(() => of(
              authActions.setLoginState(authActions.LoginStates.LOGGING_OUT),
              // Then delete the authInfo data and disconnect the EventBus.
              authActions.setAuthInfo(undefined),
              authActions.refreshAuthentication(undefined),
              eventBusActions.requestEventBusConnection(false)
            ))
          )
        )
    )
  ),

  // Authenticate at the OpenID provider.
  (action$) => action$.pipe(
    ofType(authActions.authenticate.type),
    rx.switchMap(() => from(authServices.authenticateAtOpenIdProvider()).pipe(
      rx.mergeMap(authenticationResult => of(
        authActions.refreshAuthentication(JSON.stringify(authenticationResult)),
        // When requested to login then fetch the authInfo data.
        authActions.setLoginState(authActions.LoginStates.LOGGING_IN_BACKEND),
        authActions.fetchAuthInfo(JSON.stringify(authenticationResult))
      )),
      rx.catchError((error, source$) => merge(
        of(
          errorActions.setLastError(`Authenticatie is mislukt: ${error.message}`, errorActions.ErrorSources.REDUX_MIDDLEWARE),
          authActions.requestLogout()
        ),
        source$
      ))
    ))
  ),

  // Check every 5 minutes if the JWT is still valid for at least five more minutes.
  (action$, state$) => action$.pipe(
    ofType(authActions.refreshAuthentication.type),
    rx.map(action => action.payload),
    rx.switchMap(authenticationResultJson => {
      // Abort any refreshing when logged out.
      const loginState = state$.value.auth?.loginState;
      if (!authenticationResultJson
        || loginState === authActions.LoginStates.LOGGED_OUT
        || loginState === authActions.LoginStates.LOGGING_OUT) {
        return EMPTY;
      }

      const authenticationResult = JSON.parse(authenticationResultJson);
      
      // Check if the JWT is still valid the next few minutes.
      const remainingSeconds = (authenticationResult.idTokenClaims?.exp || 0) - (new Date().getTime() / 1000);
      const next$ = (remainingSeconds > AUTHENTICATION_REFRESH_SECONDS)
        ? of(authenticationResult) // Keep using the same token.
        : from(authServices.authenticateAtOpenIdProvider(true)); // Get a new token.
      return next$.pipe(
        rx.delay(AUTHENTICATION_VERIFY_MILLIS), // Repeat this check every few minutes.
        rx.map(refreshedAuthenticationResult => authActions.refreshAuthentication(JSON.stringify(refreshedAuthenticationResult))),
        rx.catchError((error, source$) => merge(
          of(
            errorActions.setLastError(`Her-authenticatie is mislukt: ${error.message}`, errorActions.ErrorSources.REDUX_MIDDLEWARE),
            authActions.requestLogout()
          ),
          source$
        ))
      );
    })
  ),

  // Fetch the authInfo. But first ensure the EventBus is connected.
  (action$) => action$.pipe(
    ofType(authActions.fetchAuthInfo.type),
    rx.map(action => JSON.parse(action.payload)),
    rx.switchMap(authenticationResult => eventBusServices.eventBusClient.monitorConnectionState().pipe(
      // Fetch the authInfo data as soon as the EventBus is connected.
      rx.filter(connectionState => connectionState === eventBusServices.ConnectionStates.CONNECTED),
      rx.take(1), // Connect once; don't automatically fetch authInfo at future reconnects.
      rx.mergeMap(() => authServices.fetchAuthInfoFromRemote(authenticationResult, eventBusServices.eventBusClient.sendEvent)),
      rx.map(authInfo => authActions.setAuthInfo(authInfo)),
      rx.catchError((error, source$) => merge(
        of(
          errorActions.setLastError(`Fout bij ophalen accountgegevens: ${error.message}`, errorActions.ErrorSources.REDUX_MIDDLEWARE),
          authActions.requestLogout()
        ),
        source$
      ))
    ))
  ),

  // Store or clear the authInfo (and other data).
  (action$) => action$.pipe(
    ofType(authActions.setAuthInfo.type),
    rx.map(action => action.payload),
    rx.switchMap(authInfo => {
      // When authInfo is available, then fetch the cv data (and also additional data if applicable), otherwise erase everything.
      const actions = [];
      if (authInfo) {
        actions.push(
          authActions.setLoginState(authActions.LoginStates.LOGGED_IN),
          cvActions.fetchCvByAccountId(authInfo.accountId)
        );
        if (["ADMIN", "UNIT_LEAD", "SALES"].includes(authInfo.authorizationLevel)) {
          actions.push(
            safeActions.fetchAllInstances("account"),
            safeActions.fetchAllInstances("authorization"),
            safeActions.fetchAllInstances("businessUnit")
          );
        }
      } else {
        actions.push(
          authActions.setLoginState(authActions.LoginStates.LOGGED_OUT),
          safeActions.resetEntities(null),
          cvActions.resetSearchData()
        );
      }
      return of(...actions);
    })
  )
];