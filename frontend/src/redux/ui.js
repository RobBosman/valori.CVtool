"use strict";

import { createAction, createReducer } from "@reduxjs/toolkit";
import { initializeIcons, registerOnThemeChangeCallback } from "@fluentui/react"
import store from "./store";

const setLocationHash = createAction("UI_SET_LOCATION_HASH");
export const setLocale = createAction("UI_SET_LOCALE");
export const setThemeName = createAction("UI_SET_THEME_NAME");

window.addEventListener('hashchange', (event) => {
  if (event.newURL.endsWith('#/')) {
    document.location.hash = '#'
  }
  store.dispatch(setLocationHash(document.location.hash || '#'))
});

initializeIcons();

registerOnThemeChangeCallback((theme) => {
  document.documentElement.style.background = theme.semanticColors.bodyBackground
});

const uiReducer = createReducer(
  {
    locationHash: document.location.hash || '#',
    locale: 'nl_NL',
    themeName: 'lightBlue'
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
    }
  });

export default uiReducer