import { createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../redux/reducerRegistry";

export const fetchCvByAccountId = createAction("FECTH_CV_BY_ACCOUNT_ID");
export const saveContent = createAction("SAVE_CONTENT", () => ({}));
export const replaceContent = createAction("REPLACE_CONTENT");
export const replaceInstance = createAction("REPLACE_INSTANCE",
  (entity, id, instance) => ({ payload: { entity, id, instance } }));
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
          state.content[action.payload.entity][action.payload.id] = action.payload.instance;
        } else {
          delete(state.content[action.payload.entity][action.payload.id]);
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