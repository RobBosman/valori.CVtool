"use strict";

import React from "react";
import store from "../../redux/store";
import { initializeIcons, registerOnThemeChangeCallback, removeOnThemeChangeCallback, getTheme } from "@fluentui/react";
import { setLocationHash } from "./ui-actions";

export const initializeUI = () => {
  initializeIcons();

  window.addEventListener('hashchange', (event) => {
    if (event.newURL.endsWith('#/')) {
      document.location.hash = ''
    }
    store.dispatch(setLocationHash(document.location.hash || ''))
  });

  registerOnThemeChangeCallback((theme) => {
    document.documentElement.style.background = theme.semanticColors.bodyBackground
  });
};

export const useTheme = () => {
  const [theme, setTheme] = React.useState(getTheme());

  React.useEffect(() => {
    registerOnThemeChangeCallback(setTheme);
    return () => removeOnThemeChangeCallback(setTheme);
  }, []);

  return {
    theme,
    viewPaneColor: theme.palette.neutralQuaternaryAlt,
    editPaneColor: theme.palette.neutralTertiaryAlt
  }
};