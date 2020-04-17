"use strict";

import { createAction, createReducer } from "@reduxjs/toolkit";
import { initializeIcons, registerOnThemeChangeCallback } from "@fluentui/react"
import store from "./store";

const setLocationHash = createAction("UI_SET_LOCATION_HASH");
export const setLocale = createAction("UI_SET_LOCALE");
export const setThemeName = createAction("UI_SET_THEME_NAME");
export const selectCvId = createAction("UI_SELECT_CV_ID");
export const selectEducationId = createAction("UI_SELECT_EDUCATION_ID");

initializeIcons();

window.addEventListener('hashchange', (event) => {
  if (event.newURL.endsWith('#/')) {
    document.location.hash = '#'
  }
  store.dispatch(setLocationHash(document.location.hash || '#'))
});

registerOnThemeChangeCallback((theme) => {
  document.documentElement.style.background = theme.semanticColors.bodyBackground
});

const uiReducer = createReducer(
  {
    locationHash: document.location.hash || '#',
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
    [selectCvId]: (state, action) => {
      state.selected.cvId = action.payload
    }
  });

export default uiReducer