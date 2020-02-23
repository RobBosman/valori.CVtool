"use strict";

import {combineEpics} from 'redux-observable'
import {loginEpic, logoutEpic} from "./ducks/AppState";
import {saveEpic} from "./ducks/Storage";

const rootEpic = combineEpics(
    loginEpic,
    logoutEpic,
    saveEpic
    // autoLogoutEpic
);

export default rootEpic