"use strict";

import { createAction, createReducer } from "@reduxjs/toolkit";
import reducerRegistry from "../../redux/reducerRegistry";

export const setLocationHash = createAction("UI_SET_LOCATION_HASH");
export const setLocale = createAction("UI_SET_LOCALE");
export const setThemeName = createAction("UI_SET_THEME_NAME");
export const selectCvId = createAction("UI_SELECT_CV_ID");
export const selectEducationId = createAction("UI_SELECT_EDUCATION_ID");
export const selectSkillId = createAction("UI_SELECT_SKILL_ID");

const reducer = createReducer(
  {
    locationHash: document.location.hash || '',
    locale: 'nl_NL',
    themeName: 'lightBlue',
    selected: {}
  },
  {
    [setLocationHash]: (state, action) => {
      state.locationHash = action.payload
    },
    [setLocale]: (state, action) => {
      state.locale = action.payload
    },
    [setThemeName]: (state, action) => {
      state.themeName = action.payload
    },
    [selectEducationId]: (state, action) => {
      state.selected.educationId = action.payload
    },
    [selectSkillId]: (state, action) => {
      state.selected.skillId = action.payload
    },
    [selectCvId]: (state, action) => {
      state.selected.cvId = action.payload
    }
  });

reducerRegistry.register('ui', reducer);