"use strict";

import {createAction, createReducer} from "@reduxjs/toolkit"
import {combineEpics, ofType} from "redux-observable"
import {filter} from "rxjs/operators"
import {sendEvent} from "../../components/EventBroker"
import store from "../store"
import {heavyWait} from "../utils"

export const load = createAction("LOAD");
export const save = createAction("SAVE");
const setPersistentData = createAction("SET_PERSISTENT_DATA", (value) => ({payload: value}));

const reducer = createReducer({}, {
    [setPersistentData.type]: (state, action) => action.payload
});

export default reducer

export const storageEpics = combineEpics(
    (actions$) => actions$.pipe(
        filter((action) => {
            // console.log("action", action);
            heavyWait('any action', 0);
            return false
        })
    ),
    (actions$) => actions$.pipe(
        ofType(load.type),
        filter(loadData)
    ),
    (actions$) => actions$.pipe(
        ofType(save.type),
        filter(saveData)
    )
);

const loadData = () => {
    sendEvent('cv.data.get', {}, {}, (error, message) => {
        if (error) {
            console.error("Error loading data:", error)
        } else {
            console.debug("Data received successfully:", message);
            store.dispatch(setPersistentData(message.body[0]));
        }
    });
    return false
};

const saveData = () => {
    const data = store.getState().persistent;
    console.debug("Saving data: ", data);
    sendEvent('cv.data.set', data, {}, (error, message) => {
        if (error) {
            console.error("Error saving data:", error)
        } else {
            console.debug("Data saved successfully:", message)
        }
    });
    return false
};