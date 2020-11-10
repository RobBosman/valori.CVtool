import { ofType } from "redux-observable";
import { map, distinctUntilChanged, switchMap, ignoreElements, tap } from "rxjs/operators";
import { eventBusClient } from "../eventBus/eventBus-services";
import * as safeActions from "../safe/safe-actions";
import { setSelectedId } from "../ui/ui-actions";
import * as cvActions from "./cv-actions";
import * as cvServices from "./cv-services";

const getFirstCvId = (cvEntity) =>
  cvEntity && Object.keys(cvEntity)[0];

export const cvEpics = [

  // Select or reset the first available cv.
  (action$, state$) => action$.pipe(
    ofType(safeActions.replaceCvContent.type),
    map(() => getFirstCvId(state$.value.safe?.cvContent?.cv)),
    distinctUntilChanged(),
    map((cvId) => setSelectedId("cv", cvId))
  ),

  // Generate cv at the server.
  (action$) => action$.pipe(
    ofType(cvActions.generateCv.type),
    map((action) => action.payload),
    switchMap((accountId) => cvServices.generateCvAtRemote(accountId, eventBusClient.sendEvent)),
    tap((generatedCv) => downloadFile(generatedCv.fileName, generatedCv.contentB64)),
    ignoreElements()
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
  console.log("url", url);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};