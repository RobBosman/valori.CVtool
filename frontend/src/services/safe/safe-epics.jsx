import { ofType } from "redux-observable";
import { map, switchMap, distinctUntilChanged } from "rxjs/operators";
import { fetchCvFromRemote, saveAllToRemote } from "./safe-services";
import { eventBusClient } from "../eventBus/eventBus-services";
import { setSelectedId } from "../ui/ui-actions";
import { fetchCvByAccountId, replaceSafeContent, saveAll } from "./safe-actions";

const getCvId = (cvEntity, accountInfoId) =>
  cvEntity && Object.values(cvEntity).find((cvInstance) => cvInstance.accountId === accountInfoId)?._id;

export const safeEpics = [
  // Fetch accountInfo from the server.
  (action$) => action$.pipe(
    ofType(fetchCvByAccountId.type),
    map((action) => action.payload),
    switchMap((accountId) => fetchCvFromRemote(accountId, eventBusClient.sendEvent)),
    map((safeContent) => replaceSafeContent(safeContent))
  ),

  // Select or reset the current cv.
  (_action$, state$) => state$.pipe(
    map((state) => ({
      accountInfoId: state.authentication?.accountInfo?._id,
      cvEntity: state.safe?.cv
    })),
    distinctUntilChanged(),
    map((subState) => setSelectedId("cv", getCvId(subState.cvEntity, subState.accountInfoId)))
  ),

  // Send the content of the safe to the server.
  (action$, state$) => action$.pipe(
    ofType(saveAll.type),
    switchMap(() => saveAllToRemote(state$.value, eventBusClient.sendEvent))
  )
];