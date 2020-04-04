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
export const setSafeInstance = createAction("SET_SAFE_INSTANCE",
    (entity, id, instance) => ({payload: {entity, id, instance}}));

const combinedSafeReducer = createReducer({}, {
    [setSafeContent]: (state, action) => action.payload ? action.payload : {},
    [setSafeInstance]: (state, action) => {
        state[action.payload.entity][action.payload.id] = action.payload.instance
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

/**
 * This function provides a set of helper functions to easily navigate the normalised Redux {@code store.safe} data.
 * @param entity
 * @param entityId
 * @param onChangeEntity
 * @param locale
 * @returns {{
 *   instance: *,
 *   getValue: (function(*, *=): *|string),
 *   getValueLocale: (function(*, *=): *|string),
 *   onChange: (function(*, *=): function(*=, *=): *),
 *   onChangeLocale: (function(*, *=): function(*=, *=): *)
 * }}
 */
export const mapHelpers = (entity, entityId, onChangeEntity, locale) => {

    const instance = entity && entity[entityId];

    const getValue = (propertyName, defaultValue = '') =>
        instance && instance[propertyName] && instance[propertyName] || defaultValue;

    const getValueLocale = (propertyName, defaultValue = '') =>
        instance && instance[propertyName] && instance[propertyName][locale] || defaultValue;

    const defaultConvertEvent = (event) => event.target.value;

    const onChange = (propertyName, convert = defaultConvertEvent) => (event, option) => onChangeEntity({
            ...instance,
            [propertyName]: convert(event, option)
        },
        entityId);

    const onChangeLocale = (propertyName, convert = defaultConvertEvent) => (event, option) => onChangeEntity({
            ...instance,
            [propertyName]: {
                ...instance[propertyName],
                [locale]: convert(event, option)
            }
        },
        entityId);

    return {
        instance,
        getValue,
        getValueLocale,
        onChange,
        onChangeLocale
    };
};