import { createAction, createReducer } from "@reduxjs/toolkit";
import { flatMap, map, filter, distinctUntilChanged, switchMap } from "rxjs/operators";
import { ofType } from "redux-observable";
import { reducerRegistry } from "../../redux/reducerRegistry";
import { epicRegistry } from "../../redux/epicRegistry";
import { replaceSafeContent, fetchAll } from "../safe/safe-actions";
import { requestToConnectEventBus, requestToDisconnectEventBus } from "../eventBus/eventBus-actions";
import { eventBusClient, EventBusConnectionStates } from "../eventBus/eventBus-services";
import { fetchAccountInfo } from "./authentication-services";
import { of, merge } from "rxjs";

export const requestToLogin = createAction("REQUEST_TO_LOGIN", () => ({}));
export const requestToLogout = createAction("REQUEST_TO_LOGOUT", () => ({}));
export const setLoginState = createAction("SET_LOGIN_STATE");
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

  // When requested to login...
  (action$, state$) => action$.pipe(
    ofType(requestToLogin.type),
    switchMap(() => merge(
      // ...then request to connect the EventBus.
      of(requestToConnectEventBus()),
      // When the EventBus connection state changes...
      state$.pipe(
        map((state) => state.eventBus.connectionState),
        distinctUntilChanged(),
        // ...then confirm being logged in or out.
        map((connectionState) => connectionState === EventBusConnectionStates.CONNECTED
          ? setLoginState(LoginStates.LOGGING_IN)
          : setLoginState(LoginStates.LOGGED_OUT))
      )
    ))
  ),

  // When logging in, fetch account info via the (connected) EventBus.
  (action$) => action$.pipe(
    ofType(setLoginState.type),
    filter((action) => action.payload === LoginStates.LOGGING_IN),
    flatMap(() => fetchAccountInfo("authenticationCode", eventBusClient.sendEvent)), // TODO obtain authenticationCode
    flatMap((accountInfo) => of(
      setAccountInfo(accountInfo),
      setLoginState(LoginStates.LOGGED_IN)
    ))
  ),

  // Once logged in, fetch all cv data.
  (action$) => action$.pipe(
    ofType(setLoginState.type),
    filter((action) => action.payload === LoginStates.LOGGED_IN),
    map(() => fetchAll())
  ),

  // When requested to logout, delete all fetched data and request to disconnect the EventBus.
  (action$) => action$.pipe(
    ofType(requestToLogout.type),
    flatMap(() => of(
      setLoginState(LoginStates.LOGGING_OUT),
      replaceSafeContent(undefined),
      setAccountInfo(undefined),
      requestToDisconnectEventBus()
    ))
  )
);