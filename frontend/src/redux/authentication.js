"use strict";

import { createAction, createReducer } from "@reduxjs/toolkit";
import { combineEpics, ofType } from "redux-observable";
import { filter, flatMap, map, tap } from "rxjs/operators";
import { fromArray } from "rxjs/internal/observable/fromArray";
import store from "./store";
import { replaceSafeContent, replaceSafeInstance } from "./safe";
import { EventBusStates, updateEventBusState } from "./eventBus";
import { sendEvent } from "../components/EventBroker";

export const requestLogin = createAction("AUTHENTICATION_REQUEST_LOGIN", () => ({}));
export const requestLogout = createAction("AUTHENTICATION_REQUEST_LOGOUT", () => ({}));
const confirmLogin = createAction("AUTHENTICATION_CONFIRM_LOGIN", () => ({}));
const confirmLogout = createAction("AUTHENTICATION_CONFIRM_LOGOUT", () => ({}));
const setAccount = createAction("AUTHENTICATION_SET_ACCOUNT");

export const AuthenticationStates = {
  LOGGED_OUT: "LOGGED_OUT",
  LOGGING_IN: "LOGGING_IN",
  LOGGED_IN: "LOGGED_IN",
  LOGGING_OUT: "LOGGING_OUT"
};

const authenticationReducer = createReducer(
  {
    loginState: AuthenticationStates.LOGGED_OUT
  },
  {
    [requestLogin]: (state) => {
      state.loginState = AuthenticationStates.LOGGING_IN
    },
    [requestLogout]: (state) => {
      state.loginState = AuthenticationStates.LOGGING_OUT
    },
    [confirmLogin]: (state) => {
      state.loginState = AuthenticationStates.LOGGED_IN
    },
    [confirmLogout]: (state) => {
      state.loginState = AuthenticationStates.LOGGED_OUT
    },
    [setAccount]: (state, action) => {
      state.account = action.payload
    }
  });

export default authenticationReducer

export const authenticationEpics = combineEpics(
  (actions$) => actions$.pipe(
    ofType(requestLogin.type, updateEventBusState.type),
    tap(loginToRemote),
    filter(() => false)
  ),
  (actions$) => actions$.pipe(
    ofType(requestLogout.type),
    flatMap(() => fromArray([
      replaceSafeContent(undefined),
      setAccount(undefined)
    ]))
  ),
  (actions$) => actions$.pipe(
    ofType(setAccount.type),
    map((action) => action.payload ? confirmLogin() : confirmLogout())
  )
);

const loginToRemote = () => {
  if (!store.getState().ui.account
    && store.getState().eventBus === EventBusStates.CONNECTED) {
    sendEvent(
      'login',
      { authenticationCode: "My AuthCode" }, // TODO obtain authentication code
      {},
      (message) => {
        Object.keys(message.body)
          .forEach((entity) => {
            const instances = message.body[entity];
            Object.keys(instances)
              .forEach((id) => {
                store.dispatch(setAccount(instances[id]))
                console.log("You successfully logged in", message);
              })
          })
      },
      console.error);
  }
};