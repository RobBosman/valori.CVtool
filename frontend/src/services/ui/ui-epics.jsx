import { map, filter, distinctUntilChanged, debounceTime } from "rxjs/operators";
import { fromEvent } from "rxjs";
import { LoginStates } from "../authentication/authentication-actions";
import * as uiActions from "./ui-actions";
import * as safeActions from "../safe/safe-actions";
import { ofType } from "redux-observable";

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
  ),

  // Auto-save after 3 seconds.
  (action$, state$) => action$.pipe(
    ofType(safeActions.replaceSafeInstance.type),
    debounceTime(3000),
    filter(() => state$.value.ui.autoSaveEnabled),
    map(() => safeActions.saveAll())
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