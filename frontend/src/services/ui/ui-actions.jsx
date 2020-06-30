import { createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../redux/reducerRegistry";

export const setLocationHash = createAction("UI_SET_LOCATION_HASH");
export const setLocale = createAction("UI_SET_LOCALE");
export const setThemeName = createAction("UI_SET_THEME_NAME");
export const setSelectedCvId = createAction("UI_SET_SELECTED_CV_ID");
export const setSelectedEducationId = createAction("UI_SET_SELECTED_EDUCATION_ID");
export const setSelectedSkillId = createAction("UI_SET_SELECTED_SKILL_ID");
export const setSelectedPublicationId = createAction("UI_SET_SELECTED_PUBLICATION_ID");
export const setSelectedReferenceId = createAction("UI_SET_SELECTED_REFERENCE_ID");
export const setSelectedExperienceId = createAction("UI_SET_SELECTED_EXPERIENCE_ID");
export const setDialogConfig = createAction("UI_SET_DIALOG_CONFIG",
  (dialog, config) => ({ payload: { dialog, config } }));

const reducer = createReducer(
  {
    locationHash: document.location.hash || "",
    locale: "nl_NL",
    themeName: "lightBlue",
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
    [setSelectedCvId]: (state, action) => {
      state.selectedCvId = action.payload;
    },
    [setSelectedEducationId]: (state, action) => {
      state.selectedEducationId = action.payload;
    },
    [setSelectedSkillId]: (state, action) => {
      state.selectedSkillId = action.payload;
    },
    [setSelectedPublicationId]: (state, action) => {
      state.selectedPublicationId = action.payload;
    },
    [setSelectedReferenceId]: (state, action) => {
      state.selectedReferenceId = action.payload;
    },
    [setSelectedExperienceId]: (state, action) => {
      state.selectedExperienceId = action.payload;
    },
    [setDialogConfig]: (state, action) => {
      state.dialogConfig[action.payload.dialog] = action.payload.config;
    }
  }
);

reducerRegistry.register("ui", reducer);