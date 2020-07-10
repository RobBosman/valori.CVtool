import { createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../redux/reducerRegistry";
import { epicRegistry } from "../../redux/epicRegistry";
import { ofType } from "redux-observable";
import { map, switchMap, distinctUntilChanged } from "rxjs/operators";
import { fetchCvFromRemote, saveAllToRemote } from "./safe-services";
import { eventBusClient } from "../eventBus/eventBus-services";
import { setSelectedId } from "../ui/ui-actions";

export const fetchCvByAccountId = createAction("FECTH_CV_BY_ACCOUNT_ID");
export const saveAll = createAction("SAVE_ALL", () => ({}));
export const replaceSafeContent = createAction("REPLACE_SAFE_CONTENT");
export const replaceSafeInstance = createAction("REPLACE_SAFE_INSTANCE",
  (entity, id, instance) => ({ payload: { entity, id, instance } }));

reducerRegistry.register(
  "safe",
  createReducer(
    {},
    {
      [replaceSafeContent]: (_state, action) => action.payload ? action.payload : {},
      [replaceSafeInstance]: (state, action) => {
        if (!state[action.payload.entity]) {
          state[action.payload.entity] = {};
        }
        if (action.payload.instance) {
          state[action.payload.entity][action.payload.id] = action.payload.instance;
        } else {
          delete(state[action.payload.entity][action.payload.id]);
        }
      }
    }
  )
);

const getCvId = (cvEntity, accountInfoId) =>
  cvEntity && Object.values(cvEntity).find((cvInstance) => cvInstance.accountId === accountInfoId)?._id;

epicRegistry.register(

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
);