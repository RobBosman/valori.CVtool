import { reducerRegistry } from "../../../redux/reducerRegistry";
import { setLastError, ErrorSources } from "../error-actions";

describe("error-actions", () => {

  const reducer = reducerRegistry.getRootReducer();

  it("should reduce setLastError", () => {
    const state = reducer(undefined, setLastError("176-671", ErrorSources.REDUX_MIDDLEWARE));
    expect(state.error.lastError.message)
      .toBe("176-671");
    expect(state.error.lastError.source)
      .toBe("REDUX_MIDDLEWARE");
  });
});
