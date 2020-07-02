import { createAction, createReducer } from "@reduxjs/toolkit";
import { filter, flatMap, map } from "rxjs/operators";
import { ofType } from "redux-observable";
import { fromArray } from "rxjs/internal/observable/fromArray";
import { reducerRegistry } from "../../redux/reducerRegistry";
import { epicRegistry } from "../../redux/epicRegistry";
import { replaceSafeContent, fetchAll } from "../safe/safe-actions";
import { updateEventBusConnectionState } from "../eventBus/eventBus-actions";
import { eventBusClient } from "../eventBus/eventBus-services";
import { loginToRemote } from "./authentication-services";

export const requestToLogin = createAction("AUTHENTICATION_REQUEST_TO_LOGIN", () => ({}));
export const confirmLoggingIn = createAction("AUTHENTICATION_CONFIRM_LOGGING_IN", () => ({}));
export const confirmLoggedIn = createAction("AUTHENTICATION_CONFIRM_LOGGED_IN", () => ({}));
export const requestToLogout = createAction("AUTHENTICATION_REQUEST_TO_LOGOUT", () => ({}));
export const confirmLoggingOut = createAction("AUTHENTICATION_CONFIRM_LOGGING_OUT", () => ({}));
export const confirmLoggedOut = createAction("AUTHENTICATION_CONFIRM_LOGGED_OUT", () => ({}));
export const setAccount = createAction("AUTHENTICATION_SET_ACCOUNT");

export const LoginStates = {
  LOGGED_OUT: "LOGGED_OUT",
  REQUESTED_TO_LOGIN: "REQUESTED_TO_LOGIN",
  LOGGING_IN: "LOGGING_IN",
  LOGGED_IN: "LOGGED_IN",
  REQUESTED_TO_LOGOUT: "REQUESTED_TO_LOGOUT",
  LOGGING_OUT: "LOGGING_OUT"
};

reducerRegistry.register(
  "authentication",
  createReducer(
    {
      loginState: LoginStates.LOGGED_OUT
    },
    {
      [requestToLogin]: (state) => {
        state.loginState = LoginStates.REQUESTED_TO_LOGIN;
      },
      [confirmLoggingIn]: (state) => {
        state.loginState = LoginStates.LOGGING_IN;
      },
      [confirmLoggedIn]: (state) => {
        state.loginState = LoginStates.LOGGED_IN;
      },
      [requestToLogout]: (state) => {
        state.loginState = LoginStates.REQUESTED_TO_LOGOUT;
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

  (actions$, state$) => actions$.pipe(
    ofType(requestToLogin.type, updateEventBusConnectionState.type),
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
    ofType(requestToLogout.type),
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