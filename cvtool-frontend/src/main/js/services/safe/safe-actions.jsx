import { createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../redux/reducerRegistry";

export const fetchAllInstances = createAction("FECTH_ALL_INSTANCES");
export const save = createAction("SAVE");
export const deleteAccount = createAction("DELETE_ACCOUNT");

export const resetEntities = createAction("RESET_ENTITIES");
export const changeInstances = createAction("CHANGE_INSTANCES",
  (entity, instances) => ({ payload: { entity, instances } }));
export const changeInstance = createAction("CHANGE_INSTANCE",
  (entity, instanceId, instance) => ({ payload: { entity, instanceId, instance } }));
export const setLastSavedTimestamp = createAction("SET_LAST_SAVED_TIMESTAMP");

reducerRegistry.register(
  "safe",
  createReducer(
    {
      content: {},
      dirty: {},
      lastSavedTimestamp: new Date()
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
          state.lastEditedTimestamp = null;
          state.lastSavedTimestamp = new Date();
        }
      })
      .addCase(changeInstances, (state, action) => {
        action.payload.instances
          .forEach(instance => updateInstance(action.payload.entity, instance._id, instance, new Date(), state));
      })
      .addCase(changeInstance, (state, action) => {
        updateInstance(action.payload.entity, action.payload.instanceId, action.payload.instance, new Date(), state);
      })
      .addCase(setLastSavedTimestamp, (state, action) => {
        updateDirtyState(action.payload, state);
      })
  )
);

const updateInstance = (entityName, instanceId, instance, timestamp, safe) => {
  updateSafeObject(entityName, instanceId, instance, safe.content);
  updateSafeObject(entityName, instanceId, timestamp, safe.dirty);
  if (timestamp) {
    safe.lastEditedTimestamp = timestamp;
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

const updateDirtyState = (lastSavedTimestamp, safe) => {
  safe.lastSavedTimestamp = lastSavedTimestamp;
  Object.entries(safe.dirty)
    .forEach(([entityName, dirtyInstances]) => {
      if (safe.dirty[entityName]) {
        Object.entries(dirtyInstances)
          .forEach(([instanceId, timestamp]) => {
            if (timestamp <= lastSavedTimestamp) {
              updateSafeObject(entityName, instanceId, null, safe.dirty);
            }
          });
      }
    });
};