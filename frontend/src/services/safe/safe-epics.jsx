import { ofType } from "redux-observable";
import { map, switchMap, debounceTime, filter, mergeMap, distinctUntilChanged, skip } from "rxjs/operators";
import * as eventBusServices from "../eventBus/eventBus-services";
import * as safeActions from "./safe-actions";
import * as safeServices from "./safe-services";

export const safeEpics = [

  // Fetch all instances of the requested entity from the server.
  (action$) => action$.pipe(
    ofType(safeActions.fetchAllInstances.type),
    map(action => action.payload),
    mergeMap(entityName => safeServices.fetchFromRemote({ [entityName]: [{}] }, eventBusServices.eventBusClient.sendEvent)),
    map(fetchedData => safeActions.resetEntities(fetchedData))
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
    skip(1), // Ignore the first time, when starting the app.
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