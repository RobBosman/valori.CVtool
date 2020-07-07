import { BehaviorSubject, of, EMPTY } from "rxjs";
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
      mergeMap((epic) => epic(...args$)),
      catchError((error) => of(setEpicError(error.stack)))
    );
}

export const epicRegistry = new EpicRegistry();