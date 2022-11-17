import { createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../redux/reducerRegistry";

export const setLocationHash = createAction("SET_LOCATION_HASH");
export const setLocale = createAction("SET_LOCALE");
export const setTheme = createAction("SET_THEME");
export const setSelectedId = createAction("SET_SELECTED_ID",
  (entityName, selectedId) => ({payload: {entityName, selectedId}}));
export const resetSelectedIds = createAction("RESET_SELECTED_IDS");
export const setHistoryViewVisible = createAction("SET_HISTORY_VIEW_VISIBLE");

reducerRegistry.register(
  "ui", 
  createReducer(
    {
      locationHash: window.location.hash || "",
      userPrefs: {},
      selectedId: {},
      isHistoryViewVisible: false
    },
    builder => builder
      .addCase(setLocationHash, (state, action) => ({
        ...state,
        locationHash: action.payload
      }))
      .addCase(setLocale, (state, action) => ({
        ...state,
        userPrefs: {
          ...state.userPrefs,
          locale: action.payload
        }
      }))
      .addCase(setTheme, (state, action) => ({
        ...state,
        userPrefs: {
          ...state.userPrefs,
          theme: action.payload
        }
      }))
      .addCase(setSelectedId, (state, action) => ({
        ...state,
        selectedId: {
          ...state.selectedId,
          [action.payload.entityName]: action.payload.selectedId
        }
      }))
      .addCase(resetSelectedIds, (state, action) => ({
        ...state,
        selectedId: action.payload
      }))
      .addCase(setHistoryViewVisible, (state, action) => ({
        ...state,
        isHistoryViewVisible: action.payload
      }))
  )
);