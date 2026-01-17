import {createTheme} from "@fluentui/react";

/**
 * Use this file to prepare FluentUI themes.
 * See https://fabricweb.z5.web.core.windows.net/pr-deploy-site/refs/heads/master/theming-designer/index.html
 * Theme creation is delegated to FluentUI function createTheme(), but that function is not available in 'production' mode.
 * So we create theme-datasets in 'development' mode and store them in the file /src/static/themes.js to make them available to the rest of the frontend.
 * 
 * Procedure:
 *   1) import this file in Main.jsx.
 *   2) run webpack in development mode, because createTheme() is not available in prodcution mode.
 *   3) save the console output to a file, e.g. localhost-1602616724710.log.
 *   4) copy the JavaScript code from the log file to scr/static/themes.js
 *   5) remove the import statement from Main.jsx.
 * 
 * This way static theme json data is generated that can be applied
 */

const themePalettes = {
// primary color: #008000
// text color: #323130
// backgroundColor: #ffffff
  fluentUI: {
    palette: {
      themePrimary: "#0078d4",
      themeLighterAlt: "#eff6fc",
      themeLighter: "#deecf9",
      themeLight: "#c7e0f4",
      themeTertiary: "#71afe5",
      themeSecondary: "#2b88d8",
      themeDarkAlt: "#106ebe",
      themeDark: "#005a9e",
      themeDarker: "#004578",
      neutralLighterAlt: "#faf9f8",
      neutralLighter: "#f3f2f1",
      neutralLight: "#edebe9",
      neutralQuaternaryAlt: "#e1dfdd",
      neutralQuaternary: "#d0d0d0",
      neutralTertiaryAlt: "#c8c6c4",
      neutralTertiary: "#a19f9d",
      neutralSecondary: "#605e5c",
      neutralPrimaryAlt: "#3b3a39",
      neutralPrimary: "#323130",
      neutralDark: "#201f1e",
      black: "#000000",
      white: "#ffffff"
    }
  },

  // primary color: #211A58
  // text color: #000000
  // backgroundColor: #fafafa
  ceriosBlue: {
    palette: {
      "themePrimary": "#211A58",
      "themeLighterAlt": "#010104",
      "themeLighter": "#05040e",
      "themeLight": "#0a081b",
      "themeTertiary": "#141036",
      "themeSecondary": "#1e184f",
      "themeDarkAlt": "#2f276a",
      "themeDark": "#443c81",
      "themeDarker": "#6a63a2",
      "neutralLighterAlt": "#f3f3f3",
      "neutralLighter": "#efefef",
      "neutralLight": "#e5e5e5",
      "neutralQuaternaryAlt": "#d6d6d6",
      "neutralQuaternary": "#cccccc",
      "neutralTertiaryAlt": "#c4c4c4",
      "neutralTertiary": "#595959",
      "neutralSecondary": "#373737",
      "neutralPrimaryAlt": "#2f2f2f",
      "neutralPrimary": "#000000",
      "neutralDark": "#151515",
      "black": "#0b0b0b",
      "white": "#fafafa"
    }
  },

  // primary color: #F29100
  // text color: #e2e2e2
  // backgroundColor: #2B2B2B
  ceriosOrange: {
    palette: {
      "themePrimary": "#F29100",
      "themeLighterAlt": "#0a0600",
      "themeLighter": "#271700",
      "themeLight": "#492c00",
      "themeTertiary": "#915700",
      "themeSecondary": "#d58000",
      "themeDarkAlt": "#f49c18",
      "themeDark": "#f5ab3b",
      "themeDarker": "#f8c06d",
      "neutralLighterAlt": "#343434",
      "neutralLighter": "#3d3d3d",
      "neutralLight": "#4a4a4a",
      "neutralQuaternaryAlt": "#525252",
      "neutralQuaternary": "#595959",
      "neutralTertiaryAlt": "#757575",
      "neutralTertiary": "#ececec",
      "neutralSecondary": "#efefef",
      "neutralPrimaryAlt": "#f2f2f2",
      "neutralPrimary": "#e2e2e2",
      "neutralDark": "#f9f9f9",
      "black": "#fcfcfc",
      "white": "#2B2B2B"
    }
  }
};

// Expose all created themes.
if (typeof createTheme === "function") {
  for (const themeName of Object.keys(themePalettes)) {
    const theme = createTheme(themePalettes[themeName]);
    console.log(`\n${themeName}:\n${JSON.stringify(theme)}\n`);
  };
} else {
  throw new TypeError("Cannot create themes in 'production' mode. Please don't import 'ThemeExposer'.");
}