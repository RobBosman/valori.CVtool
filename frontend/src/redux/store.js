"use strict";

import {applyMiddleware, createStore} from 'redux'
import {createEpicMiddleware} from 'redux-observable'
import rootReducer from './reducers'
import rootEpic from './epics'

const epicMiddleware = createEpicMiddleware();

const store = createStore(
    rootReducer,
    applyMiddleware(
        epicMiddleware
    ));

epicMiddleware.run(rootEpic);

export default store