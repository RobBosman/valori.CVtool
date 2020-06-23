import { createAction, createReducer } from "@reduxjs/toolkit";
import { filter, flatMap, map, delay } from "rxjs/operators";
import { ofType } from "redux-observable";
import { fromArray } from "rxjs/internal/observable/fromArray";
import { reducerRegistry } from "../../redux/reducerRegistry";
import { epicRegistry } from "../../redux/epicRegistry";
import { replaceSafeContent, fetchAll } from "../safe/safe-actions";
import { updateEventBusConnectionState } from "../eventBus/eventBus-actions";
import { eventBusClient } from "../eventBus/eventBus-services";
import { loginToRemote } from "./authentication-services";

export const requestLogin = createAction("AUTHENTICATION_REQUEST_LOGIN", () => ({}));
export const confirmLoggingIn = createAction("AUTHENTICATION_CONFIRM_LOGGING_IN", () => ({}));
export const confirmLoggedIn = createAction("AUTHENTICATION_CONFIRM_LOGGED_IN", () => ({}));
export const requestLogout = createAction("AUTHENTICATION_REQUEST_LOGOUT", () => ({}));
export const confirmLoggingOut = createAction("AUTHENTICATION_CONFIRM_LOGGING_OUT", () => ({}));
export const confirmLoggedOut = createAction("AUTHENTICATION_CONFIRM_LOGGED_OUT", () => ({}));
export const setAccount = createAction("AUTHENTICATION_SET_ACCOUNT");

export const LoginStates = {
  REQUESTED_LOGIN: "REQUESTED_LOGIN",
  LOGGING_IN: "LOGGING_IN",
  LOGGED_IN: "LOGGED_IN",
  REQUESTED_LOGOUT: "REQUESTED_LOGOUT",
  LOGGING_OUT: "LOGGING_OUT",
  LOGGED_OUT: "LOGGED_OUT"
};

reducerRegistry.register(
  "authentication",
  createReducer(
    {
      loginState: LoginStates.LOGGED_OUT
    },
    {
      [requestLogin]: (state) => {
        state.loginState = LoginStates.REQUESTED_LOGIN;
      },
      [confirmLoggingIn]: (state) => {
        state.loginState = LoginStates.LOGGING_IN;
      },
      [confirmLoggedIn]: (state) => {
        state.loginState = LoginStates.LOGGED_IN;
      },
      [requestLogout]: (state) => {
        state.loginState = LoginStates.REQUESTED_LOGOUT;
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
    }));

epicRegistry.register(

  (actions$, state$) => actions$.pipe(
    ofType(requestLogin.type, updateEventBusConnectionState.type),
    delay(1000), // TODO - remove delay
    flatMap(() => loginToRemote(state$.value, eventBusClient.sendEvent))
  ),

  (actions$) => actions$.pipe(
    ofType(setAccount.type),
    filter((action) => action.payload),
    flatMap(() => fromArray([
      confirmLoggedIn(),
      fetchAll()
    ]))
  ),
  
  (actions$) => actions$.pipe(
    ofType(requestLogout.type),
    delay(1000), // TODO - remove delay
    flatMap(() => fromArray([
      replaceSafeContent(undefined),
      setAccount(undefined)
    ]))
  ),

  (actions$) => actions$.pipe(
    ofType(setAccount.type),
    filter((action) => !action.payload),
    map(() => confirmLoggedOut())
  )
);