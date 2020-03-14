"use strict";

import {combineEpics} from 'redux-observable'
import {loginEpic, logoutEpic} from "./ducks/AppState";
import {loadEpic, saveEpic} from "./ducks/Storage";

const rootEpic = combineEpics(
    loginEpic,
    logoutEpic,
    loadEpic,
    saveEpic
    // autoLogoutEpic
);

export default rootEpic