import { createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../redux/reducerRegistry";

export const fetchCvByAccountId = createAction("FECTH_CV_BY_ACCOUNT_ID");
export const saveContent = createAction("SAVE_CONTENT", () => ({}));
export const replaceContent = createAction("REPLACE_CONTENT");
export const replaceInstance = createAction("REPLACE_INSTANCE",
  (entity, instanceId, instance) => ({ payload: { entity, instanceId, instance } }));
export const replaceInstances = createAction("REPLACE_INSTANCES",
  (entity, instances) => ({ payload: { entity, instances } }));
export const setLastEditedTimestamp = createAction("SET_LAST_EDITED_TIMESTAMP");
export const setLastSavedTimestamp = createAction("SET_LAST_SAVED_TIMESTAMP");

reducerRegistry.register(
  "safe",
  createReducer(
    {
      content: {}
    },
    {
      [replaceContent]: (state, action) => {
        state.content = action.payload ? action.payload : {};
      },
      [replaceInstance]: (state, action) => {
        if (!state.content[action.payload.entity]) {
          state.content[action.payload.entity] = {};
        }
        if (action.payload.instance) {
          state.content[action.payload.entity][action.payload.instanceId] = action.payload.instance;
        } else {
          delete(state.content[action.payload.entity][action.payload.instanceId]);
        }
      },
      [replaceInstances]: (state, action) => {
        if (!state.content[action.payload.entity]) {
          state.content[action.payload.entity] = {};
        }
        for (let i = 0; i < action.payload.instances.length; i++) {
          const instance = action.payload.instances[i];
          state.content[action.payload.entity][instance._id] = instance;
        }
      },
      [setLastEditedTimestamp]: (state, action) => {
        state.lastEditedTimestamp = action.payload;
      },
      [setLastSavedTimestamp]: (state, action) => {
        state.lastSavedTimestamp = action.payload;
      }
    }
  )
);