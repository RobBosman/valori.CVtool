import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { initializeUI } from "./services/ui/ui-services";
import { ErrorBoundary } from "./utils/ErrorBoundary";
import Main from "./components/Main";

initializeUI(store.dispatch);

ReactDOM.render(
  <Provider store={store}>
    <ErrorBoundary>
      <Main/>
    </ErrorBoundary>
  </Provider>,
  document.getElementById("app")
);