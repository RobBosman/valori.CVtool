import { ofType } from "redux-observable";
import { map, distinctUntilChanged, switchMap, ignoreElements, tap } from "rxjs/operators";
import { eventBusClient } from "../eventBus/eventBus-services";
import * as safeActions from "../safe/safe-actions";
import { setAccountInfo } from "../authentication/authentication-actions";
import { setSelectedId } from "../ui/ui-actions";
import * as cvActions from "./cv-actions";
import * as cvServices from "./cv-services";

const getCvId = (cvEntity, accountInfoId) =>
  cvEntity && accountInfoId && Object.values(cvEntity).find((cvInstance) => cvInstance.accountId === accountInfoId)?._id;

export const cvEpics = [

  // Select or reset the current cv.
  (action$, state$) => action$.pipe(
    ofType(setAccountInfo.type, safeActions.replaceContent.type, safeActions.replaceInstance.type, safeActions.replaceInstances.type),
    map(() => getCvId(state$.value.safe?.content?.cv, state$.value.authentication?.accountInfo?._id)),
    distinctUntilChanged(),
    map((cvId) => setSelectedId("cv", cvId))
  ),

  // Generate cv at the server.
  (action$) => action$.pipe(
    ofType(cvActions.generateCv.type),
    map((action) => action.payload),
    switchMap((accountId) => cvServices.generateCvAtRemote(accountId, eventBusClient.sendEvent)),
    tap((generatedCv) => console.log("generatedCv", generatedCv)),
    ignoreElements()
  )
];