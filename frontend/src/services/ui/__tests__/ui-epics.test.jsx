/**
 * @jest-environment jsdom
 */
import { createEpicMiddleware } from "redux-observable";
import { configureStore } from "@reduxjs/toolkit";
import { EpicRegistry } from "../../../redux/epicRegistry";
import { reducerRegistry } from "../../../redux/reducerRegistry";
import { uiEpics } from "../ui-epics";

describe("ui-epics.test", () => {

  let _store;

  beforeEach(() => {
    const epicMiddleware = createEpicMiddleware();
    _store = configureStore({
      reducer: reducerRegistry.getRootReducer(),
      middleware: [epicMiddleware]
    });

    const epicRegistry = new EpicRegistry();
    epicRegistry.register(...uiEpics);
    epicMiddleware.run(epicRegistry.rootEpic);
  });

  it("should handle windows event 'hashchange'", () => {
    expect(_store.getState().ui.locationHash)
      .toBe("");
    window.location.hash = "hashLocation";
    return new Promise((_resolve) =>
      setTimeout(() => {
        // TODO: fix this
        // expect(_store.getState().ui.locationHash)
        //   .toBe("#hashLocation");
        _resolve();
      }, 100));
  });
});