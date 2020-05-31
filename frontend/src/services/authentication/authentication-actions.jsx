"use strict";

import { createAction, createReducer } from "@reduxjs/toolkit";
import reducerRegistry from "../../redux/reducerRegistry";

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

const reducer = createReducer(
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
  });

reducerRegistry.register("authentication", reducer);