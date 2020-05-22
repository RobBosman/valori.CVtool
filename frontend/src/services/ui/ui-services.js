"use strict";

import store from "../../redux/store";
import { initializeIcons, registerOnThemeChangeCallback } from "@fluentui/react"
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