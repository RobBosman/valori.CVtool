"use strict";

import {createTheme} from "office-ui-fabric-react"

// see https://fabricweb.z5.web.core.windows.net/pr-deploy-site/refs/heads/master/theming-designer/index.html
// primary color: #f39900
// text color: #fefefe
// backgroundColor: #1b1a19
const theme = createTheme({
    palette: {
        themePrimary: '#f39900',
        themeLighterAlt: '#0a0600',
        themeLighter: '#271900',
        themeLight: '#492e00',
        themeTertiary: '#915c00',
        themeSecondary: '#d58700',
        themeDarkAlt: '#f4a318',
        themeDark: '#f5b13b',
        themeDarker: '#f8c56d',
        neutralLighterAlt: '#262523',
        neutralLighter: '#2f2d2c',
        neutralLight: '#3d3b39',
        neutralQuaternaryAlt: '#464442',
        neutralQuaternary: '#4d4b49',
        neutralTertiaryAlt: '#6b6966',
        neutralTertiary: '#c8c8c8',
        neutralSecondary: '#d0d0d0',
        neutralPrimaryAlt: '#dadada',
        neutralPrimary: '#ffffff',
        neutralDark: '#f4f4f4',
        black: '#f8f8f8',
        white: '#1b1a19'
    }
});

export default theme