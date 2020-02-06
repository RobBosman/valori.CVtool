"use strict";

import React from "react"
import ReactDOM from "react-dom"
import {Provider} from 'react-redux'
import store from './redux/store'
import {Fabric, initializeIcons, loadTheme} from "office-ui-fabric-react"
import Main from "./components/Main"
import {ValoriDark, ValoriLight} from "./themes/valori-themes"

initializeIcons();

const applyTheme = (theme) => {
    loadTheme(theme);
    document.documentElement.style.background = theme.palette.white;
};

applyTheme(ValoriLight);
setTimeout(() => {
    applyTheme(ValoriDark)
}, 2000);
setTimeout(() => {
    applyTheme(ValoriLight)
}, 4000);

ReactDOM.render(
    <Provider store={store}>
        <Fabric>
            <Main/>
        </Fabric>
    </Provider>,
    document.getElementById("app")
);