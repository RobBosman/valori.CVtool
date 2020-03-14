"use strict";

import {ofType} from "redux-observable"
import {filter} from "rxjs/operators"
import {sendEvent} from "../../components/EventBroker"

const LOAD = "LOAD";
const SAVE = "SAVE";

export const load = () => ({type: LOAD});
export const save = () => ({type: SAVE});

const loadData = () => {
    sendEvent('cv.data.get', {_id: '321'}, {}, (error, message) => {
        if (error) {
            console.error("Error loading data:", error)
        } else {
            console.log("Data loaded successfully:", message);
            return true
        }
    });
    return false
};

const saveData = () => {
    sendEvent('cv.data.set', {_id: "321", name: 'dummy', age: "gibberish"}, {}, (error, message) => {
        if (error) {
            console.error("Error saving data:", error)
        } else {
            console.log("Data saved successfully:", message);
            return true
        }
    });
    return false
};

export const loadEpic = (actions$) =>
    actions$.pipe(
        ofType(LOAD),
        filter(loadData)
    );

export const saveEpic = (actions$) =>
    actions$.pipe(
        ofType(SAVE),
        filter(saveData)
    );