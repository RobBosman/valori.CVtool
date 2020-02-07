"use strict";

import {ofType} from "redux-observable"
import {delay, mapTo} from "rxjs/operators"

const REQUEST_LOGIN = "REQUEST_LOGIN";
const CONFIRM_LOGIN = "CONFIRM_LOGIN";
const REQUEST_LOGOUT = "REQUEST_LOGOUT";
const CONFIRM_LOGOUT = "CONFIRM_LOGOUT";

export const requestLogin = (name) => ({type: REQUEST_LOGIN, name});
export const confirmLogin = () => ({type: CONFIRM_LOGIN});
export const requestLogout = () => ({type: REQUEST_LOGOUT});
export const confirmLogout = () => ({type: CONFIRM_LOGOUT});

export const AppStates = {
    LOGGED_OUT: "LOGGED_OUT",
    LOGGING_IN: "LOGGING_IN",
    LOGGED_IN: "LOGGED_IN",
    LOGGING_OUT: "LOGGING_OUT"
};

const reducer = (subState = AppStates.LOGGED_OUT, action) => {
    switch (action.type) {
        case REQUEST_LOGIN:
            return AppStates.LOGGING_IN;
        case CONFIRM_LOGIN:
            return AppStates.LOGGED_IN;
        case REQUEST_LOGOUT:
            return AppStates.LOGGING_OUT;
        case CONFIRM_LOGOUT:
            return AppStates.LOGGED_OUT;
        default:
            return subState;
    }
};
export default reducer

export const loginEpic = (actions$) =>
    actions$.pipe(
        ofType(REQUEST_LOGIN),
        delay(500),
        mapTo(confirmLogin())
    );

export const logoutEpic = (actions$) =>
    actions$.pipe(
        ofType(REQUEST_LOGOUT),
        delay(500),
        mapTo(confirmLogout())
    );

export const autoLogoutEpic = (actions$) =>
    actions$.pipe(
        ofType(CONFIRM_LOGIN),
        delay(10000),
        mapTo(requestLogout())
    );