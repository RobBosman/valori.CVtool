import { createAction, createReducer } from "@reduxjs/toolkit";
import { ofType } from "redux-observable";
import { map, flatMap, tap, ignoreElements, filter, distinctUntilKeyChanged } from "rxjs/operators";
import { reducerRegistry } from "../../redux/reducerRegistry";
import { epicRegistry } from "../../redux/epicRegistry";
import { eventBusClient, EventBusConnectionStates } from "./eventBus-services";

export const requestToConnectEventBus = createAction("REQUEST_TO_CONNECT_EVENT_BUS", () => ({}));
export const requestToDisconnectEventBus = createAction("REQUEST_TO_DISCONNECT_EVENT_BUS", () => ({}));
export const setEventBusConnectionState = createAction("SET_EVENT_BUS_CONNECTION_STATE");

reducerRegistry.register(
  "eventBus",
  createReducer(
    {
      connectionState: EventBusConnectionStates.DISCONNECTED
    },
    {
      [setEventBusConnectionState]: (state, action) => {
        state.connectionState = action.payload;
      },
      [setEventBusConnectionState]: (state, action) => {
        state.connectionState = action.payload;
      }
    }
  )
);

epicRegistry.register(

  // When requested to connect the EventBus, monitor its connection state.
  (action$, state$) => action$.pipe(
    ofType(requestToConnectEventBus.type),
    filter(() => state$.value.eventBus.connectionState === EventBusConnectionStates.DISCONNECTED),
    flatMap(() => eventBusClient.connectAndMonitorEventBus()),
    map((connectionState) => setEventBusConnectionState(connectionState))
  ),

  // When requested to disconnect the EventBus, terminate its connection.
  (action$, state$) => action$.pipe(
    ofType(requestToDisconnectEventBus.type),
    filter(() => state$.value.eventBus.connectionState !== EventBusConnectionStates.DISCONNECTED),
    tap(() => eventBusClient.disconnectEventBus()),
    ignoreElements()
  ),

  // When the EventBus connection state changes to CONNECTED, re-register all eventHandlers.
  (action$) => action$.pipe(
    ofType(setEventBusConnectionState.type),
    distinctUntilKeyChanged("payload"),
    filter((action) => action.payload === EventBusConnectionStates.CONNECTED),
    tap(() => eventBusClient.refreshHandlerRegistrations()),
    ignoreElements()
  )
);