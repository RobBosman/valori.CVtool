import { ofType } from "redux-observable";
import { of } from "rxjs";
import { map, switchMap, debounceTime, filter, mergeMap, ignoreElements, tap } from "rxjs/operators";
import { eventBusClient } from "../eventBus/eventBus-services";
import * as safeActions from "./safe-actions";
import * as safeServices from "./safe-services";
import * as uiActions from "../ui/ui-actions";

export const safeEpics = [

  // Fetch all accounts from the server.
  (action$) => action$.pipe(
    ofType(safeActions.fetchAdminContent.type),
    switchMap(() => safeServices.fetchFromRemote({ "account": [] }, eventBusClient.sendEvent)),
    map((fetchedAccunts) => safeActions.replaceAdminContent(fetchedAccunts))
  ),

  // Fetch cv data from the server.
  (action$) => action$.pipe(
    ofType(safeActions.fetchCvByAccountId.type),
    map((action) => action.payload),
    switchMap((accountId) => safeServices.fetchCvFromRemote(accountId, eventBusClient.sendEvent)),
    mergeMap((fetchedCv) => of(
      safeActions.replaceCvContent(fetchedCv),
      uiActions.setSelectedId("account", Object.keys(fetchedCv.account)[0])
    ))
  ),

  // Register last edited timestamp.
  (action$) => action$.pipe(
    ofType(safeActions.replaceCvContentInstance.type, safeActions.replaceCvContentInstances.type),
    map(() => safeActions.setLastEditedTimestamp(new Date()))
  ),

  // Update state.lastSavedTimestamp after fetching 'fresh' data from the server.
  (action$) => action$.pipe(
    ofType(safeActions.replaceCvContent.type),
    map(() => safeActions.setLastSavedTimestamp(new Date()))
  ),

  // Auto-save 2 seconds after the last edit.
  (action$) => action$.pipe(
    ofType(safeActions.setLastEditedTimestamp.type),
    debounceTime(2000),
    map(() => safeActions.saveCv(false))
  ),

  // Send the cvContent to the server.
  (action$, state$) => action$.pipe(
    ofType(safeActions.saveCv.type),
    map((action) => action.payload),
    filter((saveEnforced) => saveEnforced || state$.value.safe.lastEditedTimestamp > state$.value.safe.lastSavedTimestamp),
    switchMap(() => {
      const saveTimestamp = new Date();
      return safeServices.saveToRemote(state$.value.safe.cvContent, eventBusClient.sendEvent)
        .then(() => safeActions.setLastSavedTimestamp(saveTimestamp));
    })
  ),

  // Send the modified adminContent data to the server.
  (action$) => action$.pipe(
    ofType(safeActions.replaceAdminContentInstance.type),
    map((action) => action.payload.instance),
    tap((account) => console.log("account", account)),
    map((account) => safeServices.saveToRemote({ "account": { [account._id]: account } }, eventBusClient.sendEvent)),
    ignoreElements()
  ),
];