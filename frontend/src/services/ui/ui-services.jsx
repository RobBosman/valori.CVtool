import React from "react";
import { initializeIcons, registerOnThemeChangeCallback, removeOnThemeChangeCallback, getTheme } from "@fluentui/react";
import { setLocationHash } from "./ui-actions";

export const initializeUI = (dispatch) => {
  // TODO window.addEventListener("unhandledrejection", (event) =>  console.error(`Uncaught error in Promise - ${JSON.stringify(event)}`));
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