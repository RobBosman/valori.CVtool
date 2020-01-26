"use strict";

import {combineEpics} from 'redux-observable'
import {autoLogoutEpic, loginEpic, logoutEpic} from "./ducks/AppState";

const rootEpic = combineEpics(
    loginEpic,
    autoLogoutEpic,
    logoutEpic
);

export default rootEpic