"use strict";

import {ofType} from "redux-observable"
import {filter} from "rxjs/operators"
import EventBroker from "../../components/EventBroker";

const SAVE = "SAVE";

export const save = () => ({type: SAVE});

const saveData = () => {
    EventBroker.send('cv.data.set', {name: 'dummy', age: "gibberish"}, (error, message) => {
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