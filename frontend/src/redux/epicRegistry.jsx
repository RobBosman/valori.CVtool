import { BehaviorSubject, EMPTY } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { combineEpics } from "redux-observable";

export class EpicRegistry {
  
  constructor() {
    this._epic$ = new BehaviorSubject(() => EMPTY);
  }

  register = (epics) => this._epic$.next(combineEpics(this._epic$.value, ...epics));

  rootEpic = (...args$) => this._epic$.pipe(
    mergeMap((epic) => epic(...args$))
  );
}

const epicRegistry = new EpicRegistry();
export default epicRegistry;