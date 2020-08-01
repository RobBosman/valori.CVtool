import { ofType } from "redux-observable";
import { map, mergeMap, ignoreElements } from "rxjs/operators";
import { eventBusClient, EventBusConnectionStates } from "./eventBus-services";
import { EMPTY } from "rxjs";
import { setEventBusConnectionState, requestEventBusConnection, addEventBusHeaders,deleteEventBusHeaders } from "./eventBus-actions";

export const eventBusEpics = [
  // Copy the EventBus connection state to Redux.
  () => eventBusClient.monitorConnectionState().pipe(
    map((connectionState) => setEventBusConnectionState(connectionState))
  ),

  // Connect or disconnect the EventBus when requested.
  (action$) => action$.pipe(
    ofType(requestEventBusConnection.type),
    map((action) => action.payload),
    mergeMap((shouldConnect) => {
      const connectionState = eventBusClient.getConnectionState();
      if (shouldConnect 
        && connectionState !== EventBusConnectionStates.CONNECTED
        && connectionState !== EventBusConnectionStates.CONNECTING) {
        eventBusClient.connectEventBus();
      } else if (!shouldConnect
        && connectionState !== EventBusConnectionStates.DISCONNECTED) {
        eventBusClient.disconnectEventBus();
      }
      return EMPTY;
    })
  ),
  
  // Add EventBus headers.
  (action$) => action$.pipe(
    ofType(addEventBusHeaders.type),
    map((action) => action.payload),
    map((headers) => eventBusClient.addDefaultHeaders(headers)),
    ignoreElements()
  ),
  
  // Delete EventBus headers.
  (action$) => action$.pipe(
    ofType(deleteEventBusHeaders.type),
    map((action) => action.payload),
    map((headers) => eventBusClient.deleteDefaultHeaders(headers)),
    ignoreElements()
  )
];