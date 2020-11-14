import { createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../redux/reducerRegistry";

export const fetchAdminContent = createAction("FECTH_ADMIN_CONTENT", () => ({}));
export const fetchCvByAccountId = createAction("FECTH_CV_BY_ACCOUNT_ID");
export const saveCv = createAction("SAVE_CV");

export const replaceAdminContent = createAction("REPLACE_ADMIN_CONTENT");
export const replaceAdminContentInstance = createAction("REPLACE_ADMIN_CONTENT_INSTANCE",
  (entity, instanceId, instance) => ({ payload: { entity, instanceId, instance } }));
export const replaceCvContent = createAction("REPLACE_CV_CONTENT");
export const replaceCvContentInstance = createAction("REPLACE_CV_CONTENT_INSTANCE",
  (entity, instanceId, instance) => ({ payload: { entity, instanceId, instance } }));
export const replaceCvContentInstances = createAction("REPLACE_CV_CONTENT_INSTANCES",
  (entity, instances) => ({ payload: { entity, instances } }));
export const setLastEditedTimestamp = createAction("SET_LAST_EDITED_TIMESTAMP");
export const setLastSavedTimestamp = createAction("SET_LAST_SAVED_TIMESTAMP");

reducerRegistry.register(
  "safe",
  createReducer(
    {
      adminContent: {},
      adminDirty: {},
      cvContent: {},
      cvDirty: {}
    },
    {
      [replaceAdminContent]: (state, action) => {
        state.adminContent = action.payload ? action.payload : {};
        state.adminDirty = {};
      },
      [replaceAdminContentInstance]: (state, action) => {
        if (!state.adminContent[action.payload.entity]) {
          state.adminContent[action.payload.entity] = {};
        }
        if (!state.adminDirty[action.payload.entity]) {
          state.adminDirty[action.payload.entity] = {};
        }
        if (action.payload.instance) {
          state.adminContent[action.payload.entity][action.payload.instanceId] = action.payload.instance;
        } else {
          delete(state.adminContent[action.payload.entity][action.payload.instanceId]);
        }
        state.adminDirty[action.payload.entity][action.payload.instanceId] = new Date();
      },

      [replaceCvContent]: (state, action) => {
        state.cvContent = action.payload ? action.payload : {};
        state.cvDirty = {};
      },
      [replaceCvContentInstance]: (state, action) => {
        if (!state.cvContent[action.payload.entity]) {
          state.cvContent[action.payload.entity] = {};
        }
        if (action.payload.instance) {
          state.cvContent[action.payload.entity][action.payload.instanceId] = action.payload.instance;
        } else {
          delete(state.cvContent[action.payload.entity][action.payload.instanceId]);
        }
      },
      [replaceCvContentInstances]: (state, action) => {
        if (!state.cvContent[action.payload.entity]) {
          state.cvContent[action.payload.entity] = {};
        }
        for (let i = 0; i < action.payload.instances.length; i++) {
          const instance = action.payload.instances[i];
          state.cvContent[action.payload.entity][instance._id] = instance;
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