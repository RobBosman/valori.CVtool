import { reducerRegistry } from "../../../../main/js/redux/reducerRegistry";
import * as utils from "../../../../main/js/utils/CommonUtils";
import * as safeActions from "../../../../main/js/services/safe/safe-actions";

describe("safe-actions.test", () => {

  const _reducer = reducerRegistry.getRootReducer();

  it("should reduce resetEntities and changeInstance(s)", () => {
    let _state = undefined;

    const dummySafeContentV0 = {
      DUMMY: {}
    };
    _state = _reducer(_state, safeActions.resetEntities(dummySafeContentV0));
    expect(_state.safe.content).toStrictEqual({});

    const dummyInstanceV1 = {
      _id: 313,
      value: "176-761"
    };
    const dummySafeContentV1 = {
      DUMMY: {
        313: dummyInstanceV1
      }
    };
    _state = _reducer(_state, safeActions.changeInstance("DUMMY", 313, dummyInstanceV1));
    expect(_state.safe.content).toStrictEqual(dummySafeContentV1);

    const dummyInstanceV2 = {
      _id: 313,
      value: "176-617"
    };
    const dummySafeContentV2 = {
      DUMMY: {
        313: dummyInstanceV2
      }
    };
    _state = _reducer(_state, safeActions.changeInstance("DUMMY", 313, dummyInstanceV2));
    expect(_state.safe.content).toStrictEqual(dummySafeContentV2);

    _state = _reducer(_state, safeActions.changeInstance("DUMMY", 313));
    expect(_state.safe.content).toStrictEqual({});

    _state = _reducer(_state, safeActions.changeInstances("DUMMY", []));
    expect(_state.safe.content).toStrictEqual({});

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
    _state = _reducer(_state, safeActions.changeInstances("DUMMY", [dummyInstanceV1, dummyInstanceV2, dummyInstanceV3]));
    expect(_state.safe.content).toStrictEqual(dummySafeContentV3);

    _state = _reducer(_state, safeActions.resetEntities(null));
    expect(_state.safe.content).toStrictEqual({});
  });

  it("should reduce setLastSavedTimestamp", () => {
    const timestamp = new Date("1970-04-01");
    const state = _reducer(undefined, safeActions.setLastSavedTimeString(timestamp.toISOString()));
    expect(utils.parseTimeString(state.safe.lastSavedTimeString))
      .toStrictEqual(timestamp);
  });
});
