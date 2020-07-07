import { createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../redux/reducerRegistry";
import { epicRegistry } from "../../redux/epicRegistry";
import { ofType } from "redux-observable";
import { flatMap, map, switchMap, distinctUntilChanged, filter } from "rxjs/operators";
import { fetchCvFromRemote, saveAllToRemote } from "./safe-services";
import { eventBusClient, EventBusConnectionStates } from "../eventBus/eventBus-services";
import { of, merge } from "rxjs";
import { setSelectedId } from "../ui/ui-actions";
import { setAccountInfo } from "../authentication/authentication-actions";
import { requestToConnectEventBus } from "../eventBus/eventBus-actions";
import { fetchAccountInfoFromRemote } from "../authentication/authentication-services";

export const fetchAccountInfo = createAction("FETCH_ACCOUNT_INFO");
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

epicRegistry.register(

  (action$, state$) => action$.pipe(
    ofType(fetchAccountInfo.type),
    map((action) => action.payload),
    flatMap((authenticationCode) => merge(
      of(requestToConnectEventBus()),
      // When the EventBus is connected then fetch the accountInfo from remote.
      state$.pipe(
        map((state) => state.eventBus?.connectionState),
        distinctUntilChanged(),
        filter((connectionState) => connectionState === EventBusConnectionStates.CONNECTED),
        flatMap(() => fetchAccountInfoFromRemote(authenticationCode, eventBusClient.sendEvent)),
        map((accountInfo) => setAccountInfo(accountInfo))
      )
    ))
  ),

  (action$, state$) => action$.pipe(
    ofType(fetchCvByAccountId.type),
    map((action) => action.payload),
    switchMap((accountId) => fetchCvFromRemote(accountId, eventBusClient.sendEvent)),
    flatMap((safeContent) => of(
      replaceSafeContent(safeContent),
      setSelectedId("cv", Object.values(safeContent.cv).find((instance) => instance.accountId === state$.value.authentication?.accountInfo?._id)?._id)
    ))
  ),

  (action$, state$) => action$.pipe(
    ofType(saveAll.type),
    flatMap(() => saveAllToRemote(state$.value, eventBusClient.sendEvent))
  )
);