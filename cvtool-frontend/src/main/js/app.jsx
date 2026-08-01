import React from "react";
import ReactDOM from "react-dom/client";
import {Provider} from "react-redux";
import {store} from "./redux/store";
import {epicRegistry} from "./redux/epicRegistry";
import {errorEpics} from "./services/error/error-epics";
import {authEpics} from "./services/auth/auth-epics";
import {eventBusEpics} from "./services/eventBus/eventBus-epics";
import {cvEpics} from "./services/cv/cv-epics";
import {safeEpics} from "./services/safe/safe-epics";
import {uiEpics} from "./services/ui/ui-epics";
import {ErrorBoundary} from "./utils/ErrorBoundary";
import Main from "./components/Main";

const dtap = {
  "localhost": {label: "DEV", borderStyle: "6px solid #009900"},
  "cvtool.test.cerios.nl": {label: "TEST", borderStyle: "6px solid #ff9900"},
  "cvtool.cerios.nl": {label: "", borderStyle: "none"}
}[globalThis.location.hostname]
?? {label: "UNKNOWN", borderStyle: "20px solid #ff0000"};

const htmlRoot = document.getElementsByTagName("html")[0];
htmlRoot.style.border = dtap.borderStyle;
htmlRoot.style.height = dtap.borderStyle ? "calc(100% - 12px)" : "100%";

export const appVersion = `${dtap.label} versie 2026-08-01`;

epicRegistry.register(
  ...errorEpics,
  ...authEpics,
  ...eventBusEpics,
  ...cvEpics,
  ...safeEpics,
  ...uiEpics
);

ReactDOM
  .createRoot(document.getElementById("app"))
  .render(
    <Provider store={store}>
      <ErrorBoundary>
        <Main/>
      </ErrorBoundary>
    </Provider>
  );