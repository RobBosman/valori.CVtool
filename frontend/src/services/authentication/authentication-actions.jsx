import { createAction, createReducer } from "@reduxjs/toolkit";
import { of, merge } from "rxjs";
import { mergeMap, map, switchMap, filter } from "rxjs/operators";
import { ofType } from "redux-observable";
import { reducerRegistry } from "../../redux/reducerRegistry";
import { epicRegistry } from "../../redux/epicRegistry";
import { requestEventBusConnection } from "../eventBus/eventBus-actions";
import { EventBusConnectionStates, eventBusClient } from "../eventBus/eventBus-services";
import { replaceSafeContent, fetchCvByAccountId } from "../safe/safe-actions";
import { authorizeAtOpenIdProvider, fetchAccountInfoFromRemote } from "../authentication/authentication-services";

export const requestLogin = createAction("REQUEST_LOGIN", () => ({}));
export const requestLogout = createAction("REQUEST_LOGOUT", () => ({}));
export const setLoginResponse = createAction("SET_LOGIN_RESPONSE");
export const setLoginState = createAction("SET_LOGIN_STATE");
export const fetchAccountInfo = createAction("FETCH_ACCOUNT_INFO");
export const setAccountInfo = createAction("SET_ACCOUNT_INFO");

export const LoginStates = {
  LOGGED_OUT: "LOGGED_OUT",
  LOGGING_IN: "LOGGING_IN",
  LOGGED_IN: "LOGGED_IN",
  LOGGING_OUT: "LOGGING_OUT"
};

reducerRegistry.register(
  "authentication",
  createReducer(
    {
      loginState: LoginStates.LOGGED_OUT
    },
    {
      [setLoginResponse]: (state, action) => {
        state.loginResponse = action.payload;
      },
      [setLoginState]: (state, action) => {
        state.loginState = action.payload;
      },
      [setAccountInfo]: (state, action) => {
        state.accountInfo = action.payload;
      }
    }
  )
);

epicRegistry.register(

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
            setLoginResponse(loginResponse),
            setLoginState(LoginStates.LOGGED_IN),
            // When requested to login then fetch the accountInfo data.
            requestEventBusConnection(true),
            fetchAccountInfo(loginResponse.accessToken)
          ))
        )
      )
      : of(
        setLoginState(LoginStates.LOGGING_OUT),
        // TODO: revoke JWT
        
        setLoginResponse(undefined),
        setLoginState(LoginStates.LOGGED_OUT),
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
    switchMap((accessToken) => eventBusClient.getConnectionState() === EventBusConnectionStates.CONNECTED
      ? of(1).pipe(
        mergeMap(() => fetchAccountInfoFromRemote(accessToken, eventBusClient.sendEvent)),
        map((accountInfo) => setAccountInfo(accountInfo))
      )
      : eventBusClient.monitorConnectionState().pipe(
        // When the EventBus is connected then fetch the accountInfo data from remote.
        filter((connectionState) => connectionState === EventBusConnectionStates.CONNECTED),
        mergeMap(() => fetchAccountInfoFromRemote(accessToken, eventBusClient.sendEvent)),
        map((accountInfo) => setAccountInfo(accountInfo))
      )
    )
  ),

  // Store or clear the accountInfo (and other data).
  (action$) => action$.pipe(
    ofType(setAccountInfo.type),
    map((action) => action.payload?._id),
    map((accountInfoId) => accountInfoId // When accountInfo is available, then fetch the cv data, otherwise erase it.
      ? fetchCvByAccountId(accountInfoId)
      : replaceSafeContent(undefined)
    )
  )
);