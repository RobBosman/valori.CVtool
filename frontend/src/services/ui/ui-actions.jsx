import { createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../redux/reducerRegistry";

export const setLocationHash = createAction("SET_LOCATION_HASH");
export const setLocale = createAction("SET_LOCALE");
export const setTheme = createAction("SET_THEME");
export const setSelectedId = createAction("SET_SELECTED_ID",
  (entityName, selectedId) => ({payload: {entityName, selectedId}}));
export const resetSelectedIds = createAction("RESET_SELECTED_IDS", () => ({}));

reducerRegistry.register(
  "ui", 
  createReducer(
    {
      locationHash: document.location.hash || "",
      userPrefs: {},
      selectedId: {}
    },
    {
      [setLocationHash]: (state, action) => {
        state.locationHash = action.payload;
      },
      [setLocale]: (state, action) => {
        state.userPrefs.locale = action.payload;
      },
      [setTheme]: (state, action) => {
        state.userPrefs.theme = action.payload;
      },
      [setSelectedId]: (state, action) => {
        state.selectedId[action.payload.entityName] = action.payload.selectedId;
      },
      [resetSelectedIds]: (state) => {
        state.selectedId = {};
      }
    }
  )
);