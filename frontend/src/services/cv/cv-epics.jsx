import { ofType } from "redux-observable";
import { merge, of } from "rxjs";
import { map, switchMap, ignoreElements, tap, mergeMap, filter, take } from "rxjs/operators";
import { eventBusClient } from "../eventBus/eventBus-services";
import * as safeActions from "../safe/safe-actions";
import * as safeServices from "../safe/safe-services";
import * as cvActions from "./cv-actions";
import * as uiActions from "../ui/ui-actions";
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
          tap(generatedCv => downloadFile(generatedCv.fileName, generatedCv.contentB64)),
          ignoreElements()
        )
      )
    )
  ),

  // Fetch cv data from the backend server.
  (action$) => action$.pipe(
    ofType(cvActions.fetchCvByAccountId.type),
    map(action => action.payload),
    switchMap(accountId => safeServices.fetchCvFromRemote(accountId, eventBusClient.sendEvent)),
    mergeMap(fetchedCv => of(
      safeActions.resetEntities(fetchedCv),
      uiActions.setSelectedId("cv", Object.keys(fetchedCv.cv)[0])
    ))
  )
];

const downloadFile = (fileName, contentB64) => {
  const a = document.createElement("a");
  a.style = "display: none";
  document.body.appendChild(a);
  
  // Convert the Base64 data into a byte array.
  const contentBytes = atob(contentB64);
  var uintArray = new Uint8Array(new ArrayBuffer(contentBytes.length));
  for (var i = 0; i < contentBytes.length; i++) {
    uintArray[i] = contentBytes.charCodeAt(i);
  }

  const blob = new Blob([uintArray], {type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};