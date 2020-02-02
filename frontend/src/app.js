"use strict";

import React from "react"
import ReactDOM from "react-dom"
import {Provider} from 'react-redux'
import store from './redux/store'
import Main from "./components/Main"
import {Customizer, Fabric} from "office-ui-fabric-react"
import {AzureCustomizationsDark} from "@uifabric/azure-themes"


// import {loadTheme} from "office-ui-fabric-react"
// import {dark} from "./themes/dark"
// import {light} from "./themes/light"
// import {custom} from "./themes/custom"
//
// // loadTheme(light);
// loadTheme(dark);
// // loadTheme(custom);
// ReactDOM.render(
//     <Provider store={store}>
//         <Main/>
//     </Provider>,
//     document.getElementById("app")
// );

ReactDOM.render(
    <Provider store={store}>
        <Customizer {...AzureCustomizationsDark}>
            <Fabric>
                <Main/>
            </Fabric>
        </Customizer>
    </Provider>,
    document.getElementById("app")
);