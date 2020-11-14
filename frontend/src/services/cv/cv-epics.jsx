import { ofType } from "redux-observable";
import { map, switchMap, ignoreElements, tap } from "rxjs/operators";
import { eventBusClient } from "../eventBus/eventBus-services";
import * as cvActions from "./cv-actions";
import * as cvServices from "./cv-services";

export const cvEpics = [

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
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};