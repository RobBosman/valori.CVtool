import { createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../redux/reducerRegistry";
import * as utils from "../../utils/CommonUtils";

// Epic actions:
export const fetchAllInstances = createAction("FECTH_ALL_INSTANCES");
export const save = createAction("SAVE");
export const deleteAccount = createAction("DELETE_ACCOUNT");
export const selectPhotoToUpload = createAction("SELECT_PHOTO_TO_UPLOAD",
  (accountInstanceId, fileSelectOptions) => ({ payload: { accountInstanceId, fileSelectOptions } }));
export const setProfilePhoto = createAction("SET_PROFILE_PHOTO",
  (accountInstanceId, profilePhotoB64) => ({ payload: { accountInstanceId, profilePhotoB64 } }));
// Reducer actions:
export const resetEntities = createAction("RESET_ENTITIES");
export const changeInstances = createAction("CHANGE_INSTANCES",
  (entity, instances) => ({ payload: { entity, instances } }));
export const changeInstance = createAction("CHANGE_INSTANCE",
  (entity, instanceId, instance) => ({ payload: { entity, instanceId, instance } }));
  export const setLastSavedTimeString = createAction("SET_LAST_SAVED_TIME_STRING");

reducerRegistry.register(
  "safe",
  createReducer(
    {
      content: {},
      dirty: {},
      lastSavedTimeString: new Date().toISOString()
    },
    builder => builder
      .addCase(resetEntities, (state, action) => {
        if (action.payload) {
          Object.entries(action.payload)
            .forEach(([entityName, instances]) => {
              Object.entries(instances)
                .forEach(([instanceId, instance]) =>
                  updateInstance(entityName, instanceId, instance, null, state));
            });
        } else {
          state.content = {};
          state.dirty = {};
          state.lastEditedTimeString = null;
          state.lastSavedTimeString = new Date().toISOString();
        }
      })
      .addCase(changeInstances, (state, action) => {
        action.payload.instances
          .forEach(instance => updateInstance(action.payload.entity, instance._id, instance, new Date(), state));
      })
      .addCase(changeInstance, (state, action) => {
        updateInstance(action.payload.entity, action.payload.instanceId, action.payload.instance, new Date(), state);
      })
      .addCase(setLastSavedTimeString, (state, action) => {
        updateDirtyState(action.payload, state);
      })
  )
);

const updateInstance = (entityName, instanceId, instance, timestamp, safe) => {
  updateSafeObject(entityName, instanceId, instance, safe.content);
  updateSafeObject(entityName, instanceId, JSON.stringify(timestamp), safe.dirty);
  if (timestamp) {
    safe.lastEditedTimeString = timestamp.toISOString();
  }
};

const updateSafeObject = (entityName, instanceId, value, safeObject) => {
  if (value) {
    if (!safeObject[entityName]) {
      safeObject[entityName] = {};
    }
    safeObject[entityName][instanceId] = value;
  } else if (safeObject[entityName]) {
    delete(safeObject[entityName][instanceId]);
    if (Object.keys(safeObject[entityName]).length === 0) {
      delete(safeObject[entityName]);
    }
  }
};

const updateDirtyState = (lastSavedTimeString, safe) => {
  safe.lastSavedTimeString = lastSavedTimeString;
  const lastSavedTimestamp = utils.parseTimeString(lastSavedTimeString);
  Object.entries(safe.dirty)
    .forEach(([entityName, dirtyInstances]) => {
      if (safe.dirty[entityName]) {
        Object.entries(dirtyInstances)
          .forEach(([instanceId, timeString]) => {
            if (utils.parseTimeString(timeString) <= lastSavedTimestamp) {
              updateSafeObject(entityName, instanceId, null, safe.dirty);
            }
          });
      }
    });
};