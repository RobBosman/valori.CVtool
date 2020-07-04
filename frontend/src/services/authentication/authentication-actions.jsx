import { createAction, createReducer } from "@reduxjs/toolkit";
import { flatMap, map, distinctUntilChanged } from "rxjs/operators";
import { ofType } from "redux-observable";
import { reducerRegistry } from "../../redux/reducerRegistry";
import { epicRegistry } from "../../redux/epicRegistry";
import { replaceSafeContent, fetchAll } from "../safe/safe-actions";
import { setEventBusConnectionState, setEventBusConnectionRequest, EventBusConnectionRequestStates } from "../eventBus/eventBus-actions";
import { eventBusClient, EventBusConnectionStates } from "../eventBus/eventBus-services";
import { loginToRemote } from "./authentication-services";
import { of } from "rxjs";

export const requestToLogin = createAction("AUTHENTICATION_REQUEST_TO_LOGIN", () => ({}));
export const requestToLogout = createAction("AUTHENTICATION_REQUEST_TO_LOGOUT", () => ({}));
export const confirmLoggingIn = createAction("AUTHENTICATION_CONFIRM_LOGGING_IN", () => ({}));
export const confirmLoggedIn = createAction("AUTHENTICATION_CONFIRM_LOGGED_IN", () => ({}));
export const confirmLoggingOut = createAction("AUTHENTICATION_CONFIRM_LOGGING_OUT", () => ({}));
export const confirmLoggedOut = createAction("AUTHENTICATION_CONFIRM_LOGGED_OUT", () => ({}));
export const setAccount = createAction("AUTHENTICATION_SET_ACCOUNT");

export const LoginRequestStates = {
  REQUESTED_TO_LOGOUT: "REQUESTED_TO_LOGOUT",
  REQUESTED_TO_LOGIN: "REQUESTED_TO_LOGIN"
};

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
      [confirmLoggingIn]: (state) => {
        state.loginState = LoginStates.LOGGING_IN;
      },
      [confirmLoggedIn]: (state) => {
        state.loginState = LoginStates.LOGGED_IN;
      },
      [confirmLoggingOut]: (state) => {
        state.loginState = LoginStates.LOGGING_OUT;
      },
      [confirmLoggedOut]: (state) => {
        state.loginState = LoginStates.LOGGED_OUT;
      },
      [setAccount]: (state, action) => {
        state.account = action.payload;
      }
    }
  )
);

epicRegistry.register(
  
  // When requested to login, request to connect the EventBus.
  (actions$) => actions$.pipe(
    ofType(requestToLogin.type),
    map(() => setEventBusConnectionRequest(EventBusConnectionRequestStates.REQUESTED_TO_CONNECT))
  ),

  // When the EventBus connection state changes to CONNECTED, then confirm being logged in, else confirm being logged out.
  (actions$) => actions$.pipe(
    ofType(setEventBusConnectionState.type),
    distinctUntilChanged(null, (action) => action.payload),
    map((action) => action.payload === EventBusConnectionStates.CONNECTED
      ? confirmLoggingIn()
      : confirmLoggedOut())
  ),

  // When logging in, fetch account info via the (connected) EventBus.
  (actions$) => actions$.pipe(
    ofType(confirmLoggingIn.type),
    flatMap(() => loginToRemote(eventBusClient.sendEvent)),
    flatMap((account) => of(
      setAccount(account),
      confirmLoggedIn()
    ))
  ),

  // Once logged in, fetch all cv data.
  (actions$) => actions$.pipe(
    ofType(confirmLoggedIn.type),
    map(() => fetchAll())
  ),

  // When requested to logout, delete all fetched data and request to disconnect the EventBus.
  (actions$) => actions$.pipe(
    ofType(requestToLogout.type),
    flatMap(() => of(
      confirmLoggingOut(),
      replaceSafeContent(undefined),
      setAccount(undefined),
      setEventBusConnectionRequest(EventBusConnectionRequestStates.REQUESTED_TO_DISCONNECT)
    ))
  )
);