"use strict";

import {combineReducers} from "redux";
import appState from './ducks/AppState'
import cvContent from './ducks/CvContent'

const rootReducer = combineReducers({
    appState: appState,
    cvContent: cvContent
});

export default rootReducer