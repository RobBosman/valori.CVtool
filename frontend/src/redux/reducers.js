"use strict";

import {combineReducers} from "redux"
import appState from './ducks/AppState'
import eventBusState from './ducks/EventBusState'
import reduceReducers from "reduce-reducers"
import account from "./ducks/Account"
import cv from "./ducks/Cv"
import storage from "./ducks/Storage"

const persistentReducer = reduceReducers(
    {
        account: {},
        cv: {}
    },
    account,
    cv,
    storage
);

const rootReducer = combineReducers({
    appState,
    eventBusState,
    persistent: persistentReducer
});

export default rootReducer