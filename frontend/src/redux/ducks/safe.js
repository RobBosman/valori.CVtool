"use strict";

import {createAction, createReducer} from "@reduxjs/toolkit";
import reduceReducers from "reduce-reducers";
import {combineEpics, ofType} from "redux-observable";
import {flatMap} from "rxjs/operators";
import store from "../store";
import accountReducer from "./accountDuck";
import profileReducer from "./profileDuck";
import educationReducer from "./educationDuck";
import {sendEvent} from "../../components/EventBroker";
import {fromArray} from "rxjs/internal/observable/fromArray";

export const fetch = createAction("FETCH", () => ({payload: null}));
export const save = createAction("SAVE", () => ({payload: null}));
export const setSafeContent = createAction("SET_SAFE_CONTENT");

const initialState = {
    account: {},
    cv: {}
};

const safeReducer = createReducer({}, {
    [setSafeContent]: (state, action) => (action.payload ? action.payload : initialState)
});

export const combinedSafeReducer = reduceReducers(initialState,
    accountReducer,
    profileReducer,
    educationReducer,
    safeReducer
);

export default combinedSafeReducer


export const safeEpics = combineEpics(
    (actions$) => actions$.pipe(
        ofType(fetch.type),
        flatMap(fetchActions)
    ),
    (actions$) => actions$.pipe(
        ofType(save.type),
        flatMap(saveActions)
    )
);

const fetchActions = () => {
    sendEvent('cv.data.get', {}, {}, (error, message) => {
        if (error) {
            console.error("Error fetching safe content:", error)
        } else {
            console.debug("Safe content received successfully:", message);
            store.dispatch(setSafeContent(message.body[0]));
        }
    });
    return fromArray([])
};

const saveActions = () => {
    const safeData = store.getState().safe;
    console.debug("Saving safe content: ", safeData);
    sendEvent('cv.data.set', safeData, {}, (error, message) => {
        if (error) {
            console.error("Error saving safe content:", error)
        } else {
            console.debug("Safe content saved successfully:", message)
        }
    });
    return fromArray([])
};