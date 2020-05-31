"use strict";

import { createAction, createReducer } from "@reduxjs/toolkit";
import reducerRegistry from "../../redux/reducerRegistry";

export const fetchAll = createAction("SAFE_FETCH_ALL", () => ({ payload: null }));
export const saveAll = createAction("SAFE_SAVE_ALL", () => ({ payload: null }));

export const replaceSafeContent = createAction("SAFE_REPLACE_CONTENT");
export const replaceSafeInstance = createAction("SAFE_REPLACE_INSTANCE",
  (entity, id, instance) => ({ payload: { entity, id, instance } }));

const reducer = createReducer({}, {
  [replaceSafeContent]: (_state, action) => action.payload ? action.payload : {},
  [replaceSafeInstance]: (state, action) => {
    if (!state[action.payload.entity]) {
      state[action.payload.entity] = {};
    }
    state[action.payload.entity][action.payload.id] = action.payload.instance;
  }
});

reducerRegistry.register("safe", reducer);