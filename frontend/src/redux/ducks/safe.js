"use strict";

import { createAction, createReducer } from "@reduxjs/toolkit";
import { combineEpics, ofType } from "redux-observable";
import { filter, tap } from "rxjs/operators";
import store from "../store";
import { sendEvent } from "../../components/EventBroker";

export const fetchAll = createAction("SAFE_FETCH_ALL", () => ({ payload: null }));
export const saveAll = createAction("SAFE_SAVE_ALL", () => ({ payload: null }));
export const replaceSafeContent = createAction("SAFE_REPLACE_CONTENT");
export const replaceSafeInstance = createAction("SAFE_REPLACE_INSTANCE",
  (entity, id, instance) => ({ payload: { entity, id, instance } }));

const safeReducer = createReducer({}, {
  [replaceSafeContent]: (state, action) => action.payload ? action.payload : {},
  [replaceSafeInstance]: (state, action) => {
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
    tap(fetchAllFromRemote),
    filter(() => false)
  ),
  (actions$) => actions$.pipe(
    ofType(saveAll.type),
    tap(saveAllToRemote),
    filter(() => false)
  )
);

/**
 * {@code criteria} must be JSON, listing _ids per entity:
 * <pre>
 *   {
 *     "entity_1": [ "XXX", "YYY" ],
 *     "entity_2": [ "ZZZ" ]
 *   }
 * </pre>
 * 
 * TODO: determine instances tp fetch
 */
const fetchAllFromRemote = () => sendEvent(
  'fetch',
  {
    "account": ["uuid-account-1", "uuid-account-3"],
    "cv": ["uuid-cv-1"],
    "education": ["uuid-education-1"]
  },
  {},
  (message) => {
    console.debug(`Successfully received data`, message);
    store.dispatch(replaceSafeContent(message.body))
  },
  console.error);

const saveAllToRemote = () => sendEvent(
  'save',
  store.getState().safe,
  (message) => console.debug(`Successfully saved safe`, message),
  console.error);

/**
 * This function provides a set of helper functions to easily navigate the normalised Redux {@code store.safe} data.
 * @param entity - name of the entity
 * @param entityId
 * @param replaceInstance - function to store the instance, e.g. (id, instance) => dispatch(replaceSafeInstance(entity, id, instance))
 * @param locale - optional
 * @returns {{
 *   instance: *,
 *   getValue: (function(*, *=): *|string),
 *   getValueLocale: (function(*, *=): *|string),
 *   onChange: (function(*, *=): function(*=, *=): *),
 *   onChangeLocale: (function(*, *=): function(*=, *=): *)
 * }}
 */
export const mapHelpers = (entity, entityId, replaceInstance, locale) => {

  const instance = entity && entity[entityId];

  const getValue = (propertyName, defaultValue = '') =>
    instance && instance[propertyName] && instance[propertyName] || defaultValue;

  const getValueLocale = (propertyName, defaultValue = '') =>
    instance && instance[propertyName] && instance[propertyName][locale] || defaultValue;

  const defaultConvertEvent = (event) => event.target.value;

  const onChange = (propertyName, convert = defaultConvertEvent) => (event, option) => replaceInstance(
    entityId,
    {
      ...instance,
      [propertyName]: convert(event, option)
    });

  const onChangeLocale = (propertyName, convert = defaultConvertEvent) => (event, option) => replaceInstance(
    entityId,
    {
      ...instance,
      [propertyName]: {
        ...instance[propertyName],
        [locale]: convert(event, option)
      }
    });

  return {
    instance,
    getValue,
    getValueLocale,
    onChange,
    onChangeLocale
  };
};