import { createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../redux/reducerRegistry";

// Epic actions:
export const requestLogin = createAction("REQUEST_LOGIN", () => ({}));
export const requestLogout = createAction("REQUEST_LOGOUT", () => ({}));
export const authenticate = createAction("AUTHENTICATE", () => ({}));
export const refreshAuthenticationBefore = createAction("REFRESH_AUTHENTICATION_BEFORE");
export const fetchAuthInfo = createAction("FETCH_AUTH_INFO",
  (email, name) => ({ payload: { email: email, name: name } }));
export const requestReadProfileConsent = createAction("REQUEST_READ_PROFILE_CONSENT");
export const fetchProfilePhoto = createAction("FETCH_PROFILE_PHOTO");
// Reducer actions:
export const setAuthResult = createAction("SET_AUTH_RESULT");
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
    builder => builder
      .addCase(setAuthResult, (state, action) => ({
        ...state,
        authResult: action.payload ? JSON.parse(action.payload) : undefined
      }))
      .addCase(setLoginState, (state, action) => ({
        ...state,
        loginState: action.payload
      }))
      .addCase(setAuthInfo, (state, action) => ({
        ...state,
        authInfo: action.payload
      }))
  )
);