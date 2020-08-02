import { createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../redux/reducerRegistry";

export const requestLogin = createAction("REQUEST_LOGIN", () => ({}));
export const requestLogout = createAction("REQUEST_LOGOUT", () => ({}));
export const setAuthenticationInfo = createAction("SET_AUTHENTICATION_INFO");
export const fetchAccountInfo = createAction("FETCH_ACCOUNT_INFO", () => ({}));
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