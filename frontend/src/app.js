"use strict";

import React from "react"
import ReactDOM from "react-dom"
import {Provider} from 'react-redux'
import store from './redux/store'
import epicRegistry from "./redux/epicRegistry"
import Main from "./components/Main"
import EventBroker from "./components/EventBroker"
import { authenticationEpics } from "./services/authentication/authentication-epics";
import { safeEpics } from "./services/safe/safe-epics";
import { initializeUI } from "./services/ui/ui-services";

initializeUI();

epicRegistry.register(authenticationEpics);
epicRegistry.register(safeEpics);

/**
 * A utility function to deliberately 'inject' a delay of (by default) 1000 milliseconds.
 * This is to show/exaggerate the impact of slow performing code.
 * @param remark - will be shown in debug
 * @param waitMillis - delay in milliseconds
 */
export const heavyWait = (remark = '', waitMillis = 1000) => {
    if (waitMillis > 0) {
        console.debug(`    ${remark} - waiting ${waitMillis} ms...`);
        let now = new Date().getTime();
        let end = now + waitMillis;
        while (now < end) {
            now = new Date().getTime();
        }
    }
};

ReactDOM.render(
    <Provider store={store}>
        <EventBroker>
            <Main/>
        </EventBroker>
    </Provider>,
    document.getElementById("app")
);