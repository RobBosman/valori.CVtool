import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import { store } from "./redux/store";
import EventBroker from "./components/EventBroker";
import Main from "./components/Main";
import { initializeUI } from "./services/ui/ui-services";
import ErrorBoundary from "./utils/ErrorBoundary";

initializeUI(store.dispatch);

ReactDOM.render(
  <Provider store={store}>
    <ErrorBoundary>
      <EventBroker>
        <Main/>
      </EventBroker>
    </ErrorBoundary>
  </Provider>,
  document.getElementById("app")
);