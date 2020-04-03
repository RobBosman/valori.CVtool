"use strict";

import {createAction, createReducer} from "@reduxjs/toolkit";
import {combineEpics, ofType} from "redux-observable";
import {flatMap} from "rxjs/operators";
import store from "../store";
import {sendEvent} from "../../components/EventBroker";
import {fromArray} from "rxjs/internal/observable/fromArray";

export const fetch = createAction("FETCH", () => ({payload: null}));
export const save = createAction("SAVE", () => ({payload: null}));
export const setSafeContent = createAction("SET_SAFE_CONTENT");
export const setEntity = createAction("SET_ENTITY", (entity, id, value) => ({payload: {entity, id, value}}));

const combinedSafeReducer = createReducer({}, {
    [setSafeContent]: (state, action) => action.payload ? action.payload : {},
    [setEntity]: (state, action) => {
        state[action.payload.entity][action.payload.id] = action.payload.value
    }
});

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