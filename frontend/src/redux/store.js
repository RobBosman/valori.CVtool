"use strict";

import {combineReducers} from "redux";
import {combineEpics, createEpicMiddleware} from 'redux-observable';
import {configureStore} from "@reduxjs/toolkit";
import authenticationReducer, {authenticationEpics} from "./ducks/authentication";
import eventBusReducer from "./ducks/eventBus";
import uiReducer from "./ducks/ui";
import safeReducer, {safeEpics} from "./ducks/safe";
import {filter} from "rxjs/operators";
import {heavyWait} from "./utils";

const rootReducer = combineReducers({
    authentication: authenticationReducer,
    eventBus: eventBusReducer,
    ui: uiReducer,
    safe: safeReducer
});

export const devEpics = combineEpics(
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
    devEpics
);

const epicMiddleware = createEpicMiddleware();

const store = configureStore({
    reducer: rootReducer,
    middleware: [epicMiddleware]
});

epicMiddleware.run(rootEpic);

export default store