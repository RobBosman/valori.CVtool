import { BehaviorSubject, of, EMPTY, merge } from "rxjs";
import { mergeMap, catchError } from "rxjs/operators";
import { ErrorSources, setLastError } from "../services/error/error-actions";

export class EpicRegistry {
  
  constructor(firstEpic = () => EMPTY) {
    this._epic$ = new BehaviorSubject(firstEpic);
  }

  register = (...epics) =>
    epics.map((epic) => this._epic$.next(epic));

  rootEpic = (...args) =>
    this._epic$.pipe(
      mergeMap((epic) => epic(...args).pipe(
        catchError((error, source$) => {
          console.error("REDUX_MIDDLEWARE ERROR", error);
          return merge(
            of(setLastError(`${error}`.replace(/^Error: /, ""), ErrorSources.reduxMiddleware)),
            source$
          );
        })
      ))
    );
}

export const epicRegistry = new EpicRegistry();