import { ofType } from "redux-observable";
import { EMPTY } from "rxjs";
import { map, mergeMap, ignoreElements, filter } from "rxjs/operators";
import { setAuthenticationResult } from "../auth/auth-actions";
import * as errorActions from "../error/error-actions";
import * as eventBusActions from "./eventBus-actions";
import { eventBusClient, ConnectionStates } from "./eventBus-services";

export const eventBusEpics = [
  // Copy the EventBus connection state to Redux.
  () => eventBusClient.monitorConnectionState().pipe(
    map(connectionState => eventBusActions.setEventBusConnectionState(connectionState))
  ),
  
  // Keep an eye on errors occurring in the EventBus.
  () => eventBusClient.monitorErrorMessages().pipe(
    filter(errorMessage => errorMessage !== ""),
    map(errorMessage => errorActions.setLastError(errorMessage, errorActions.ErrorSources.REDUX_MIDDLEWARE))
  ),

  // Connect or disconnect the EventBus when requested.
  (action$) => action$.pipe(
    ofType(eventBusActions.requestEventBusConnection.type),
    map(action => action.payload),
    mergeMap(shouldConnect => {
      const connectionState = eventBusClient.getConnectionState();
      if (shouldConnect 
        && connectionState !== ConnectionStates.CONNECTED
        && connectionState !== ConnectionStates.CONNECTING) {
        eventBusClient.connectEventBus();
      } else if (!shouldConnect
        && connectionState !== ConnectionStates.DISCONNECTED) {
        eventBusClient.disconnectEventBus();
      }
      return EMPTY;
    })
  ),
  
  // Add or delete EventBus headers.
  (action$) => action$.pipe(
    ofType(setAuthenticationResult.type),
    map(action => action.payload?.idToken),
    map(jwt =>
      jwt
        ? eventBusClient.addDefaultHeaders({ Authorization: `Bearer ${jwt}` })
        : eventBusClient.deleteDefaultHeaders({ Authorization: "" })
    ),
    ignoreElements()
  )
];