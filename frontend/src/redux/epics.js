"use strict";

import {combineEpics} from 'redux-observable'
import {appStateEpics} from "./ducks/AppState"
import {storageEpics} from "./ducks/Storage"

const rootEpic = combineEpics(
    appStateEpics,
    storageEpics
);

export default rootEpic