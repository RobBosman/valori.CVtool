import { ofType } from "redux-observable";
import { map, switchMap, distinctUntilChanged, debounceTime, filter } from "rxjs/operators";
import { eventBusClient } from "../eventBus/eventBus-services";
import { setAccountInfo } from "../authentication/authentication-actions";
import { setSelectedId } from "../ui/ui-actions";
import * as safeActions from "./safe-actions";
import * as safeServices from "./safe-services";

const getCvId = (cvEntity, accountInfoId) =>
  cvEntity && accountInfoId && Object.values(cvEntity).find((cvInstance) => cvInstance.accountId === accountInfoId)?._id;

export const safeEpics = [

  // Fetch accountInfo from the server.
  (action$) => action$.pipe(
    ofType(safeActions.fetchCvByAccountId.type),
    map((action) => action.payload),
    switchMap((accountId) => safeServices.fetchCvFromRemote(accountId, eventBusClient.sendEvent)),
    map((safeContent) => safeActions.replaceContent(safeContent))
  ),

  // Select or reset the current cv.
  (action$, state$) => action$.pipe(
    ofType(setAccountInfo.type, safeActions.replaceContent.type, safeActions.replaceInstance.type, safeActions.replaceInstances.type),
    map(() => getCvId(state$.value.safe?.content?.cv, state$.value.authentication?.accountInfo?._id)),
    distinctUntilChanged(),
    map((cvId) => setSelectedId("cv", cvId))
  ),

  // Register last edited timestamp.
  (action$) => action$.pipe(
    ofType(safeActions.replaceInstance.type, safeActions.replaceInstances.type),
    map(() => safeActions.setLastEditedTimestamp(new Date()))
  ),

  (action$) => action$.pipe(
    ofType(safeActions.replaceContent.type),
    map(() => safeActions.setLastSavedTimestamp(new Date()))
  ),

  // Auto-save 2 seconds after the last edit.
  (action$, state$) => action$.pipe(
    ofType(safeActions.setLastEditedTimestamp.type),
    map((action) => action.payload),
    debounceTime(2000),
    filter((lastEditedTimestamp) => lastEditedTimestamp > state$.value.safe.lastSavedTimestamp),
    map(() => safeActions.saveContent())
  ),

  // Send the content of the safe to the server.
  (action$, state$) => action$.pipe(
    ofType(safeActions.saveContent.type),
    switchMap(() => {
      const saveTimestamp = new Date();
      return safeServices.saveToRemote(state$.value.safe.content, eventBusClient.sendEvent)
        .then(() => safeActions.setLastSavedTimestamp(saveTimestamp));
    })
  )
];