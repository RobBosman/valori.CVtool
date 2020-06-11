import { createEpicMiddleware } from "redux-observable";
import { configureStore, compose } from "@reduxjs/toolkit";
import { reducerRegistry } from "./reducerRegistry";
import { epicRegistry } from "./epicRegistry";

const epicMiddleware = createEpicMiddleware();
const composeEnhancers = process.env.NODE_ENV !== "production" && window?.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ name: "CVtool", actionsBlacklist: ["REDUX_STORAGE_SAVE"] })
  : compose;

export const store = configureStore({
  reducer: reducerRegistry.getRootReducer(),
  middleware: [epicMiddleware],
  enhancer: composeEnhancers
});

reducerRegistry.setChangeListener((rootReducer) => store.replaceReducer(rootReducer));

epicMiddleware.run(epicRegistry.rootEpic);