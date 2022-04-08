import { createEpicMiddleware } from "redux-observable";
import { configureStore } from "@reduxjs/toolkit";
import { composeWithDevTools } from "@redux-devtools/extension";
import { reducerRegistry } from "./reducerRegistry";
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