import { reducerRegistry } from "../../../redux/reducerRegistry";
import { replaceSafeContent, replaceSafeInstance } from "../safe-actions";

describe("safe-actions", () => {

  it("should reduce safe", () => {
    const reducer = reducerRegistry.getRootReducer();
    let state = undefined;

    const dummySafe0 = {
      DUMMY: {}
    };
    state = reducer(state, replaceSafeContent(dummySafe0));
    expect(state.safe.DUMMY).toStrictEqual({});

    state = reducer(state, replaceSafeContent());
    expect(state.safe).toStrictEqual({});

    const dummyInstanceV1 = {
      _id: 313,
      value: "176-761"
    };
    const dummySafeV1 = {
      DUMMY: {
        313: dummyInstanceV1
      }
    };
    state = reducer(state, replaceSafeInstance("DUMMY", 313, dummyInstanceV1));
    expect(state.safe).toStrictEqual(dummySafeV1);

    const dummyInstanceV2 = {
      _id: 313,
      value: "176-617"
    };
    const dummySafeV2 = {
      DUMMY: {
        313: dummyInstanceV2
      }
    };
    state = reducer(state, replaceSafeInstance("DUMMY", 313, dummyInstanceV2));
    expect(state.safe).toStrictEqual(dummySafeV2);

    const dummySafeV3 = {
      DUMMY: {}
    };
    state = reducer(state, replaceSafeInstance("DUMMY", 313));
    expect(state.safe).toStrictEqual(dummySafeV3);
  });
});
