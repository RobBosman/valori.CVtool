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
 * This way static theme json data is generated 
 */

const themePalettes = {
// primary color: #008000
// text color: #323130
// backgroundColor: #ffffff
  lightBlue: {
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
  
  // primary color: #008000
  // text color: #323130
  // backgroundColor: #fcfcfc
  lightGreen: {
    palette: {
      themePrimary: "#008000",
      themeLighterAlt: "#f0faf0",
      themeLighter: "#c5ebc5",
      themeLight: "#98d998",
      themeTertiary: "#47b347",
      themeSecondary: "#118f11",
      themeDarkAlt: "#007300",
      themeDark: "#006100",
      themeDarker: "#004700",
      neutralLighterAlt: "#f6f6f6",
      neutralLighter: "#f2f2f2",
      neutralLight: "#e8e8e8",
      neutralQuaternaryAlt: "#d8d8d8",
      neutralQuaternary: "#cecece",
      neutralTertiaryAlt: "#c6c6c6",
      neutralTertiary: "#a19f9d",
      neutralSecondary: "#605e5c",
      neutralPrimaryAlt: "#3b3a39",
      neutralPrimary: "#323130",
      neutralDark: "#201f1e",
      black: "#000000",
      white: "#fcfcfc",
    }
  },

  // primary color: #f39900
  // text color: #fefefe
  // backgroundColor: #1b1a19
  darkOrange: {
    palette: {
      themePrimary: "#f39900",
      themeLighterAlt: "#0a0600",
      themeLighter: "#271900",
      themeLight: "#492e00",
      themeTertiary: "#915c00",
      themeSecondary: "#d58700",
      themeDarkAlt: "#f4a318",
      themeDark: "#f5b13b",
      themeDarker: "#f8c56d",
      neutralLighterAlt: "#262523",
      neutralLighter: "#2f2d2c",
      neutralLight: "#3d3b39",
      neutralQuaternaryAlt: "#464442",
      neutralQuaternary: "#4d4b49",
      neutralTertiaryAlt: "#6b6966",
      neutralTertiary: "#c8c8c8",
      neutralSecondary: "#d0d0d0",
      neutralPrimaryAlt: "#dadada",
      neutralPrimary: "#ffffff",
      neutralDark: "#f4f4f4",
      black: "#f8f8f8",
      white: "#1b1a19"
    }
  },

  // primary color: #f0d000
  // text color: #ffffff
  // backgroundColor: #323130
  darkYellow: {
    palette: {
      themePrimary: "#f0d000",
      themeLighterAlt: "#0a0800",
      themeLighter: "#262100",
      themeLight: "#483e00",
      themeTertiary: "#907d00",
      themeSecondary: "#d3b700",
      themeDarkAlt: "#f1d418",
      themeDark: "#f3db3a",
      themeDarker: "#f6e46c",
      neutralLighterAlt: "#323130",
      neutralLighter: "#31302f",
      neutralLight: "#2f2e2d",
      neutralQuaternaryAlt: "#2c2b2a",
      neutralQuaternary: "#2a2928",
      neutralTertiaryAlt: "#282726",
      neutralTertiary: "#c8c8c8",
      neutralSecondary: "#d0d0d0",
      neutralPrimaryAlt: "#dadada",
      neutralPrimary: "#ffffff",
      neutralDark: "#f4f4f4",
      black: "#f8f8f8",
      white: "#323130",
    }
  }
};

// Expose all creatd themes.
if (createTheme instanceof Function) {
  Object.keys(themePalettes).forEach(themeName => {
    const theme = createTheme(themePalettes[themeName]);
    console.log(`\n${themeName}:\n${JSON.stringify(theme)}\n`);
  });
} else {
  throw Error("Cannot create themes in 'production' mode. Please don't import 'ThemeExposer'.");
}