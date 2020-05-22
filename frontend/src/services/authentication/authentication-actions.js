"use strict";

import { createAction, createReducer } from "@reduxjs/toolkit";
import reducerRegistry from "../../redux/reducerRegistry";

export const requestLogin = createAction("AUTHENTICATION_REQUEST_LOGIN", () => ({}));
export const requestLogout = createAction("AUTHENTICATION_REQUEST_LOGOUT", () => ({}));
export const confirmLogin = createAction("AUTHENTICATION_CONFIRM_LOGIN", () => ({}));
export const confirmLogout = createAction("AUTHENTICATION_CONFIRM_LOGOUT", () => ({}));
export const setAccount = createAction("AUTHENTICATION_SET_ACCOUNT");

export const LoginStates = {
  LOGGED_OUT: "LOGGED_OUT",
  LOGGING_IN: "LOGGING_IN",
  LOGGED_IN: "LOGGED_IN",
  LOGGING_OUT: "LOGGING_OUT"
};

const reducer = createReducer(
  {
    loginState: LoginStates.LOGGED_OUT
  },
  {
    [requestLogin]: (state) => {
      state.loginState = LoginStates.LOGGING_IN
    },
    [requestLogout]: (state) => {
      state.loginState = LoginStates.LOGGING_OUT
    },
    [confirmLogin]: (state) => {
      state.loginState = LoginStates.LOGGED_IN
    },
    [confirmLogout]: (state) => {
      state.loginState = LoginStates.LOGGED_OUT
    },
    [setAccount]: (state, action) => {
      state.account = action.payload
    }
  });

reducerRegistry.register('authentication', reducer);