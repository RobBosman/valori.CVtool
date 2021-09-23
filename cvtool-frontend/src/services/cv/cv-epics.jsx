import { ofType } from "redux-observable";
import { from, merge, of } from "rxjs";
import { map, switchMap, ignoreElements, tap, mergeMap, filter, take, debounceTime, takeUntil } from "rxjs/operators";
import { eventBusClient } from "../eventBus/eventBus-services";
import * as safeActions from "../safe/safe-actions";
import * as uiActions from "../ui/ui-actions";
import * as cvActions from "./cv-actions";
import * as cvServices from "./cv-services";

export const cvEpics = [

  // Generate cv at the backend server.
  (action$, state$) => action$.pipe(
    ofType(cvActions.generateCv.type),
    map(action => action.payload),
    switchMap(payload =>
      // When requested to download a cv then first save any changes...
      merge(
        of(safeActions.save(false)),
        state$.pipe(
          // ...and wait for the data to be saved.
          filter(state => !state.safe?.lastEditedTimestamp || state.safe.lastSavedTimestamp >= state.safe.lastEditedTimestamp),
          take(1),
          mergeMap(() => cvServices.generateCvAtRemote(payload.accountId, payload.locale, eventBusClient.sendEvent)),
          tap(generatedCv => cvServices.downloadDocxFile(generatedCv.fileName, generatedCv.docxB64)),
          ignoreElements()
        )
      )
    )
  ),

  // Search cv data at the backend server.
  (action$) => action$.pipe(
    ofType(cvActions.searchCvData.type),
    debounceTime(500),
    map(action => action.payload),
    switchMap(searchText =>
      from(cvServices.searchCvData(searchText, eventBusClient.sendEvent)).pipe(
        takeUntil(action$.pipe(
          ofType(cvActions.searchCvData.type)
        ))
      )
    ),
    map(fetchedCvData => cvActions.setSearchResult(fetchedCvData))
  ),

  // Fetch cv data from the backend server.
  (action$) => action$.pipe(
    ofType(cvActions.fetchCvByAccountId.type),
    map(action => action.payload),
    switchMap(accountId => cvServices.fetchCvFromRemote(accountId, eventBusClient.sendEvent)),
    mergeMap(fetchedCv => of(
      safeActions.resetEntities(fetchedCv),
      uiActions.setSelectedId("cv", Object.keys(fetchedCv.cv)[0])
    ))
  ),

  // Fetch cv history from the backend server.
  (action$) => action$.pipe(
    ofType(cvActions.fetchCvHistory.type),
    map(action => action.payload),
    switchMap(accountId => cvServices.fetchCvHistoryFromRemote(accountId, eventBusClient.sendEvent)),
    map(fetchedCvHistory => safeActions.resetEntities(fetchedCvHistory))
  )
];