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

const getTokenExpiration = authenticationResult =>
  authenticationResult.idTokenClaims?.exp || 0;

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
              // Then delete the auth data and disconnect the EventBus.
              authActions.setAuthResult(undefined),
              authActions.setAuthInfo(undefined),
              authActions.refreshAuthenticationBefore(undefined),
              eventBusActions.requestEventBusConnection(false)
            ))
          )
        )
    )
  ),

  // Authenticate at the OpenID provider.
  (action$) => action$.pipe(
    ofType(authActions.authenticate.type),
    rx.switchMap(() => authServices.authenticateAtOpenIdProvider(false)),
    rx.mergeMap(authResult => of(
      authActions.setAuthResult(JSON.stringify(authResult)),
      authActions.refreshAuthenticationBefore(getTokenExpiration(authResult)),
      // When requested to login then fetch the authInfo data.
      authActions.setLoginState(authActions.LoginStates.LOGGING_IN_BACKEND),
      authActions.fetchAuthInfo(authResult.account.username, authResult.account.name)
    )),
    rx.catchError((error, source$) => merge(
      of(
        errorActions.setLastError(`Authenticatie is mislukt: ${error.message}`, errorActions.ErrorSources.REDUX_MIDDLEWARE),
        authActions.requestLogout()
      ),
      source$
    ))
  ),

  // Check every 5 minutes if the JWT is still valid for at least five more minutes.
  (action$, state$) => action$.pipe(
    ofType(authActions.refreshAuthenticationBefore.type),
    rx.map(action => action.payload),
    rx.switchMap(idTokenClaimsExp => {
      // Abort any refreshing when logged out.
      const loginState = state$.value.auth?.loginState;
      if (!idTokenClaimsExp
        || loginState === authActions.LoginStates.LOGGED_OUT
        || loginState === authActions.LoginStates.LOGGING_OUT) {
        return EMPTY;
      }

      // Check if the JWT is still valid the next few minutes.
      const remainingSeconds = idTokenClaimsExp - (new Date().getTime() / 1000);
      const next$ = (remainingSeconds > AUTHENTICATION_REFRESH_SECONDS)
        ? of(idTokenClaimsExp) // Keep using the same token.
        : from(authServices.authenticateAtOpenIdProvider(true) // Get a new token.
          .then(authResult => getTokenExpiration(authResult))
        );
      return next$.pipe(
        rx.delay(AUTHENTICATION_VERIFY_MILLIS), // Repeat this check every few minutes.
        rx.map(exp => authActions.refreshAuthenticationBefore(exp)),
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
    rx.map(action => action.payload),
    rx.switchMap(({email, name}) => eventBusServices.eventBusClient.monitorConnectionState().pipe(
      // Fetch the authInfo data as soon as the EventBus is connected.
      rx.filter(connectionState => connectionState === eventBusServices.ConnectionStates.CONNECTED),
      rx.take(1), // Connect once; don't automatically fetch authInfo at future reconnects.
      rx.mergeMap(() => authServices.fetchAuthInfoFromRemote(email, name, eventBusServices.eventBusClient.sendEvent)),
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
            safeActions.fetchAllInstances("businessUnit"),
            safeActions.fetchAllInstances("brand")
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
  ),

  // Request consent to read the user's profile.
  (action$) => action$.pipe(
    ofType(authActions.requestReadProfileConsent.type),
    rx.switchMap(() => authServices.authenticateAtOpenIdProvider(true, true)),
    rx.map(authResult => authActions.setAuthResult(JSON.stringify(authResult))),
    rx.catchError((_, source$) => source$) // ignore errors (cancellations) here
  ),

  // Fetch the profile photo.
  (action$, state$) => action$.pipe(
    ofType(authActions.fetchProfilePhoto.type),
    rx.map(action => action.payload),
    rx.switchMap(accountInstanceId => {
      const hasConsent = state =>
        state.auth?.authResult?.scopes?.includes("User.Read");

      if (!hasConsent(state$.value)) {
        // Request authorization and wait for consent before retrying.
        return merge(
          of(authActions.requestReadProfileConsent()),
          state$.pipe(
            rx.filter(state => hasConsent(state)),
            rx.take(1),
            rx.map(() => authActions.fetchProfilePhoto(accountInstanceId))
          )
        );
      }

      return authServices.fetchProfilePhoto(state$.value.auth?.authResult.accessToken)
        .then(profilePhotoB64 => safeActions.setProfilePhoto(accountInstanceId, profilePhotoB64));
    })
  )
];