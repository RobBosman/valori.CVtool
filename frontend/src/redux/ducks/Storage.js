"use strict";

import {combineEpics, ofType} from "redux-observable"
import {filter} from "rxjs/operators"
import {sendEvent} from "../../components/EventBroker"
import store from "../store";
import {setCvContent} from "./CvContent";
import {heavyWait} from "../utils";

const LOAD = "LOAD";
const SAVE = "SAVE";

export const load = () => ({type: LOAD});
export const save = () => ({type: SAVE});

const loadData = () => {
    sendEvent('cv.data.get', {}, {}, (error, message) => {
        if (error) {
            console.error("Error loading data:", error)
        } else {
            console.debug("Data received successfully:", message);
            store.dispatch(setCvContent(message.body[0]));
        }
    });
    return false
};

const saveData = () => {

    const data = store.getState().cvContent;

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

export const storageEpics = combineEpics(
    (actions$) => actions$.pipe(
        filter((action) => {
            // console.log("action", action);
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