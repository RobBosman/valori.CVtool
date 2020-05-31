import { createEpicMiddleware } from "redux-observable";
import { configureStore } from "@reduxjs/toolkit";
import reducerRegistry from "./reducerRegistry";
import epicRegistry from "./epicRegistry";

const epicMiddleware = createEpicMiddleware();

const store = configureStore({
  reducer: reducerRegistry.getRootReducer(),
  middleware: [epicMiddleware]
});

reducerRegistry.setChangeListener((rootReducer) => store.replaceReducer(rootReducer));

epicMiddleware.run(epicRegistry.rootEpic);

export default store;