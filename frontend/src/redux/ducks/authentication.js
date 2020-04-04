"use strict";

import {createAction, createReducer} from "@reduxjs/toolkit";
import {combineEpics, ofType} from "redux-observable";
import {delay, flatMap} from "rxjs/operators";
import {setAccountId} from "./ui";
import {fromArray} from "rxjs/internal/observable/fromArray";
import {setSafeContent} from "./safe";

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
        delay(0),
        flatMap(loginActions)
    ),
    (actions$) => actions$.pipe(
        ofType(requestLogout.type),
        delay(0),
        flatMap(logOutActions)
    )
    // (actions$) => actions$.pipe(
    //     ofType(confirmLogin.type),
    //     delay(10000),
    //     mapTo(requestLogout())
    // )
);

const loginActions = () =>
    fromArray([
        setAccountId('uuid-account-1'),
        confirmLogin()
    ]);

const logOutActions = () =>
    fromArray([
        setSafeContent(undefined),
        setAccountId(undefined),
        confirmLogout()
    ]);