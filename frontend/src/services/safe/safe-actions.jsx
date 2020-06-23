import { createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../redux/reducerRegistry";
import { epicRegistry } from "../../redux/epicRegistry";
import { ofType } from "redux-observable";
import { flatMap } from "rxjs/operators";
import { fetchCvFromRemote, saveAllToRemote } from "./safe-services";
import { eventBusClient } from "../eventBus/eventBus-services";

export const fetchAll = createAction("SAFE_FETCH_ALL", () => ({ payload: null }));
export const saveAll = createAction("SAFE_SAVE_ALL", () => ({ payload: null }));
export const replaceSafeContent = createAction("SAFE_REPLACE_CONTENT");
export const replaceSafeInstance = createAction("SAFE_REPLACE_INSTANCE",
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
    }));

epicRegistry.register(

  (actions$, state$) => actions$.pipe(
    ofType(fetchAll.type),
    flatMap(() => fetchCvFromRemote(state$.value, eventBusClient.sendEvent))
  ),

  (actions$, state$) => actions$.pipe(
    ofType(saveAll.type),
    flatMap(() => saveAllToRemote(state$.value, eventBusClient.sendEvent))
  )
);