import React from "react";
import { registerOnThemeChangeCallback, removeOnThemeChangeCallback, getTheme, initializeIcons, loadTheme } from "@fluentui/react";
import fluentUITheme from "../../static/themes/fluentUI.json";
import valoriBlueTheme from "../../static/themes/valoriBlue.json";
import valoriOrangeTheme from "../../static/themes/valoriOrange.json";

export const AllThemes = {
  default: fluentUITheme,
  valoriOrange: valoriOrangeTheme,
  valoriBlue: valoriBlueTheme
};

export const loadThemeByName = (themeName) => {
  if (AllThemes[themeName]) {
    loadTheme(AllThemes[themeName]);
  }
};

const defaultUserPrefs = {
  locale: "nl_NL",
  theme: "valoriBlue"
};

export const initializeUI = () => {
  initializeIcons();
  registerOnThemeChangeCallback((theme) => document.documentElement.style.background = theme.semanticColors.bodyBackground);

  const userPrefs = {...defaultUserPrefs};
  decodeURIComponent(document.cookie)
    .split(";")
    .map(kvString => kvString.trim().split("="))
    .forEach(kv => userPrefs[kv[0]] = kv[1]);
  return userPrefs;
};

export const useTheme = () => {

  const [theme, setTheme] = React.useState(getTheme());

  React.useEffect(() => {
    registerOnThemeChangeCallback(setTheme);
    return () => removeOnThemeChangeCallback(setTheme);
  }, []);

  return {
    theme,
    viewPaneColor: theme.palette.neutralLighter,
    editPaneColor: theme.palette.neutralLighterAlt
  };
};