import { createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../redux/reducerRegistry";
import { epicRegistry } from "../../redux/epicRegistry";
import { ofType } from "redux-observable";
import { flatMap, map, switchMap } from "rxjs/operators";
import { fetchCvFromRemote, saveAllToRemote } from "./safe-services";
import { eventBusClient } from "../eventBus/eventBus-services";
import { of } from "rxjs";
import { setSelectedId } from "../ui/ui-actions";

export const fetchCvByAccountId = createAction("FETCH_CV_BY_ACCOUNT_ID");
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

const getCvId = (safeContent, state) =>
  Object.values(safeContent.cv).find((instance) => instance.accountId === state.authentication?.accountInfo?._id)?._id;

epicRegistry.register(

  (action$, state$) => action$.pipe(
    ofType(fetchCvByAccountId.type),
    map((action) => action.payload),
    switchMap((accountId) => fetchCvFromRemote(accountId, eventBusClient.sendEvent)),
    flatMap((safeContent) => of(
      replaceSafeContent(safeContent),
      setSelectedId("cv", getCvId(safeContent, state$.value))
    ))
  ),

  (action$, state$) => action$.pipe(
    ofType(saveAll.type),
    flatMap(() => saveAllToRemote(state$.value, eventBusClient.sendEvent))
  )
);