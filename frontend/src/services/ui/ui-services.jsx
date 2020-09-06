import React from "react";
import { registerOnThemeChangeCallback, removeOnThemeChangeCallback, getTheme, initializeIcons } from "@fluentui/react";

export const initializeUI = () => {
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
    viewPaneColor: theme.palette.neutralLighter,
    editPaneColor: theme.palette.neutralLighterAlt
  };
};

/**
 * A utility function to deliberately 'inject' a delay of (by default) 1000 milliseconds.
 * This is to show/exaggerate the impact of slow performing code.
 * @param remark - will be shown in debug
 * @param waitMillis - delay in milliseconds
 */
export const heavyWait = (remark = "", waitMillis = 1000) => {
  if (waitMillis > 0) {
    console.debug(`    ${remark} - waiting ${waitMillis} ms...`);
    let now = new Date().getTime();
    const end = now + waitMillis;
    while (now < end) {
      now = new Date().getTime();
    }
  }
};