import React from "react";
import { registerOnThemeChangeCallback, removeOnThemeChangeCallback, getTheme } from "@fluentui/react";

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