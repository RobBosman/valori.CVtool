import { ofType } from "redux-observable";
import { of } from "rxjs";
import { map, switchMap, debounceTime, filter, mergeMap, distinctUntilChanged } from "rxjs/operators";
import * as eventBusServices from "../eventBus/eventBus-services";
import * as safeActions from "./safe-actions";
import * as safeServices from "./safe-services";
import * as uiActions from "../ui/ui-actions";

export const safeEpics = [

  // Fetch all accounts from the server.
  (action$) => action$.pipe(
    ofType(safeActions.fetchAccountsAndBusinessUnits.type),
    switchMap(() => safeServices.fetchFromRemote({ "account": [{}], "businessUnit": [{}], "role": [{}] }, eventBusServices.eventBusClient.sendEvent)),
    map(fetchedData => safeActions.resetEntities(fetchedData))
  ),

  // Fetch cv data from the server.
  (action$) => action$.pipe(
    ofType(safeActions.fetchCvByAccountId.type),
    map(action => action.payload),
    switchMap(accountId => safeServices.fetchCvFromRemote(accountId, eventBusServices.eventBusClient.sendEvent)),
    mergeMap(fetchedCv => of(
      safeActions.resetEntities(fetchedCv),
      uiActions.setSelectedId("cv", Object.keys(fetchedCv.cv)[0])
    ))
  ),

  // Auto-save 2 seconds after the last edit.
  (_, state$) => state$.pipe(
    map(state => state.safe?.lastEditedTimestamp),
    filter(timestamp => timestamp),
    distinctUntilChanged(),
    debounceTime(2000),
    map(() => safeActions.save(false))
  ),

  // Auto-save when the eventBus reconnects.
  (_, state$) => state$.pipe(
    map(state => state?.eventBus?.connectionState),
    distinctUntilChanged(),
    filter(connectionState => connectionState === eventBusServices.ConnectionStates.CONNECTED),
    map(() => safeActions.save(false))
  ),

  // Send the content to the server.
  (action$, state$) => action$.pipe(
    ofType(safeActions.save.type),
    map(action => action.payload),
    filter(saveEnforced => saveEnforced || state$.value.eventBus.connectionState === eventBusServices.ConnectionStates.CONNECTED),
    filter(saveEnforced => saveEnforced || !state$.value.safe.lastSavedTimestamp || state$.value.safe.lastEditedTimestamp > state$.value.safe.lastSavedTimestamp),
    switchMap(() => {
      const saveTimestamp = new Date();
      return safeServices.saveToRemote(extractChangedData(state$.value.safe), eventBusServices.eventBusClient.sendEvent)
        .then(() => safeActions.setLastSavedTimestamp(saveTimestamp));
    })
  )
];

const extractChangedData = (safe) => {
  const content = {};
  Object.entries(safe.dirty)
    .forEach(([dirtyEntityName, dirtyInstanceIds]) => {
      if (!content[dirtyEntityName]) {
        content[dirtyEntityName] = {};
      }
      Object.keys(dirtyInstanceIds)
        .forEach(instanceId => {
          if (!safe.content[dirtyEntityName] || !safe.content[dirtyEntityName][instanceId]) {
            content[dirtyEntityName][instanceId] = {};
          } else {
            content[dirtyEntityName][instanceId] = safe.content[dirtyEntityName][instanceId];
          }
        });
    });
  return content;
};