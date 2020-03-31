"use strict";

import {createAction, createReducer} from "@reduxjs/toolkit"
import {combineEpics, ofType} from "redux-observable"
import {filter} from "rxjs/operators"
import {sendEvent} from "../../components/EventBroker"
import store from "../store"
import {heavyWait} from "../utils"

export const fetch = createAction("FETCH");
export const save = createAction("SAVE");
const setSafeContent = createAction("SET_SAFE_CONTENT");

const reducer = createReducer({}, {
    [setSafeContent]: (state, action) => action.payload
});

export default reducer

export const safeEpics = combineEpics(
    (actions$) => actions$.pipe(
        filter((action) => {
            // console.debug("action", action);
            heavyWait('any action', 0);
            return false
        })
    ),
    (actions$) => actions$.pipe(
        ofType(fetch.type),
        filter(fetchSafeContent)
    ),
    (actions$) => actions$.pipe(
        ofType(save.type),
        filter(saveSafeContent)
    )
);

const fetchSafeContent = () => {
    sendEvent('cv.data.get', {}, {}, (error, message) => {
        if (error) {
            console.error("Error fetching safe content:", error)
        } else {
            console.debug("Safe content received successfully:", message);
            store.dispatch(setSafeContent(message.body[0]));
        }
    });
    return false
};

const saveSafeContent = () => {
    const safeContent = store.getState().safe;
    console.debug("Saving safe content: ", safeContent);
    sendEvent('cv.data.set', safeContent, {}, (error, message) => {
        if (error) {
            console.error("Error saving safe content:", error)
        } else {
            console.debug("Safe content saved successfully:", message)
        }
    });
    return false
};