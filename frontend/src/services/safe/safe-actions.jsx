import { createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../redux/reducerRegistry";

export const fetchCvByAccountId = createAction("FECTH_CV_BY_ACCOUNT_ID");
export const saveAll = createAction("SAVE_ALL", () => ({}));
export const replaceSafeContent = createAction("REPLACE_SAFE_CONTENT");
export const replaceSafeInstance = createAction("REPLACE_SAFE_INSTANCE",
  (entity, id, instance) => ({ payload: { entity, id, instance } }));

reducerRegistry.register(
  "safe",
  createReducer(
    {},
    {
      [replaceSafeContent]: (_state, action) => action.payload ? action.payload : {},
      [replaceSafeInstance]: (state, action) => {
        if (!state[action.payload.entity]) {
          state[action.payload.entity] = {};
        }
        if (action.payload.instance) {
          state[action.payload.entity][action.payload.id] = action.payload.instance;
        } else {
          delete(state[action.payload.entity][action.payload.id]);
        }
      }
    }
  )
);