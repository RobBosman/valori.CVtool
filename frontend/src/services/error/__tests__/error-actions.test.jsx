import { reducerRegistry } from "../../../redux/reducerRegistry";
import { setLastError } from "../error-actions";

describe("error-actions", () => {

  const reducer = reducerRegistry.getRootReducer();

  it("should reduce setLastError", () => {
    const state = reducer(undefined, setLastError("176-671"));
    expect(state.error.lastError)
      .toBe("176-671");
  });
});
