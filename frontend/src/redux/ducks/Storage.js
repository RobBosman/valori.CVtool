"use strict";

import {ofType} from "redux-observable";
import {TheEventBus} from "../../components/EventBridge"
import {filter} from "rxjs/operators";

const SAVE = "SAVE";

export const save = () => ({type: SAVE});

const saveData = () => {
    TheEventBus && TheEventBus.send('cv.data.set', {name: 'dummy', age: "gibberish"}, (error, message) => {
        if (error) {
            console.error("error saving data: ", error)
        } else {
            console.log("data saved successfully", message);
            return true
        }
    });
    return false
};

export const saveEpic = (actions$) =>
    actions$.pipe(
        ofType(SAVE),
        filter(saveData)
    );