"use strict";

import {combineEpics, ofType} from "redux-observable"
import {filter} from "rxjs/operators"
import {sendEvent} from "../../components/EventBroker"
import store from "../store"
import {heavyWait} from "../utils"

const LOAD = "LOAD";
const SAVE = "SAVE";
const SET_PERSISTENT_DATA = "SET_PERSISTENT_DATA";

export const load = () => ({type: LOAD});
export const save = () => ({type: SAVE});
export const setPersistentData = (value) => ({type: SET_PERSISTENT_DATA, value});

const reducer = (subState = {}, action) => {
    switch (action.type) {
        case SET_PERSISTENT_DATA:
            return action.value;
        default:
            return subState
    }
};

export default reducer

export const storageEpics = combineEpics(
    (actions$) => actions$.pipe(
        filter((action) => {
            console.log("action", action);
            heavyWait('any action', 0);
            return false
        })
    ),
    (actions$) => actions$.pipe(
        ofType(LOAD),
        filter(loadData)
    ),
    (actions$) => actions$.pipe(
        ofType(SAVE),
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