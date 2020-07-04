import React from "react";
import { registerOnThemeChangeCallback, removeOnThemeChangeCallback, getTheme, initializeIcons } from "@fluentui/react";
import { setLocationHash } from "./ui-actions";
import { setWindowError } from "../../redux/error-actions";

export const initializeUI = (dispatch) => {

  window.addEventListener("unhandledrejection", (event) => dispatch(setWindowError(event)));
  window.addEventListener("error", (event) => dispatch(setWindowError(event)));
  window.addEventListener("hashchange", () => dispatch(setLocationHash(document.location.hash || "")));

  initializeIcons();
  
  registerOnThemeChangeCallback((theme) => document.documentElement.style.background = theme.semanticColors.bodyBackground);
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
  };
};