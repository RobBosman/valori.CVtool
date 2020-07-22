import { ofType } from "redux-observable";
import { map, switchMap, distinctUntilChanged } from "rxjs/operators";
import { fetchCvFromRemote, saveAllToRemote } from "./safe-services";
import { eventBusClient } from "../eventBus/eventBus-services";
import { setSelectedId } from "../ui/ui-actions";
import { fetchCvByAccountId, replaceSafeContent, replaceSafeInstance, saveAll } from "./safe-actions";
import { setAccountInfo } from "../authentication/authentication-actions";

const getCvId = (cvEntity, accountInfoId) =>
  cvEntity && accountInfoId && Object.values(cvEntity).find((cvInstance) => cvInstance.accountId === accountInfoId)?._id;

export const safeEpics = [
  // Fetch accountInfo from the server.
  (action$) => action$.pipe(
    ofType(fetchCvByAccountId.type),
    map((action) => action.payload),
    switchMap((accountId) => fetchCvFromRemote(accountId, eventBusClient.sendEvent)),
    map((safeContent) => replaceSafeContent(safeContent))
  ),

  // Select or reset the current cv.
  (action$, state$) => action$.pipe(
    ofType(setAccountInfo.type, replaceSafeContent.type, replaceSafeInstance.type),
    map(() => getCvId(state$.value.safe?.cv, state$.value.authentication?.accountInfo?._id)),
    distinctUntilChanged(),
    map((cvId) => setSelectedId("cv", cvId))
  ),

  // Send the content of the safe to the server.
  (action$, state$) => action$.pipe(
    ofType(saveAll.type),
    switchMap(() => saveAllToRemote(state$.value, eventBusClient.sendEvent))
  )
];