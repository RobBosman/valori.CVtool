"use strict";

import { ofType } from "redux-observable";
import { filter, tap } from "rxjs/operators";
import { fetchAll, saveAll } from "./safe-actions";
import { fetchCvFromRemote, saveAllToRemote } from "./safe-services";

export const safeEpics = [
  (actions$, state$) => actions$.pipe(
    ofType(fetchAll.type),
    tap(() => fetchCvFromRemote(state$.value)),
    filter(() => false)
  ),
  (actions$, state$) => actions$.pipe(
    ofType(saveAll.type),
    tap(() => saveAllToRemote(state$.value)),
    filter(() => false)
  )
];