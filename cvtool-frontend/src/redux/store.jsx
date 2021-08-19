import { createEpicMiddleware } from "redux-observable";
import { configureStore } from "@reduxjs/toolkit";
import { reducerRegistry } from "./reducerRegistry";
import { composeWithDevTools } from "redux-devtools-extension";
import { epicRegistry } from "./epicRegistry";

const epicMiddleware = createEpicMiddleware();

const composeEnhancers = composeWithDevTools(); // see EnhancerOptions

export const store = configureStore({
  reducer: reducerRegistry.getRootReducer(),
  middleware: [epicMiddleware],
  enhancer: composeEnhancers
});

reducerRegistry.setChangeListener((rootReducer) => store.replaceReducer(rootReducer));

epicMiddleware.run(epicRegistry.rootEpic);