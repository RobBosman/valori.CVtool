import { reducerRegistry } from "../../../redux/reducerRegistry";
import * as safeActions from "../safe-actions";

describe("safe-actions.test", () => {

  const _reducer = reducerRegistry.getRootReducer();

  it("should reduce replaceCvContent and replaceCvContentInstance(s)", () => {
    let _state = undefined;

    const dummySafeContentV0 = {
      DUMMY: {}
    };
    _state = _reducer(_state, safeActions.replaceCvContent(dummySafeContentV0));
    expect(_state.safe.cvContent).toStrictEqual(dummySafeContentV0);

    _state = _reducer(_state, safeActions.replaceCvContent());
    expect(_state.safe.cvContent).toStrictEqual({});

    const dummyInstanceV1 = {
      _id: 313,
      value: "176-761"
    };
    const dummySafeContentV1 = {
      DUMMY: {
        313: dummyInstanceV1
      }
    };
    _state = _reducer(_state, safeActions.replaceCvContentInstance("DUMMY", 313, dummyInstanceV1));
    expect(_state.safe.cvContent).toStrictEqual(dummySafeContentV1);

    const dummyInstanceV2 = {
      _id: 313,
      value: "176-617"
    };
    const dummySafeContentV2 = {
      DUMMY: {
        313: dummyInstanceV2
      }
    };
    _state = _reducer(_state, safeActions.replaceCvContentInstance("DUMMY", 313, dummyInstanceV2));
    expect(_state.safe.cvContent).toStrictEqual(dummySafeContentV2);

    _state = _reducer(_state, safeActions.replaceCvContentInstance("DUMMY", 313));
    expect(_state.safe.cvContent).toStrictEqual(dummySafeContentV0);


    _state = _reducer(_state, safeActions.replaceCvContentInstances("DUMMY", []));
    expect(_state.safe.cvContent).toStrictEqual(dummySafeContentV0);

    const dummyInstanceV3 = {
      _id: "176-617",
      value: 313
    };
    const dummySafeContentV3 = {
      DUMMY: {
        313: dummyInstanceV2,
        "176-617": dummyInstanceV3
      }
    };
    _state = _reducer(_state, safeActions.replaceCvContentInstances("DUMMY", [dummyInstanceV1, dummyInstanceV2, dummyInstanceV3]));
    expect(_state.safe.cvContent).toStrictEqual(dummySafeContentV3);
  });

  it("should reduce setLastEditedTimestamp", () => {
    const timestamp = new Date("1970-04-01");
    const state = _reducer(undefined, safeActions.setLastEditedTimestamp(timestamp));
    expect(state.safe.lastEditedTimestamp)
      .toBe(timestamp);
  });

  it("should reduce setLastSavedTimestamp", () => {
    const timestamp = new Date("1970-04-01");
    const state = _reducer(undefined, safeActions.setLastSavedTimestamp(timestamp));
    expect(state.safe.lastSavedTimestamp)
      .toBe(timestamp);
  });
});
