/**
 * @jest-environment jsdom
 */
import { createEpicMiddleware } from "redux-observable";
import { configureStore } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../../../main/js/redux/reducerRegistry";
import { EpicRegistry } from "../../../../main/js/redux/epicRegistry";
import { errorEpics } from "../../../../main/js/services/error/error-epics";

describe("error-epics.test", () => {

  let _epicRegistry;
  let _store;

  beforeEach(() => {
    _epicRegistry = new EpicRegistry();
    const epicMiddleware = createEpicMiddleware();
    _store = configureStore({
      reducer: reducerRegistry.getRootReducer(),
      middleware: getDefaultMiddleware => getDefaultMiddleware().concat([epicMiddleware])
    });
    epicMiddleware.run(_epicRegistry.rootEpic);
    _epicRegistry.register(...errorEpics);
  });

  it("should handle windows 'error' event", () =>
    new Promise((_resolve) => {
      expect(_store.getState().error.lastError)
        .toBe(undefined);
      setTimeout(() => { throw new Error("Amai zeg!"); }, 0);
      setTimeout(() => _resolve(), 5);
    })
      .then(() => expect(_store.getState().error.lastError.message)
        .toContain("Amai zeg!"))
  );
});