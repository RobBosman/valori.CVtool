"use strict";

import { ofType } from "redux-observable";
import { flatMap } from "rxjs/operators";
import { fetchAll, saveAll } from "./safe-actions";
import { fetchCvFromRemote, saveAllToRemote } from "./safe-services";

export const safeEpics = [
  (actions$, state$) => actions$.pipe(
    ofType(fetchAll.type),
    flatMap(() => fetchCvFromRemote(state$.value))
  ),
  (actions$, state$) => actions$.pipe(
    ofType(saveAll.type),
    flatMap(() => saveAllToRemote(state$.value))
  )
];