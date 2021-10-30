import { ofType } from "redux-observable";
import { EMPTY } from "rxjs";
import * as rx from "rxjs/operators";
import { setAuthenticationResult } from "../auth/auth-actions";
import * as errorActions from "../error/error-actions";
import * as eventBusActions from "./eventBus-actions";
import { eventBusClient, ConnectionStates } from "./eventBus-services";

export const eventBusEpics = [
  // Copy the EventBus connection state to Redux.
  () => eventBusClient.monitorConnectionState().pipe(
    rx.map(connectionState => eventBusActions.setEventBusConnectionState(connectionState))
  ),
  
  // Keep an eye on errors occurring in the EventBus.
  () => eventBusClient.monitorErrorMessages().pipe(
    rx.filter(errorMessage => errorMessage !== ""),
    rx.map(errorMessage => errorActions.setLastError(errorMessage, errorActions.ErrorSources.REDUX_MIDDLEWARE))
  ),

  // Connect or disconnect the EventBus when requested.
  (action$) => action$.pipe(
    ofType(eventBusActions.requestEventBusConnection.type),
    rx.map(action => action.payload),
    rx.mergeMap(shouldConnect => {
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
    rx.map(action => action.payload?.idToken),
    rx.map(jwt =>
      jwt
        ? eventBusClient.addDefaultHeaders({ Authorization: `Bearer ${jwt}` })
        : eventBusClient.deleteDefaultHeaders({ Authorization: "" })
    ),
    rx.ignoreElements()
  )
];