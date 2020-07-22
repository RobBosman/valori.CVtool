import { tap, ignoreElements, map } from "rxjs/operators";
import { heavyWait } from "./ui-services";
import { fromEvent } from "rxjs";
import { setLocationHash } from "./ui-actions";

export const uiEpics = [
  // Keep track of location (address bar) changes.
  () => fromEvent(window, "hashchange").pipe(
    map(() => setLocationHash(document.location.hash || ""))
  ),

  // // Log all Redux actions.
  // (action$) => action$.pipe(
  //   tap((action) => console.debug("dispatched action: ", action)),
  //   ignoreElements()
  // ),

  // Add artificial delays.
  (action$) => action$.pipe(
    tap((action) => heavyWait(action.type, 0)),
    ignoreElements()
  )
];