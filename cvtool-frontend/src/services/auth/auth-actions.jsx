import { createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../redux/reducerRegistry";

export const requestLogin = createAction("REQUEST_LOGIN", () => ({}));
export const requestLogout = createAction("REQUEST_LOGOUT", () => ({}));
export const authenticate = createAction("AUTHENTICATE", () => ({}));
export const setAuthenticationResult = createAction("SET_AUTHENTICATION_RESULT");
export const fetchAuthInfo = createAction("FETCH_AUTHT_INFO");
export const setLoginState = createAction("SET_LOGIN_STATE");
export const setAuthInfo = createAction("SET_AUTH_INFO");

export const LoginStates = {
  LOGGED_OUT: "LOGGED_OUT",
  LOGGING_IN_OPENID: "LOGGING_IN_OPENID",
  LOGGING_IN_BACKEND: "LOGGING_IN_BACKEND",
  LOGGED_IN: "LOGGED_IN",
  LOGGING_OUT: "LOGGING_OUT"
};

reducerRegistry.register(
  "auth",
  createReducer(
    {
      loginState: LoginStates.LOGGED_OUT
    },
    {
      [setLoginState]: (state, action) => ({
        ...state,
        loginState: action.payload
      }),
      [setAuthInfo]: (state, action) => ({
        ...state,
        authInfo: action.payload
      })
    }
  )
);