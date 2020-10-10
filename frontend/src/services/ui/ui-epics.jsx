import { map, filter, distinctUntilChanged, switchMap, debounceTime } from "rxjs/operators";
import { ofType } from "redux-observable";
import { fromEvent } from "rxjs";
import { eventBusClient } from "../eventBus/eventBus-services";
import { LoginStates } from "../authentication/authentication-actions";
import * as uiActions from "./ui-actions";
import * as safeActions from "../safe/safe-actions";

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

  // Register last edited timestamp.
  (action$) => action$.pipe(
    ofType(safeActions.replaceSafeInstance.type),
    map(() => uiActions.setLastEditedTimestamp(new Date()))
  ),

  (action$) => action$.pipe(
    ofType(safeActions.replaceSafeContent.type),
    map(() => uiActions.setLastSavedTimestamp(new Date()))
  ),

  // Auto-save 2 seconds after the last edit.
  (action$, state$) => action$.pipe(
    ofType(uiActions.setLastEditedTimestamp.type),
    map((action) => action.payload),
    debounceTime(2000),
    filter((lastEditedTimestamp) => lastEditedTimestamp > state$.value.ui.lastSavedTimestamp),
    map(() => safeActions.saveAll())
  ),

  // Send the content of the safe to the server.
  (action$, state$) => action$.pipe(
    ofType(safeActions.saveAll.type),
    switchMap(() => {
      const saveTimestamp = new Date();
      return eventBusClient
        .sendEvent("save", state$.value.safe)
        .then(() => uiActions.setLastSavedTimestamp(saveTimestamp));
    })
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