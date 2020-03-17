"use strict";

import {combineReducers} from "redux"
import appState from './ducks/AppState'
import eventBusState from './ducks/EventBusState'
import cvContent from './ducks/CvContent'

const rootReducer = combineReducers({
    appState: appState,
    eventBusState: eventBusState,
    cvContent: cvContent
});

export default rootReducer