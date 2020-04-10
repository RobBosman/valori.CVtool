"use strict";

import {combineReducers} from "redux";
import {combineEpics, createEpicMiddleware} from 'redux-observable';
import {configureStore} from "@reduxjs/toolkit";
import authenticationReducer, {authenticationEpics} from "./authentication";
import eventBusReducer from "./eventBus";
import uiReducer from "./ui";
import safeReducer, {safeEpics} from "./safe";
import {filter} from "rxjs/operators";
import {heavyWait} from "./../app";

const rootReducer = combineReducers({
    authentication: authenticationReducer,
    eventBus: eventBusReducer,
    ui: uiReducer,
    safe: safeReducer
});

export const debugEpics = combineEpics(
    (actions$) => actions$.pipe(
        filter((action) => {
            // console.debug("dispatched: ", action);
            heavyWait(action.type, 0);
            return false
        })
    )
);

const rootEpic = combineEpics(
    authenticationEpics,
    safeEpics,
    debugEpics
);

const epicMiddleware = createEpicMiddleware();

const store = configureStore({
    reducer: rootReducer,
    middleware: [epicMiddleware]
});

epicMiddleware.run(rootEpic);

export default store