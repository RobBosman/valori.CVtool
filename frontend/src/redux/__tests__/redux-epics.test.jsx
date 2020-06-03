import { createAction } from "@reduxjs/toolkit";
import { ofType } from "redux-observable";
import { timer, of, merge } from "rxjs";
import { map } from "rxjs/operators";
import epicRegistry from "../epicRegistry";

describe("redux", () => {

  const dummyAction1 = createAction("DUMMY_ACTION_1");
  const dummyAction2 = createAction("DUMMY_ACTION_2");
  const dummyAction3 = createAction("DUMMY_ACTION_3");
  const action$ = of(
    dummyAction1(767), 
    dummyAction2(676)
  );

  it("should work without registered epics", () => {
    expect.assertions(0);
    return new Promise((resolve, reject) =>
      merge(
        epicRegistry.rootEpic(action$), // expect no response
        timer(2000) // expect response '0' after delay
      ).subscribe(
        (next) => next === 0 ? resolve() : reject("unexpected next()"),
        (error) => reject(error),
        () => reject("unexpected complete()")
      )
    );
  });

  it("should work without registered epics", () => {
    const testEpics = [
      (actions$) => actions$.pipe(
        ofType(dummyAction1.type),
        map(() => dummyAction2(313))
      ),
      (actions$) => actions$.pipe(
        ofType(dummyAction2.type),
        map(() => dummyAction3(313))
      )
    ];
    epicRegistry.register(testEpics);
    
    const expectedActions = [
      dummyAction3(313)
    ];

    expect.assertions(expectedActions.length);
    return new Promise((resolve, reject) =>
      epicRegistry
        .rootEpic(action$)
        .subscribe(
          (action) => {
            expect(action).toStrictEqual(expectedActions.shift());
            if (expectedActions.length === 0) {
              resolve();
            }
          },
          (error) => reject(error), 
          () => reject()
        ));
  });
});