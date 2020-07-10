import { createAction, createReducer } from "@reduxjs/toolkit";
import { ofType } from "redux-observable";
import { map, mergeMap } from "rxjs/operators";
import { reducerRegistry } from "../../redux/reducerRegistry";
import { epicRegistry } from "../../redux/epicRegistry";
import { eventBusClient, EventBusConnectionStates } from "./eventBus-services";
import { EMPTY } from "rxjs";

export const requestEventBusConnection = createAction("REQUEST_EVENT_BUS_CONNECTION");
export const setEventBusConnectionState = createAction("SET_EVENT_BUS_CONNECTION_STATE");

reducerRegistry.register(
  "eventBus",
  createReducer(
    {},
    {
      [setEventBusConnectionState]: (state, action) => {
        state.connectionState = action.payload;
      }
    }
  )
);

epicRegistry.register(

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
  )
);