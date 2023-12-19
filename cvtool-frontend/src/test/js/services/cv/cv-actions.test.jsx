import { reducerRegistry } from "../../../../main/js/redux/reducerRegistry";
import * as utils from "../../../../main/js/utils/CommonUtils";
import * as cvActions from "../../../../main/js/services/cv/cv-actions";

describe("cv-actions.test", () => {

  const reducer = reducerRegistry.getRootReducer();

  it("should reduce generateCv", () => {
    const now = new Date();
    const state = reducer(undefined, cvActions.generateCv());
    expect(utils.parseTimeString(state.cv?.generateCvTimeString).getTime())
      .toBeGreaterThanOrEqual(now.getTime());
  });
});