import { createAction } from "@reduxjs/toolkit";
import { ofType } from "redux-observable";
import { timer, merge, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { EpicRegistry } from "../epicRegistry";

const testEpics = (epics$, dispatch, testActions, expectedMessages, timeout = 10) => new Promise((_resolve, _reject) => {
  const numExpected = expectedMessages.length;
  merge(
    epics$,
    timer(timeout) // emit '0' after timeout
  ).subscribe(
    (message) => {
      if (expectedMessages.length > 0) {
        try {
          expect(message).toStrictEqual(expectedMessages.shift());
        }
        catch(failure) {
          _reject(new Error(`${failure}. Expected message[${numExpected - 1 - expectedMessages.length}]`)); 
        }
      } else if (message === 0) {
        _resolve();
      } else {
        _reject(new Error(`Unexpected next(): ${JSON.stringify(message)}`));
      }
    },
    (error) => _reject(error), 
    () => _reject(new Error("Unexpected complete()"))
  );

  testActions.map((action) => dispatch(action));
});

describe("redux", () => {

  let _epicRegistry;
  let action$;

  beforeEach(() => {
    action$ = new Subject();
    _epicRegistry = new EpicRegistry();
  });

  afterEach(() => {
    _epicRegistry = null;
  });

  const dummyAction1 = createAction("DUMMY_ACTION_1");
  const dummyAction2 = createAction("DUMMY_ACTION_2");
  const dummyAction3 = createAction("DUMMY_ACTION_3");
  const testActions = [
    dummyAction1("176-167"), 
    dummyAction2("176-671"), 
    dummyAction3("176-761"), 
    dummyAction2("176-671"), 
    dummyAction3("176-716")
  ];
  const dummyEpics0 = [
    (actions$) => actions$.pipe(
      ofType(dummyAction2.type),
      map(() => dummyAction1("176-176"))
    )
  ];
  const dummyEpics1 = [
    (actions$) => actions$.pipe(
      ofType(dummyAction2.type),
      map(() => dummyAction3(313))
    ),
    (actions$) => actions$.pipe(
      ofType(dummyAction1.type),
      map(() => dummyAction2("176-176"))
    )
  ];

  const runEpics = () => _epicRegistry.rootEpic(action$);
  const dispatch = (action) => action$.next(action);

  it("should do nothing with no registered epics", () => {
    const epics$ = runEpics();
    const expectedActions = [];
    return testEpics(epics$, dispatch, testActions, expectedActions);
  });

  it("should work with early registered epics [0]", () => {
    _epicRegistry.register(dummyEpics0);
    const epics$ = runEpics();
    const expectedActions = [
      dummyAction1("176-176"),
      dummyAction1("176-176")
    ];
    return testEpics(epics$, dispatch, testActions, expectedActions);
  });

  it("should work with late registered epics [0]", () => {
    const epics$ = runEpics();
    _epicRegistry.register(dummyEpics0);
    const expectedActions = [
      dummyAction1("176-176"),
      dummyAction1("176-176")
    ];
    return testEpics(epics$, dispatch, testActions, expectedActions);
  });

  it("should work with early registered epics [1]", () => {
    _epicRegistry.register(dummyEpics1);
    const epics$ = runEpics();
    const expectedActions = [
      dummyAction2("176-176"),
      dummyAction3(313),
      dummyAction3(313)
    ];
    return testEpics(epics$, dispatch, testActions, expectedActions);
  });

  it("should work with late registered epics [1]", () => {
    const epics$ = runEpics();
    _epicRegistry.register(dummyEpics1);
    const expectedActions = [
      dummyAction2("176-176"),
      dummyAction3(313),
      dummyAction3(313)
    ];
    return testEpics(epics$, dispatch, testActions, expectedActions);
  });

  // TODO - fix these tests
  // it("should work with early registered epics [0, 1]", () => {
  //   _epicRegistry.register(dummyEpics0);
  //   _epicRegistry.register(dummyEpics1);
  //   const epics$ = runEpics();
  //   const expectedActions = [
  //     dummyAction2("176-176"),
  //     dummyAction3(313),
  //     dummyAction3(313),
  //     dummyAction1("176-176"),
  //     dummyAction1("176-176")
  //   ];
  //   return testEpics(epics$, dispatch, testActions, expectedActions);
  // });

  // it("should work with early and late registered epics [0, 1]", () => {
  //   _epicRegistry.register(dummyEpics0);
  //   const epics$ = runEpics();
  //   _epicRegistry.register(dummyEpics1);
  //   const expectedActions = [
  //     dummyAction2("176-176"),
  //     dummyAction1("176-176"),
  //     dummyAction3(313),
  //     dummyAction1("176-176"),
  //     dummyAction3(313)
  //   ];
  //   return testEpics(epics$, dispatch, testActions, expectedActions);
  // });

  // it("should work with late registered epics [0, 1]", () => {
  //   const epics$ = runEpics();
  //   _epicRegistry.register(dummyEpics0);
  //   _epicRegistry.register(dummyEpics1);
  //   const expectedActions = [
  //     dummyAction2("176-176"),
  //     dummyAction1("176-176"),
  //     dummyAction3(313),
  //     dummyAction1("176-176"),
  //     dummyAction3(313)
  //   ];
  //   return testEpics(epics$, dispatch, testActions, expectedActions);
  // });

  // it("should work with early registered epics [1, 0]", () => {
  //   _epicRegistry.register(dummyEpics1);
  //   _epicRegistry.register(dummyEpics0);
  //   const epics$ = runEpics();
  //   const expectedActions = [
  //     dummyAction2("176-176"),
  //     dummyAction1("176-176"),
  //     dummyAction3(313),
  //     dummyAction1("176-176"),
  //     dummyAction3(313)
  //   ];
  //   return testEpics(epics$, dispatch, testActions, expectedActions);
  // });

  // it("should work with early and late registered epics [1, 0]", () => {
  //   _epicRegistry.register(dummyEpics1);
  //   const epics$ = runEpics();
  //   _epicRegistry.register(dummyEpics0);
  //   const expectedActions = [
  //     dummyAction2("176-176"),
  //     dummyAction1("176-176"),
  //     dummyAction3(313),
  //     dummyAction1("176-176"),
  //     dummyAction3(313)
  //   ];
  //   return testEpics(epics$, dispatch, testActions, expectedActions);
  // });

  // it("should work with late registered epics [1, 0]", () => {
  //   const epics$ = runEpics();
  //   _epicRegistry.register(dummyEpics1);
  //   _epicRegistry.register(dummyEpics0);
  //   const expectedActions = [
  //     dummyAction2("176-176"),
  //     dummyAction1("176-176"),
  //     dummyAction3(313),
  //     dummyAction1("176-176"),
  //     dummyAction3(313)
  //   ];
  //   return testEpics(epics$, dispatch, testActions, expectedActions);
  // });
});