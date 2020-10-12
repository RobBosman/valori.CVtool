import { reducerRegistry } from "../../../redux/reducerRegistry";
import * as safeActions from "../safe-actions";

describe("safe-actions.test", () => {

  const _reducer = reducerRegistry.getRootReducer();

  it("should reduce safe", () => {
    let _state = undefined;

    const dummySafeContentV0 = {
      DUMMY: {}
    };
    _state = _reducer(_state, safeActions.replaceContent(dummySafeContentV0));
    expect(_state.safe.content).toStrictEqual(dummySafeContentV0);

    _state = _reducer(_state, safeActions.replaceContent());
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
    _state = _reducer(_state, safeActions.replaceInstance("DUMMY", 313, dummyInstanceV1));
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
    _state = _reducer(_state, safeActions.replaceInstance("DUMMY", 313, dummyInstanceV2));
    expect(_state.safe.content).toStrictEqual(dummySafeContentV2);

    _state = _reducer(_state, safeActions.replaceInstance("DUMMY", 313));
    expect(_state.safe.content).toStrictEqual(dummySafeContentV0);
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
