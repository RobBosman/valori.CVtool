"use strict";

import {combineReducers} from "redux"
import appState from './ducks/AppState'
import eventBusState from './ducks/EventBusState'
import reduceReducers from "reduce-reducers"
import account from "./ducks/Account"
import cv from "./ducks/Cv"
import safe from "./ducks/Safe"

const safeReducer = reduceReducers(
    {
        account: {},
        cv: {}
    },
    account,
    cv,
    safe
);

const rootReducer = combineReducers({
    appState,
    eventBusState,
    safe: safeReducer
});

export default rootReducer