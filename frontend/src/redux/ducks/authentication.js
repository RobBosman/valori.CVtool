"use strict";

import {createAction, createReducer} from "@reduxjs/toolkit";
import {combineEpics, ofType} from "redux-observable";
import {delay, flatMap} from "rxjs/operators";
import {setAccountId} from "./ui";
import {fromArray} from "rxjs/internal/observable/fromArray";
import {setSafeContent} from "./safe";

export const requestLogin = createAction("REQUEST_LOGIN", () => ({payload: null}));
export const confirmLogin = createAction("CONFIRM_LOGIN", () => ({payload: null}));
export const requestLogout = createAction("REQUEST_LOGOUT", () => ({payload: null}));
export const confirmLogout = createAction("CONFIRM_LOGOUT", () => ({payload: null}));

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
        delay(100),
        flatMap(loginActions)
    ),
    (actions$) => actions$.pipe(
        ofType(requestLogout.type),
        delay(100),
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