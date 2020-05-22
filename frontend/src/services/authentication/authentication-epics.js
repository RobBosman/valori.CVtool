"use strict";

import { ofType } from "redux-observable";
import { filter, flatMap, map, tap, delay } from "rxjs/operators";
import { fromArray } from "rxjs/internal/observable/fromArray";
import { replaceSafeContent, fetchAll } from "../safe/safe-actions";
import { updateEventBusConnectionState } from "../eventBus/eventBus-actions";
import { confirmLogin, confirmLogout, requestLogin, requestLogout, setAccount } from "./authentication-actions";
import { loginToRemote } from "./authentication-services";

export const authenticationEpics = [
  (actions$, state$) => actions$.pipe(
    ofType(requestLogin.type, updateEventBusConnectionState.type),
    delay(1000), // TODO - remove delay
    tap(() => loginToRemote(state$.value)),
    filter(() => false)
  ),
  (actions$) => actions$.pipe(
    ofType(setAccount.type),
    filter((action) => action.payload),
    flatMap(() => fromArray([
      confirmLogin(),
      fetchAll()
    ]))
  ),
  (actions$) => actions$.pipe(
    ofType(requestLogout.type),
    delay(1000), // TODO - remove delay
    flatMap(() => fromArray([
      replaceSafeContent(undefined),
      setAccount(undefined)
    ]))
  ),
  (actions$) => actions$.pipe(
    ofType(setAccount.type),
    filter((action) => !action.payload),
    map((action) => confirmLogout())
  )
];