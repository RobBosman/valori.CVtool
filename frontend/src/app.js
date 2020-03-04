"use strict";

import React from "react"
import ReactDOM from "react-dom"
import {Provider} from 'react-redux'
import store from './redux/store'
import Main from "./components/Main"
import EventBroker from "./components/EventBroker"

ReactDOM.render(
    <Provider store={store}>
        <EventBroker>
            <Main/>
        </EventBroker>
    </Provider>,
    document.getElementById("app")
);