"use strict";

import { createAction, createReducer } from "@reduxjs/toolkit";
import { combineEpics, ofType } from "redux-observable";
import { filter, flatMap, map, tap, delay } from "rxjs/operators";
import { fromArray } from "rxjs/internal/observable/fromArray";
import store from "./store";
import { replaceSafeContent, fetchAll } from "./safe";
import { EventBusStates, updateEventBusState } from "./eventBus";
import { sendEvent } from "../components/EventBroker";

export const requestLogin = createAction("AUTHENTICATION_REQUEST_LOGIN", () => ({}));
export const requestLogout = createAction("AUTHENTICATION_REQUEST_LOGOUT", () => ({}));
const confirmLogin = createAction("AUTHENTICATION_CONFIRM_LOGIN", () => ({}));
const confirmLogout = createAction("AUTHENTICATION_CONFIRM_LOGOUT", () => ({}));
const setAccount = createAction("AUTHENTICATION_SET_ACCOUNT");

export const LoginStates = {
  LOGGED_OUT: "LOGGED_OUT",
  LOGGING_IN: "LOGGING_IN",
  LOGGED_IN: "LOGGED_IN",
  LOGGING_OUT: "LOGGING_OUT"
};

const authenticationReducer = createReducer(
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

export default authenticationReducer

export const authenticationEpics = combineEpics(
  (actions$) => actions$.pipe(
    ofType(requestLogin.type, updateEventBusState.type),
    delay(1000), // TODO - remove delay
    tap(loginToRemote),
    filter(() => false)
  ),
  (actions$) => actions$.pipe(
    ofType(setAccount.type),
    filter((action) => action.payload),
    flatMap(() => fromArray([
      confirmLogin(),
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
    map((action) => confirmLogout())
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
                console.debug("You successfully logged in", message);
              })
          })
      },
      console.error);
  }
};