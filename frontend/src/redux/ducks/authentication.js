"use strict";

import { createAction, createReducer } from "@reduxjs/toolkit";
import { combineEpics, ofType } from "redux-observable";
import { filter, flatMap, map, tap } from "rxjs/operators";
import { fromArray } from "rxjs/internal/observable/fromArray";
import store from "../store";
import { setAccountId } from "./ui";
import { replaceSafeContent, replaceSafeInstance } from "./safe";
import { EventBusStates, updateEventBusState } from "./eventBus";
import { sendEvent } from "../../components/EventBroker";

export const requestLogin = createAction("AUTHENTICATION_REQUEST_LOGIN", () => ({}));
export const confirmLogin = createAction("AUTHENTICATION_CONFIRM_LOGIN", () => ({}));
export const requestLogout = createAction("AUTHENTICATION_REQUEST_LOGOUT", () => ({}));
export const confirmLogout = createAction("AUTHENTICATION_CONFIRM_LOGOUT", () => ({}));

export const AuthenticationStates = {
  LOGGED_OUT: "LOGGED_OUT",
  LOGGING_IN: "LOGGING_IN",
  LOGGED_IN: "LOGGED_IN",
  LOGGING_OUT: "LOGGING_OUT"
};

const authenticationReducer = createReducer(AuthenticationStates.LOGGED_OUT, {
  [requestLogin]: () => AuthenticationStates.LOGGING_IN,
  [confirmLogin]: () => AuthenticationStates.LOGGED_IN,
  [requestLogout]: () => AuthenticationStates.LOGGING_OUT,
  [confirmLogout]: () => AuthenticationStates.LOGGED_OUT
});

export default authenticationReducer

export const authenticationEpics = combineEpics(
  (actions$) => actions$.pipe(
    ofType(requestLogin.type),
    tap(loginToRemote),
    filter(() => false)
  ),
  (actions$) => actions$.pipe(
    ofType(updateEventBusState.type),
    tap(loginToRemote),
    filter(() => false)
  ),
  (actions$) => actions$.pipe(
    ofType(requestLogout.type),
    flatMap(() => fromArray([
      replaceSafeContent(undefined),
      setAccountId(undefined)
    ]))
  ),
  (actions$) => actions$.pipe(
    ofType(setAccountId.type),
    map((action) => action.payload ? confirmLogin() : confirmLogout())
  )
  // (actions$) => actions$.pipe(
  //     ofType(confirmLogin.type),
  //     delay(10000),
  //     mapTo(requestLogout())
  // )
);

const loginToRemote = () => {
  if (!store.getState().ui.accountId
    && store.getState().eventBus === EventBusStates.CONNECTED) {
    sendEvent(
      'login',
      { authorizationCode: "My AuthCode" }, // TODO obtain authorization code
      {},
      (message) => {
        console.log("You successfully logged in", message);
        Object.keys(message.body)
          .forEach((entity) => {
            const instances = message.body[entity];
            Object.keys(instances)
              .forEach((id) => {
                store.dispatch(replaceSafeInstance(entity, id, instances[id]));
                store.dispatch(setAccountId(id))
              })
          })
      },
      console.error);
  }
};