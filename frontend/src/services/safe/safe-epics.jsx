import { ofType } from "redux-observable";
import { map, switchMap, debounceTime, filter } from "rxjs/operators";
import { eventBusClient } from "../eventBus/eventBus-services";
import * as safeActions from "./safe-actions";
import * as safeServices from "./safe-services";

export const safeEpics = [

  // Fetch accounts from the server.
  (action$) => action$.pipe(
    ofType(safeActions.fetchAccounts.type),
    switchMap(() => safeServices.fetchAccountsFromRemote(eventBusClient.sendEvent)),
    map((fetchedAccunts) => safeActions.replaceAccounts(fetchedAccunts))
  ),

  // Fetch cv data from the server.
  (action$) => action$.pipe(
    ofType(safeActions.fetchCvByAccountId.type),
    map((action) => action.payload),
    switchMap((accountId) => safeServices.fetchCvFromRemote(accountId, eventBusClient.sendEvent)),
    map((fetchedCv) => safeActions.replaceContent(fetchedCv))
  ),

  // Register last edited timestamp.
  (action$) => action$.pipe(
    ofType(safeActions.replaceAccountInstance.type, safeActions.replaceContentInstance.type, safeActions.replaceContentInstances.type),
    map(() => safeActions.setLastEditedTimestamp(new Date()))
  ),

  // Update state.lastSavedTimestamp after fetching 'fresh' data from the server.
  (action$) => action$.pipe(
    ofType(safeActions.replaceContent.type),
    map(() => safeActions.setLastSavedTimestamp(new Date()))
  ),

  // Auto-save 2 seconds after the last edit.
  (action$) => action$.pipe(
    ofType(safeActions.setLastEditedTimestamp.type),
    debounceTime(2000),
    map(() => safeActions.saveCv(false))
  ),

  // Send the content of the safe to the server.
  (action$, state$) => action$.pipe(
    ofType(safeActions.saveCv.type),
    map((action) => action.payload),
    filter((saveEnforced) => saveEnforced || state$.value.safe.lastEditedTimestamp > state$.value.safe.lastSavedTimestamp),
    switchMap(() => {
      const saveTimestamp = new Date();
      return safeServices.saveCvToRemote(state$.value.safe.content, eventBusClient.sendEvent)
        .then(() => safeActions.setLastSavedTimestamp(saveTimestamp));
    })
  )
];