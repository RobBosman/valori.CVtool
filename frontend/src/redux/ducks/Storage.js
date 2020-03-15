"use strict";

import {combineEpics, ofType} from "redux-observable"
import {filter} from "rxjs/operators"
import {sendEvent} from "../../components/EventBroker"
import store from "../store";
import {setCvContent} from "./CvContent";

const LOAD = "LOAD";
const SAVE = "SAVE";

export const load = () => ({type: LOAD});
export const save = () => ({type: SAVE});


const loadData = () => {
    sendEvent('cv.data.get', {}, {}, (error, message) => {
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
    sendEvent('cv.data.set', {name: 'John', age: Math.random()}, {}, (error, message) => {
        if (error) {
            console.error("Error saving data:", error)
        } else {
            console.log("Data saved successfully:", message);
            return true
        }
    });
    return false
};

export const storageEpics = combineEpics(
    (actions$) =>
        actions$.pipe(
            ofType(LOAD),
            filter(loadData)
        ),
    (actions$) =>
        actions$.pipe(
            ofType(SAVE),
            filter(saveData)
        )
);