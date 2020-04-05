"use strict";

import {createTheme} from "office-ui-fabric-react"

// see https://fabricweb.z5.web.core.windows.net/pr-deploy-site/refs/heads/master/theming-designer/index.html
// primary color: #008000
// text color: #323130
// backgroundColor: #fcfcfc
const theme = createTheme({
    palette: {
        themePrimary: '#008000',
        themeLighterAlt: '#f0faf0',
        themeLighter: '#c5ebc5',
        themeLight: '#98d998',
        themeTertiary: '#47b347',
        themeSecondary: '#118f11',
        themeDarkAlt: '#007300',
        themeDark: '#006100',
        themeDarker: '#004700',
        neutralLighterAlt: '#f6f6f6',
        neutralLighter: '#f2f2f2',
        neutralLight: '#e8e8e8',
        neutralQuaternaryAlt: '#d8d8d8',
        neutralQuaternary: '#cecece',
        neutralTertiaryAlt: '#c6c6c6',
        neutralTertiary: '#a19f9d',
        neutralSecondary: '#605e5c',
        neutralPrimaryAlt: '#3b3a39',
        neutralPrimary: '#323130',
        neutralDark: '#201f1e',
        black: '#000000',
        white: '#fcfcfc',
    }
});

export default theme