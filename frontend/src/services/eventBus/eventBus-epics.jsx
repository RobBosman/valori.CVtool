import { ofType } from "redux-observable";
import { map, mergeMap, ignoreElements } from "rxjs/operators";
import { eventBusClient, EventBusConnectionStates } from "./eventBus-services";
import { EMPTY } from "rxjs";
import { setEventBusConnectionState, requestEventBusConnection } from "./eventBus-actions";
import { setAuthenticationInfo } from "../authentication/authentication-actions";

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
  
  // Add or delete EventBus headers.
  (action$) => action$.pipe(
    ofType(setAuthenticationInfo.type),
    map((action) => action.payload?.idToken),
    map((jwt) =>
      jwt
        ? eventBusClient.addDefaultHeaders({ Authorization: `Bearer ${jwt}` })
        : eventBusClient.deleteDefaultHeaders({ Authorization: "" })
    ),
    ignoreElements()
  )
];