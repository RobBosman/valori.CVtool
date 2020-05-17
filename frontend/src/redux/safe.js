"use strict";

import { createAction, createReducer } from "@reduxjs/toolkit";
import { combineEpics, ofType } from "redux-observable";
import { filter, tap } from "rxjs/operators";
import store from "./store";
import { sendEvent } from "../components/EventBroker";

export const fetchAll = createAction("SAFE_FETCH_ALL", () => ({ payload: null }));
export const saveAll = createAction("SAFE_SAVE_ALL", () => ({ payload: null }));
export const replaceSafeContent = createAction("SAFE_REPLACE_CONTENT");
export const replaceSafeInstance = createAction("SAFE_REPLACE_INSTANCE",
  (entity, id, instance) => ({ payload: { entity, id, instance } }));

const safeReducer = createReducer({}, {
  [replaceSafeContent]: (_state, action) => action.payload ? action.payload : {},
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
    tap(fetchCvFromRemote),
    filter(() => false)
  ),
  (actions$) => actions$.pipe(
    ofType(saveAll.type),
    tap(saveAllToRemote),
    filter(() => false)
  )
);

const fetchCvFromRemote = () => {
  const account = store.getState().authentication.account;
  if (account)
    sendEvent(
      'fetch.cv',
      { accountId: account._id },
      {},
      (message) => {
        store.dispatch(replaceSafeContent(message.body))
        console.debug(`Successfully received cv data`, message);
      },
      console.error)
};

const saveAllToRemote = () => sendEvent(
  'save',
  store.getState().safe,
  (message) => console.debug(`Successfully saved all safe`, message),
  console.error);

/**
 * Use this function to create a unique object id.
 */
export const createId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}