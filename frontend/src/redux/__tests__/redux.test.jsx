import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";
import reducerRegistry from "../reducerRegistry";

describe("redux", () => {

  it("should register reducers", () => {
    const store = configureStore({
      reducer: reducerRegistry.getRootReducer()
    });
    reducerRegistry.setChangeListener((rootReducer) => store.replaceReducer(rootReducer));
    expect(store.getState()).toStrictEqual({});

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
    reducerRegistry.register("dummy", dummyReducer);
    expect(store.getState().dummy.value).toBe(313);

    store.dispatch(dummyAction(767));
    expect(store.getState().dummy.value).toBe(767);
  });
});
