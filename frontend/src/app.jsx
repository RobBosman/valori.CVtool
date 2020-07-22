import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { initializeUI } from "./services/ui/ui-services";
import { epicRegistry } from "./redux/epicRegistry";
import { errorEpics } from "./services/error/error-epics";
import { authenticationEpics } from "./services/authentication/authentication-epics";
import { eventBusEpics } from "./services/eventBus/eventBus-epics";
import { safeEpics } from "./services/safe/safe-epics";
import { uiEpics } from "./services/ui/ui-epics";
import { ErrorBoundary } from "./utils/ErrorBoundary";
import Main from "./components/Main";

epicRegistry.register(
  ...errorEpics,
  ...authenticationEpics,
  ...eventBusEpics,
  ...safeEpics,
  ...uiEpics
);

initializeUI();

ReactDOM.render(
  <Provider store={store}>
    <ErrorBoundary>
      <Main/>
    </ErrorBoundary>
  </Provider>,
  document.getElementById("app")
);