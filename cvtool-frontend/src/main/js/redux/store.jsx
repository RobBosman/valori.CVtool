import { createEpicMiddleware } from "redux-observable";
import { configureStore } from "@reduxjs/toolkit";
import { composeWithDevTools } from "@redux-devtools/extension";
import { reducerRegistry } from "./reducerRegistry";
import { epicRegistry } from "./epicRegistry";

const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: reducerRegistry.getRootReducer(),
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat([epicMiddleware]),
  enhancers: getDefaultEnhancers => getDefaultEnhancers().concat(composeWithDevTools)
});

reducerRegistry.setChangeListener((rootReducer) => store.replaceReducer(rootReducer));

epicMiddleware.run(epicRegistry.rootEpic);