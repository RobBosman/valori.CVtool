import { BehaviorSubject, of, EMPTY } from "rxjs";
import { mergeMap, catchError } from "rxjs/operators";
import { setEpicError } from "./errorHandler";

export class EpicRegistry {
  
  constructor() {
    this._epic$ = new BehaviorSubject(() => EMPTY);
  }

  register = (...epics) =>
    epics.map((epic) => this._epic$.next(epic));

  rootEpic = (...args$) => {
    return this._epic$.pipe(
      mergeMap((epic) => epic(...args$)),
      catchError((error) => of(setEpicError(error)))
    );
  };
}

export const epicRegistry = new EpicRegistry();