"use strict";

import { createAction, createReducer } from "@reduxjs/toolkit";
import { initializeIcons, registerOnThemeChangeCallback } from "office-ui-fabric-react"

export const setLocale = createAction("UI_SET_LOCALE");
export const setThemeName = createAction("UI_SET_THEME_NAME");

initializeIcons();

registerOnThemeChangeCallback((theme) => {
  document.documentElement.style.background = theme.semanticColors.bodyBackground
});

const uiReducer = createReducer(
  {
    locale: 'nl_NL',
    themeName: 'lightBlue'
  },
  {
    [setLocale]: (state, action) => {
      state.locale = action.payload
    },
    [setThemeName]: (state, action) => {
      state.themeName = action.payload
    }
  });

export default uiReducer