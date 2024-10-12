import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";
import { ReducerRegistry } from "../../../main/js/redux/reducerRegistry";

describe("redux-reducers.test", () => {

  const dummyAction = createAction("DUMMY_ACTION");
  const dummyReducer = createReducer(
    {
      value: 313
    },
    builder => builder
      .addCase(dummyAction, (state, action) => {
        state.value = action.payload;
      })
  );

  let _store;
  let _reducerRegistry;

  beforeEach(() => {
    _reducerRegistry = new ReducerRegistry();
    _reducerRegistry.register("void", createReducer({}, builder => builder));
    _store = configureStore({
      reducer: _reducerRegistry.getRootReducer(),
      middleware: getDefaultMiddleware => getDefaultMiddleware()
    });
    _reducerRegistry.setChangeListener(rootReducer => _store.replaceReducer(rootReducer));
  });

  it("should have empty state with no registered reducers", () => {
    _reducerRegistry.setChangeListener((rootReducer) => _store.replaceReducer(rootReducer));
    expect(_store.getState()).toStrictEqual({"void": {}});
  });

  it("should have default state with registered reducers", () => {
    _reducerRegistry.register("dummy", dummyReducer);
    expect(_store.getState()).toStrictEqual({dummy: {value: 313}, "void": {}});
  });

  it("should apply registered reducers", () => {
    _reducerRegistry.register("dummy", dummyReducer);
    _store.dispatch(dummyAction("176-761"));
    expect(_store.getState()).toStrictEqual({dummy: {value: "176-761"}, "void": {}});
  });
});
