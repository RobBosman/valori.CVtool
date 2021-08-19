import { reducerRegistry } from "../../../redux/reducerRegistry";
import * as cvActions from "../cv-actions";

describe("cv-actions.test", () => {

  const reducer = reducerRegistry.getRootReducer();

  it("should reduce generateCv", () => {
    const now = new Date();
    const state = reducer(undefined, cvActions.generateCv());
    expect(state.cv?.generateCvTimestamp?.getTime())
      .toBeGreaterThanOrEqual(now.getTime());
  });
});