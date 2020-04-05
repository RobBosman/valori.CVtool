"use strict";

import {createAction, createReducer} from "@reduxjs/toolkit";
import {combineEpics, ofType} from "redux-observable";
import {filter} from "rxjs/operators";
import store from "../store";
import {sendEvent} from "../../components/EventBroker";

export const fetchAll = createAction("FETCH_ALL", () => ({payload: null}));
export const saveAll = createAction("SAVE_ALL", () => ({payload: null}));
export const setSafeContent = createAction("SAFE_SET_CONTENT");
export const setSafeInstance = createAction("SAFE_SET_INSTANCE",
    (entity, id, instance) => ({payload: {entity, id, instance}}));

const safeReducer = createReducer({}, {
    [setSafeContent]: (state, action) => action.payload ? action.payload : {},
    [setSafeInstance]: (state, action) => {
        if (!state[action.payload.entity]) {
            state[action.payload.entity] = {}
        }
        state[action.payload.entity][action.payload.id] = action.payload.instance
    }
});

export default safeReducer

export const safeEpics = combineEpics(
    (actions$) => actions$.pipe(
        ofType(fetchAll.type),
        filter(fetchAllFromRemote)
    ),
    (actions$) => actions$.pipe(
        ofType(saveAll.type),
        filter(saveAllToRemote)
    )
);

const fetchAllFromRemote = () => {
    [
        // 'safe',
        'account',
        'cv',
        'education'
    ].map(entity => {
        // const _id = 'uuid-account-1';
        sendEvent('fetch', {}, {entity}, (error, message) => {
            if (error) {
                console.error(`Error fetching safe.${entity}`, error)
            } else {
                console.debug(`Successfully received safe.${entity}`, message);
                message.body
                    .map(instance => {
                        if (entity === 'safe') {
                            store.dispatch(setSafeContent(instance))
                        } else {
                            store.dispatch(setSafeInstance(entity, instance._id, instance))
                        }
                    })
            }
        });
    });
    return false
};

const saveAllToRemote = () => {
    const safeContent = store.getState().safe;
    Object.keys(safeContent)
        .map((entity) => {
            sendEvent('save', safeContent[entity], {entity}, (error, message) => {
                if (error) {
                    console.error(`Error saving safe.${entity}`, error)
                } else {
                    console.debug(`Successfully saved safe.${entity}`, message)
                }
            });
        });
    return false
};

/**
 * This function provides a set of helper functions to easily navigate the normalised Redux {@code store.safe} data.
 * @param entity - name of the entity
 * @param entityId
 * @param onChangeEntity - function to store the instance, e.g. (instance, id) => dispatch(setSafeInstance(entity, instance, id))
 * @param locale - optional
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