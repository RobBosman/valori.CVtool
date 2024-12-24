import { BehaviorSubject, of, EMPTY, merge } from "rxjs";
import { mergeMap, catchError } from "rxjs/operators";
import { ErrorSources, setLastError } from "../services/error/error-actions";

export class EpicRegistry {
  
  constructor(initialEpic = () => EMPTY) {
    this.allEpics = [initialEpic];
    this.epic$ = new BehaviorSubject(initialEpic);
  }

  register = (...epics) =>
    epics
      .filter(epic => !this.allEpics.includes(epic)) // Add epics only once.
      .forEach(epic => {
        this.allEpics.push(epic);
        this.epic$.next(epic);
      });

  rootEpic = (...args) =>
    this.epic$.pipe(
      mergeMap((epic) => epic(...args).pipe(
        catchError((error, source$) => {
          console.error("REDUX_MIDDLEWARE ERROR", error);
          return merge(
            of(setLastError(`${error}`.replace(/^Error: /, ""), ErrorSources.reduxMiddleware, error.stack)),
            source$
          );
        })
      ))
    );
}

export const epicRegistry = new EpicRegistry();