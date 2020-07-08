import { BehaviorSubject, of, EMPTY, merge } from "rxjs";
import { mergeMap, catchError } from "rxjs/operators";
import { setEpicError } from "./error-actions";

export class EpicRegistry {
  
  constructor() {
    this._epic$ = new BehaviorSubject(() => EMPTY);
  }

  register = (...epics) =>
    epics.map((epic) => this._epic$.next(epic));

  rootEpic = (...args$) =>
    this._epic$.pipe(
      mergeMap((epic) => epic(...args$).pipe(
        catchError((error, source$) => merge(
          of(setEpicError(error.stack || error.error?.stack || error.message)),
          source$)
        )
      )),
    );
}

export const epicRegistry = new EpicRegistry();