import { ofType } from "redux-observable";
import { map, switchMap, distinctUntilChanged } from "rxjs/operators";
import { fetchCvFromRemote } from "./safe-services";
import { eventBusClient } from "../eventBus/eventBus-services";
import { setAccountInfo } from "../authentication/authentication-actions";
import { setSelectedId } from "../ui/ui-actions";
import * as safeActions from "./safe-actions";

const getCvId = (cvEntity, accountInfoId) =>
  cvEntity && accountInfoId && Object.values(cvEntity).find((cvInstance) => cvInstance.accountId === accountInfoId)?._id;

export const safeEpics = [

  // Fetch accountInfo from the server.
  (action$) => action$.pipe(
    ofType(safeActions.fetchCvByAccountId.type),
    map((action) => action.payload),
    switchMap((accountId) => fetchCvFromRemote(accountId, eventBusClient.sendEvent)),
    map((safeContent) => safeActions.replaceSafeContent(safeContent))
  ),

  // Select or reset the current cv.
  (action$, state$) => action$.pipe(
    ofType(setAccountInfo.type, safeActions.replaceSafeContent.type, safeActions.replaceSafeInstance.type),
    map(() => getCvId(state$.value.safe?.cv, state$.value.authentication?.accountInfo?._id)),
    distinctUntilChanged(),
    map((cvId) => setSelectedId("cv", cvId))
  )
];