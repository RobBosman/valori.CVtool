import { map, filter, distinctUntilChanged } from "rxjs/operators";
import { fromEvent } from "rxjs";
import { LoginStates } from "../authentication/authentication-actions";
import * as uiActions from "./ui-actions";

export const uiEpics = [
  // Keep track of location (address bar) changes.
  () => fromEvent(window, "hashchange").pipe(
    map(() => uiActions.setLocationHash(document.location.hash || ""))
  ),

  // Delete selections on logout.
  (_, state$) => state$.pipe(
    map((state) => state.authentication.loginState),
    distinctUntilChanged(),
    filter((loginState) => loginState === LoginStates.LOGGED_OUT),
    map(() => uiActions.resetSelectedIds())
  )

  // // Log all Redux actions.
  // (action$) => action$.pipe(
  //   tap((action) => console.debug("dispatched action: ", action)),
  //   ignoreElements()
  // ),

  // // Add artificial delays.
  // (action$) => action$.pipe(
  //   tap((action) => heavyWait(action.type, 0)),
  //   ignoreElements()
  // )
];