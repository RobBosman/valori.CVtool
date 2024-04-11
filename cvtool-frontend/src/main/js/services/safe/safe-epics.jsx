import { of } from "rxjs";
import { ofType } from "redux-observable";
import * as rx from "rxjs/operators";
import * as utils from "../../utils/CommonUtils";
import * as eventBusServices from "../eventBus/eventBus-services";
import * as safeActions from "./safe-actions";
import * as safeServices from "./safe-services";

export const safeEpics = [

  // Fetch all instances of the requested entity from the backend server.
  (action$) => action$.pipe(
    ofType(safeActions.fetchAllInstances.type),
    rx.map(action => action.payload),
    rx.mergeMap(entityName => safeServices.fetchFromRemote({ [entityName]: [{}] }, eventBusServices.eventBusClient.sendEvent)),
    rx.map(fetchedData => safeActions.resetEntities(fetchedData))
  ),

  // Auto-save 2 seconds after the last edit.
  (_, state$) => state$.pipe(
    rx.map(state => state.safe?.lastEditedTimeString),
    rx.filter(timeString => timeString),
    rx.distinctUntilChanged(),
    rx.debounceTime(2000),
    rx.map(() => safeActions.save(false))
  ),

  // Auto-save when the eventBus reconnects.
  (_, state$) => state$.pipe(
    rx.map(state => state?.eventBus?.connectionState),
    rx.distinctUntilChanged(),
    rx.filter(connectionState => connectionState === eventBusServices.ConnectionStates.CONNECTED),
    rx.skip(1), // Ignore the first time, when starting the app.
    rx.map(() => safeActions.save(false))
  ),

  // Send the content to the backend server.
  (action$, state$) => action$.pipe(
    ofType(safeActions.save.type),
    rx.map(action => action.payload),
    rx.filter(saveEnforced => saveEnforced || state$.value.eventBus.connectionState === eventBusServices.ConnectionStates.CONNECTED),
    rx.filter(saveEnforced => saveEnforced || !state$.value.safe.lastSavedTimeString
      || utils.parseTimeString(state$.value.safe.lastEditedTimeString) > utils.parseTimeString(state$.value.safe.lastSavedTimeString)),
    rx.switchMap(() => {
      const saveTimeString = new Date().toISOString();
      return safeServices
        .saveToRemote(extractChangedData(state$.value.safe), eventBusServices.eventBusClient.sendEvent)
        .then(() => safeActions.setLastSavedTimeString(saveTimeString));
    })
  ),

  // Delete the account from the backend server.
  (action$, state$) => action$.pipe(
    ofType(safeActions.deleteAccount.type),
    rx.map(action => action.payload),
    rx.mergeMap(accountId =>
      safeServices.deleteAccountFromRemote(accountId, eventBusServices.eventBusClient.sendEvent)
        .then(() => accountId)
    ),
    rx.map(accountId => {
      const businessUnitInstancess = {};
      Object.values(state$.value.safe.content.businessUnit || {})
        .filter(businessUnit => businessUnit.accountIds?.includes(accountId))
        .forEach(businessUnit => {
          businessUnitInstancess[businessUnit._id] = {
            ...businessUnit,
            accountIds: businessUnit.accountIds.filter(id => id !== accountId)
          };
        });
      return safeActions.resetEntities({
        account: {
          [accountId]: undefined
        },
        businessUnit: businessUnitInstancess
      });
    })
  ),

  // Add the uploaded/fetched profile photo to the account.
  (action$, state$) => action$.pipe(
    ofType(safeActions.setProfilePhoto.type),
    rx.map(action => action.payload),
    rx.switchMap(({profilePhotoB64, accountInstanceId}) => {
      const accountInstance = state$.value.safe.content.account[accountInstanceId];
      const instanceToBeSaved = {
        ...accountInstance,
        photo: profilePhotoB64,
        includePhotoInCv: true
      };
      return of(safeActions.changeInstance("account", accountInstanceId, instanceToBeSaved));
    }),
  ),

  // Set 'includePhotoInCv' to true if a profile photo is uploaded/fetched.
  (action$, state$) => action$.pipe(
    ofType(safeActions.setProfilePhoto.type),
    rx.map(action => action.payload.accountInstanceId),
    rx.switchMap(accountInstanceId => {
      const characteristicsInstance = Object.values(state$.value.safe.content.characteristics)
        .find(instance => instance.accountId == accountInstanceId);
      const instanceToBeSaved = {
        ...characteristicsInstance,
        includePhotoInCv: true
      };
      return of(safeActions.changeInstance("characteristics", characteristicsInstance._id, instanceToBeSaved));
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
          if (safe.content[dirtyEntityName]?.[instanceId]) {
            content[dirtyEntityName][instanceId] = safe.content[dirtyEntityName][instanceId];
          } else {
            content[dirtyEntityName][instanceId] = {};
          }
        });
    });
  return content;
};