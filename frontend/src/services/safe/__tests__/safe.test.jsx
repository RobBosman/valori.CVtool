import reducerRegistry from "../../../redux/reducerRegistry";
import { replaceSafeContent, replaceSafeInstance } from "../safe-actions";

describe("safe", () => {

  it("should reduce", () => {
    const reducer = reducerRegistry.getRootReducer();
    let state = undefined;

    const dummySafe0 = {
      DUMMY: {}
    };
    state = reducer(state, replaceSafeContent(dummySafe0));
    expect(state.safe.DUMMY).toStrictEqual({});

    const dummyInstance1 = {
      _id: 313,
      value: 767
    };
    const dummySafe1 = {
      DUMMY: {
        [dummyInstance1._id]: dummyInstance1
      }
    };
    state = reducer(state, replaceSafeInstance("DUMMY", 313, dummyInstance1));
    expect(state.safe).toStrictEqual(dummySafe1);

    const dummyInstance2 = {
      ...dummyInstance1,
      value: 676
    };
    const dummySafe2 = {
      DUMMY: {
        [dummyInstance2._id]: dummyInstance2
      }
    };
    state = reducer(state, replaceSafeInstance("DUMMY", 313, dummyInstance2));
    expect(state.safe).toStrictEqual(dummySafe2);
  });
});
