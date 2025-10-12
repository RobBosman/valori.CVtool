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

  const userPrefs = { ...defaultUserPrefs };
  for (const key in defaultUserPrefs) {
    userPrefs[key] = globalThis.localStorage.getItem(key) || userPrefs[key];
  }
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
    semanticColors: theme.semanticColors,
    viewPaneBackground: theme.palette.neutralLighter,
    editPaneBackground: theme.palette.neutralLighterAlt,
    markHighlightBackground: theme.semanticColors.markHighlightBackground || theme.palette.greenLight,
    valoriBlue: "#211959",
    valoriYellow: "#F29100"
  };
};