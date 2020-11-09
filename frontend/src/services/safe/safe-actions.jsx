import { createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../redux/reducerRegistry";

export const fetchAccounts = createAction("FECTH_ACCOUNTS", () => ({}));
export const replaceAccounts = createAction("REPLACE_ACCOUNTS");
export const replaceAccountInstance = createAction("REPLACE_ACCOUNT_INSTANCE",
  (entity, instanceId, instance) => ({ payload: { entity, instanceId, instance } }));
export const fetchCvByAccountId = createAction("FECTH_CV_BY_ACCOUNT_ID");
export const saveCv = createAction("SAVE_CV");
export const replaceContent = createAction("REPLACE_CONTENT");
export const replaceContentInstance = createAction("REPLACE_CONTENT_INSTANCE",
  (entity, instanceId, instance) => ({ payload: { entity, instanceId, instance } }));
export const replaceContentInstances = createAction("REPLACE_CONTENT_INSTANCES",
  (entity, instances) => ({ payload: { entity, instances } }));
export const setLastEditedTimestamp = createAction("SET_LAST_EDITED_TIMESTAMP");
export const setLastSavedTimestamp = createAction("SET_LAST_SAVED_TIMESTAMP");

reducerRegistry.register(
  "safe",
  createReducer(
    {
      accounts: {},
      content: {}
    },
    {
      [replaceAccounts]: (state, action) => {
        state.accounts = action.payload ? action.payload : {};
      },
      [replaceAccountInstance]: (state, action) => {
        if (!state.accounts[action.payload.entity]) {
          state.accounts[action.payload.entity] = {};
        }
        if (action.payload.instance) {
          state.accounts[action.payload.entity][action.payload.instanceId] = action.payload.instance;
        } else {
          delete(state.accounts[action.payload.entity][action.payload.instanceId]);
        }
      },
      [replaceContent]: (state, action) => {
        state.content = action.payload ? action.payload : {};
      },
      [replaceContentInstance]: (state, action) => {
        if (!state.content[action.payload.entity]) {
          state.content[action.payload.entity] = {};
        }
        if (action.payload.instance) {
          state.content[action.payload.entity][action.payload.instanceId] = action.payload.instance;
        } else {
          delete(state.content[action.payload.entity][action.payload.instanceId]);
        }
      },
      [replaceContentInstances]: (state, action) => {
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