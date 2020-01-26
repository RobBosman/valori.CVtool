"use strict";

import {combineReducers} from "redux";
import appState from './ducks/AppState'

const rootReducer = combineReducers({
    appState
});

export default rootReducer