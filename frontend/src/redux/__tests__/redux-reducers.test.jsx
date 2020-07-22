import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../reducerRegistry";

describe("redux-reducers", () => {

  const dummyAction = createAction("DUMMY_ACTION");
  const dummyReducer = createReducer(
    {
      value: 313
    },
    {
      [dummyAction]: (state, action) => {
        state.value = action.payload;
      },
    });
  const store = configureStore({
    reducer: reducerRegistry.getRootReducer()
  });

  it("should have empty state with no registered reducers", () => {
    reducerRegistry.setChangeListener((rootReducer) => store.replaceReducer(rootReducer));
    expect(store.getState()).toStrictEqual({});
  });

  it("should have default state with registered reducers", () => {
    reducerRegistry.register("dummy", dummyReducer);
    expect(store.getState()).toStrictEqual({dummy: {value: 313}});
  });

  it("should apply registered reducers", () => {
    store.dispatch(dummyAction("176-761"));
    expect(store.getState()).toStrictEqual({dummy: {value: "176-761"}});
  });
});
