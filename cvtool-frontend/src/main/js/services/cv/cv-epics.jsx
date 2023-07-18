import { ofType } from "redux-observable";
import { from, merge, of } from "rxjs";
import * as rx from "rxjs/operators";
import { eventBusClient } from "../eventBus/eventBus-services";
import * as safeActions from "../safe/safe-actions";
import * as cvActions from "./cv-actions";
import * as cvServices from "./cv-services";

export const cvEpics = [

  // Generate cv at the backend server.
  (action$, state$) => action$.pipe(
    ofType(cvActions.generateCv.type),
    rx.map(action => action.payload),
    rx.switchMap(payload =>
      // When requested to download a cv then first save any changes...
      merge(
        of(safeActions.save(false)),
        state$.pipe(
          // ...and wait for the data to be saved.
          rx.filter(state => !state.safe?.lastEditedTimestamp || state.safe.lastSavedTimestamp >= state.safe.lastEditedTimestamp),
          rx.take(1),
          rx.mergeMap(() => cvServices.generateCvAtRemote(payload.accountId, payload.locale, eventBusClient.sendEvent)),
          rx.filter(Boolean),
          rx.tap(generatedCv => cvServices.downloadDocxFile(generatedCv.fileName, generatedCv.docxB64)),
          rx.ignoreElements()
        )
      )
    )
  ),

  // Search cv data at the backend server.
  (action$) => action$.pipe(
    ofType(cvActions.searchCvData.type),
    rx.debounceTime(500),
    rx.map(action => action.payload),
    rx.switchMap(searchText =>
      from(cvServices.searchCvData(searchText, eventBusClient.sendEvent)).pipe(
        rx.takeUntil(action$.pipe(
          ofType(cvActions.searchCvData.type)
        ))
      )
    ),
    rx.map(fetchedCvData => cvActions.setSearchResult(fetchedCvData))
  ),

  // Fetch cv data from the backend server.
  (action$) => action$.pipe(
    ofType(cvActions.fetchCvByAccountId.type),
    rx.map(action => action.payload),
    rx.mergeMap(accountId => cvServices.fetchCvFromRemote(accountId, eventBusClient.sendEvent)),
    rx.map(fetchedCv => safeActions.resetEntities(fetchedCv))
  ),

  // Fetch cv history from the backend server.
  (action$) => action$.pipe(
    ofType(cvActions.fetchCvHistory.type),
    rx.map(action => action.payload),
    rx.mergeMap(accountId => cvServices.fetchCvHistoryFromRemote(accountId, eventBusClient.sendEvent)),
    rx.map(fetchedCvHistory => safeActions.resetEntities(fetchedCvHistory))
  ),

  // Fetch a demo-cv from the backend server.
  (action$) => action$.pipe(
    ofType(cvActions.fetchDemoCv.type),
    rx.map(action => action.payload),
    rx.mergeMap(payload => cvServices.fetchDemoCvAtRemote(payload.accountId, payload.locale, eventBusClient.sendEvent)),
    rx.filter(Boolean),
    rx.tap(demoCv => cvServices.downloadDocxFile(demoCv.fileName, demoCv.docxB64)),
    rx.ignoreElements()
  )
];