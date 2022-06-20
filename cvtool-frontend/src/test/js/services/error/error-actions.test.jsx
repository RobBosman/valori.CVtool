import { reducerRegistry } from "../../../../main/js/redux/reducerRegistry";
import * as errorActions from "../../../../main/js/services/error/error-actions";

describe("error-actions.test", () => {

  const reducer = reducerRegistry.getRootReducer();

  it("should reduce setLastError", () => {
    const state = reducer(undefined, errorActions.setLastError("176-671", errorActions.ErrorSources.REDUX_MIDDLEWARE));
    expect(state.error.lastError.message)
      .toBe("176-671");
    expect(state.error.lastError.source)
      .toBe("REDUX_MIDDLEWARE");
  });
});
