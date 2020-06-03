import { BehaviorSubject, EMPTY } from "rxjs";
import { mergeMap, tap, switchMap } from "rxjs/operators";
import { heavyWait } from "../utils/Utils";

export class EpicRegistry {

  constructor() {
    const noOpEpic = (actions$) => actions$.pipe(
      // tap((action) => console.debug("dispatched action: ", action)),
      tap((action) => heavyWait(action.type, 0)),
      switchMap(() => EMPTY)
    );
    this._epic$ = new BehaviorSubject(noOpEpic);
  }

  rootEpic = (action$, state$) => {
    return this._epic$.pipe(
      mergeMap((epic) => epic(action$, state$))
    );
  }

  register = (epics) =>
    epics.map((epic) => this._epic$.next(epic));
}

const epicRegistry = new EpicRegistry();
export default epicRegistry;