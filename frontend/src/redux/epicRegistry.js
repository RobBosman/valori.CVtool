import { BehaviorSubject } from 'rxjs';
import { filter, mergeMap, tap } from 'rxjs/operators';
import { heavyWait } from "./../app";

export class EpicRegistry {

  constructor() {
    const noOpEpic = (actions$) => actions$.pipe(
      tap((action) => console.debug("dispatched action: ", action)),
      tap((action) => heavyWait(action.type, 0)),
      filter(() => false)
    );
    this._epic$ = new BehaviorSubject(noOpEpic);
  }

  rootEpic = (action$, state$) =>
    this._epic$.pipe(
      mergeMap((epic) => epic(action$, state$))
    );

  register = (epics) =>
    epics.map((epic) => this._epic$.next(epic));
}

const epicRegistry = new EpicRegistry();
export default epicRegistry;