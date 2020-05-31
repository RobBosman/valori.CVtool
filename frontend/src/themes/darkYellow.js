"use strict";

import {createTheme} from "@fluentui/react";

// see https://fabricweb.z5.web.core.windows.net/pr-deploy-site/refs/heads/master/theming-designer/index.html
// primary color: #f0d000
// text color: #ffffff
// backgroundColor: #323130
const theme = createTheme({
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
});

export default theme;