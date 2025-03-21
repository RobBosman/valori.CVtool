import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";
import { createEpicMiddleware, ofType, combineEpics } from "redux-observable";
import { map, tap, ignoreElements } from "rxjs/operators";
import { EpicRegistry } from "../../../main/js/redux//epicRegistry";

describe("redux-epics.test", () => {

  const dummyAction1 = createAction("DUMMY_ACTION_1");
  const dummyAction2 = createAction("DUMMY_ACTION_2");
  const dummyAction3 = createAction("DUMMY_ACTION_3");
  const dummyReducer = createReducer(
    {
      value1: "176-176",
      value2: "176-176",
      value3: "176-176"
    },
    builder => builder
      .addCase(dummyAction1, (state, action) => {
        state.value1 = action.payload;
      })
      .addCase(dummyAction2, (state, action) => {
        state.value2 = action.payload;
      })
      .addCase(dummyAction3, (state, action) => {
        state.value3 = action.payload;
      })
  );
  const testActions = [
    dummyAction1("176-167"),
    dummyAction2("176-617"),
    dummyAction3("176-716"),
    dummyAction2("176-671"),
    dummyAction3("176-761")
  ];
  const dummyEpics0 = [
    (action$) => action$.pipe(
      ofType(dummyAction3.type),
      map(() => dummyAction1(313))
    )
  ];
  const dummyEpics1 = [
    (action$) => action$.pipe(
      ofType(dummyAction3.type),
      map(() => dummyAction2(671))
    ),
    (action$) => action$.pipe(
      ofType(dummyAction1.type),
      map(() => dummyAction2(617))
    )
  ];

  let _store;
  let _dispatchedActions;
  let _epicRegistry;

  beforeEach(() => {
    const epicMiddleware = createEpicMiddleware();
    _store = configureStore({
      reducer: dummyReducer,
      middleware: getDefaultMiddleware => getDefaultMiddleware().concat([epicMiddleware])
    });

    _dispatchedActions = [];
    const actionRecorder = (action$) => action$.pipe(
      tap((action) => _dispatchedActions.push(action)),
      ignoreElements()
    );

    _epicRegistry = new EpicRegistry();
    epicMiddleware.run(combineEpics(actionRecorder, _epicRegistry.rootEpic));
  });

  it("should do nothing with no registered epics", () => {
    testActions.map(_store.dispatch);
    expect(_dispatchedActions).toStrictEqual([
      dummyAction1("176-167"),
      dummyAction2("176-617"),
      dummyAction3("176-716"),
      dummyAction2("176-671"),
      dummyAction3("176-761")
    ]);
    expect(_store.getState()).toStrictEqual({
      value1: "176-167",
      value2: "176-671",
      value3: "176-761"
    });
  });

  it("should work with registered epics [0]", () => {
    _epicRegistry.register(...dummyEpics0);
    testActions.map(_store.dispatch);
    expect(_dispatchedActions).toStrictEqual([
      dummyAction1("176-167"),
      dummyAction2("176-617"),
      dummyAction3("176-716"),
      dummyAction1(313),
      dummyAction2("176-671"),
      dummyAction3("176-761"),
      dummyAction1(313)
    ]);
    expect(_store.getState()).toStrictEqual({
      value1: 313,
      value2: "176-671",
      value3: "176-761"
    });
  });

  it("should work with registered epics [1]", () => {
    _epicRegistry.register(...dummyEpics1);
    testActions.map(_store.dispatch);
    expect(_dispatchedActions).toStrictEqual([
      dummyAction1("176-167"),
      dummyAction2(617),
      dummyAction2("176-617"),
      dummyAction3("176-716"),
      dummyAction2(671),
      dummyAction2("176-671"),
      dummyAction3("176-761"),
      dummyAction2(671)
    ]);
    expect(_store.getState()).toStrictEqual({
      value1: "176-167",
      value2: 671,
      value3: "176-761"
    });
  });

  it("should work with registered epics [0, 1]", () => {
    _epicRegistry.register(...dummyEpics0);
    _epicRegistry.register(...dummyEpics1);
    testActions.map(_store.dispatch);
    expect(_dispatchedActions).toStrictEqual([
      dummyAction1("176-167"),
      dummyAction2(617),
      dummyAction2("176-617"),
      dummyAction3("176-716"),
      dummyAction1(313),
      dummyAction2(617),
      dummyAction2(671),
      dummyAction2("176-671"),
      dummyAction3("176-761"),
      dummyAction1(313),
      dummyAction2(617),
      dummyAction2(671)
    ]);
    expect(_store.getState()).toStrictEqual({
      value1: 313,
      value2: 671,
      value3: "176-761"
    });
  });

  it("should work with registered epics [1, 0]", () => {
    _epicRegistry.register(...dummyEpics1);
    _epicRegistry.register(...dummyEpics0);
    testActions.map(_store.dispatch);
    expect(_dispatchedActions).toStrictEqual([
      dummyAction1("176-167"),
      dummyAction2(617),
      dummyAction2("176-617"),
      dummyAction3("176-716"),
      dummyAction2(671),
      dummyAction1(313),
      dummyAction2(617),
      dummyAction2("176-671"),
      dummyAction3("176-761"),
      dummyAction2(671),
      dummyAction1(313),
      dummyAction2(617)
    ]);
    expect(_store.getState()).toStrictEqual({
      value1: 313,
      value2: 617,
      value3: "176-761"
    });
  });
});
