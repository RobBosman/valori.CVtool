import { createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../redux/reducerRegistry";
import { epicRegistry } from "../../redux/epicRegistry";
import { ofType } from "redux-observable";
import { flatMap, map, filter } from "rxjs/operators";
import { fetchCvFromRemote, saveAllToRemote } from "./safe-services";
import { eventBusClient } from "../eventBus/eventBus-services";

export const fetchAll = createAction("FETCH_ALL", () => ({}));
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

epicRegistry.register(

  (action$, state$) => action$.pipe(
    ofType(fetchAll.type),
    filter(() => state$.value.authentication?.accountInfo),
    flatMap(() => fetchCvFromRemote(state$.value.authentication?.accountInfo, eventBusClient.sendEvent)),
    map((safeContent) => replaceSafeContent(safeContent))
  ),

  (action$, state$) => action$.pipe(
    ofType(saveAll.type),
    flatMap(() => saveAllToRemote(state$.value, eventBusClient.sendEvent))
  )
);