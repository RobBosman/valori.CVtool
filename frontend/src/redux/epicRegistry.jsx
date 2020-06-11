import { BehaviorSubject, EMPTY } from "rxjs";
import { mergeMap } from "rxjs/operators";

export class EpicRegistry {
  
  constructor() {
    this._epic$ = new BehaviorSubject(() => EMPTY);
  }

  register = (epics) => epics.map((epic) => this._epic$.next(epic));

  rootEpic = (...args$) => this._epic$.pipe(
    mergeMap((epic) => epic(...args$))
  );
}

export const epicRegistry = new EpicRegistry();