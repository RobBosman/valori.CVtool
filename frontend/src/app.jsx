import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import { epicRegistry } from "./redux/epicRegistry";
import { store } from "./redux/store";
import Main from "./components/Main";
import EventBroker from "./components/EventBroker";
import { authenticationEpics } from "./services/authentication/authentication-epics";
import { safeEpics } from "./services/safe/safe-epics";
import { initializeUI } from "./services/ui/ui-services";

initializeUI(store.dispatch);

epicRegistry.register(authenticationEpics);
epicRegistry.register(safeEpics);

ReactDOM.render(
  <Provider store={store}>
    <EventBroker>
      <Main/>
    </EventBroker>
  </Provider>,
  document.getElementById("app")
);