"use strict";

import {createAction, createReducer} from "@reduxjs/toolkit"
import {combineEpics, ofType} from "redux-observable"
import {delay, map} from "rxjs/operators"

export const requestLogin = createAction("REQUEST_LOGIN");
export const confirmLogin = createAction("CONFIRM_LOGIN");
export const requestLogout = createAction("REQUEST_LOGOUT");
export const confirmLogout = createAction("CONFIRM_LOGOUT");

export const AppStates = {
    LOGGED_OUT: "LOGGED_OUT",
    LOGGING_IN: "LOGGING_IN",
    LOGGED_IN: "LOGGED_IN",
    LOGGING_OUT: "LOGGING_OUT"
};

const reducer = createReducer(AppStates.LOGGED_OUT, {
    [requestLogin]: (state, action) => AppStates.LOGGING_IN,
    [confirmLogin]: (state, action) => AppStates.LOGGED_IN,
    [requestLogout]: (state, action) => AppStates.LOGGING_OUT,
    [confirmLogout]: (state, action) => AppStates.LOGGED_OUT
});

export default reducer

export const appStateEpics = combineEpics(
    (actions$) => actions$.pipe(
        ofType(requestLogin.type),
        delay(1),
        map(confirmLogin)
    ),
    (actions$) => actions$.pipe(
        ofType(requestLogout.type),
        delay(1),
        map(confirmLogout)
    )
    // (actions$) => actions$.pipe(
    //     ofType(confirmLogin.type),
    //     delay(10000),
    //     mapTo(requestLogout())
    // )
);