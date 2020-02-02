"use strict";

import React from "react"
import ReactDOM from "react-dom"
import {Provider} from 'react-redux'
import store from './redux/store'
import {Fabric, initializeIcons} from "office-ui-fabric-react"
import Main from "./components/Main"
import {applyTheme, ValoriLight} from "./themes/valori-themes"

initializeIcons();
applyTheme(ValoriLight);

ReactDOM.render(
    <Provider store={store}>
        <Fabric>
            <Main/>
        </Fabric>
    </Provider>,
    document.getElementById("app")
);