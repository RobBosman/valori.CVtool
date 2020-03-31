"use strict";

import {combineEpics} from 'redux-observable'
import {appStateEpics} from "./ducks/AppState"
import {safeEpics} from "./ducks/Safe"

const rootEpic = combineEpics(
    appStateEpics,
    safeEpics
);

export default rootEpic