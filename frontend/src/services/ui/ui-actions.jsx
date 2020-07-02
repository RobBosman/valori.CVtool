import { createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../redux/reducerRegistry";

export const setLocationHash = createAction("UI_SET_LOCATION_HASH");
export const setLocale = createAction("UI_SET_LOCALE");
export const setThemeName = createAction("UI_SET_THEME_NAME");
export const setSelectedId = createAction("UI_SET_SELECTED_ID",
  (entityName, selectedId) => ({payload: {entityName, selectedId}}));
export const setDialogConfig = createAction("UI_SET_DIALOG_CONFIG",
  (dialog, config) => ({ payload: { dialog, config } }));

reducerRegistry.register(
  "ui", 
  createReducer(
    {
      locationHash: document.location.hash || "",
      locale: "nl_NL",
      themeName: "lightBlue",
      selectedId: {},
      dialogConfig: {}
    },
    {
      [setLocationHash]: (state, action) => {
        state.locationHash = action.payload;
      },
      [setLocale]: (state, action) => {
        state.locale = action.payload;
      },
      [setThemeName]: (state, action) => {
        state.themeName = action.payload;
      },
      [setSelectedId]: (state, action) => {
        state.selectedId[action.payload.entityName] = action.payload.selectedId;
      },
      [setDialogConfig]: (state, action) => {
        state.dialogConfig[action.payload.dialog] = action.payload.config;
      }
    }
  )
);