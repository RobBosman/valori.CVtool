import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { epicRegistry } from "./redux/epicRegistry";
import { errorEpics } from "./services/error/error-epics";
import { authEpics } from "./services/auth/auth-epics";
import { eventBusEpics } from "./services/eventBus/eventBus-epics";
import { cvEpics } from "./services/cv/cv-epics";
import { safeEpics } from "./services/safe/safe-epics";
import { uiEpics } from "./services/ui/ui-epics";
import { ErrorBoundary } from "./utils/ErrorBoundary";
import Main from "./components/Main";

export const appVersion = "versie 2025-07-04";

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