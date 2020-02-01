"use strict";

import {combineEpics} from 'redux-observable'
import {loginEpic, logoutEpic} from "./ducks/AppState";

const rootEpic = combineEpics(
    loginEpic,
    logoutEpic,
    // autoLogoutEpic
);

export default rootEpic