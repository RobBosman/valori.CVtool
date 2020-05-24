"use strict";

import { ofType } from "redux-observable";
import { filter, tap } from "rxjs/operators";
import store from "../../redux/store";
import { fetchAll, saveAll } from "./safe-actions";
import { fetchCvFromRemote, saveAllToRemote } from "./safe-services";

export const safeEpics = [
  (actions$, state$) => actions$.pipe(
    ofType(fetchAll.type),
    tap(() => fetchCvFromRemote(state$.value, store.dispatch)),
    filter(() => false)
  ),
  (actions$, state$) => actions$.pipe(
    ofType(saveAll.type),
    tap(() => saveAllToRemote(state$.value, store.dispatch)),
    filter(() => false)
  )
];