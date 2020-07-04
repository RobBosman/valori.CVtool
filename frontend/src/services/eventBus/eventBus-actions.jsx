import { createAction, createReducer } from "@reduxjs/toolkit";
import { ofType } from "redux-observable";
import { map, distinctUntilChanged, flatMap, tap, ignoreElements, filter } from "rxjs/operators";
import { reducerRegistry } from "../../redux/reducerRegistry";
import { epicRegistry } from "../../redux/epicRegistry";
import { eventBusClient, EventBusConnectionStates } from "./eventBus-services";

export const setEventBusConnectionRequest = createAction("SET_EVENT_BUS_CONNECTION_REQUEST");
export const setEventBusConnectionState = createAction("SET_EVENT_BUS_CONNECTION_STATE");

export const EventBusConnectionRequestStates = {
  REQUESTED_TO_CONNECT: "REQUESTED_TO_CONNECT",
  REQUESTED_TO_DISCONNECT: "REQUESTED_TO_DISCONNECT"
};

reducerRegistry.register(
  "eventBus",
  createReducer(
    {
      connectionState: EventBusConnectionStates.DISCONNECTED
    },
    {
      [setEventBusConnectionState]: (state, action) => {
        state.connectionState = action.payload;
      }
    }
  )
);

epicRegistry.register(

  // When requested to connect the EventBus, monitor its connection state.
  (actions$, state$) => actions$.pipe(
    ofType(setEventBusConnectionRequest.type),
    filter((action) => action.payload === EventBusConnectionRequestStates.REQUESTED_TO_CONNECT
        && state$.value.eventBus.connectionState === EventBusConnectionStates.DISCONNECTED),
    flatMap(() => eventBusClient.connectEventBus()),
    map((connectionState) => setEventBusConnectionState(connectionState))
  ),

  // When requested to disconnect the EventBus, terminate its connection.
  (actions$, state$) => actions$.pipe(
    ofType(setEventBusConnectionRequest.type),
    filter((action) => action.payload === EventBusConnectionRequestStates.REQUESTED_TO_DISCONNECT
        && state$.value.eventBus.connectionState !== EventBusConnectionStates.DISCONNECTED),
    tap(() => eventBusClient.disconnectEventBus()),
    ignoreElements()
  ),

  // When the EventBus connection state changes to CONNECTED, re-register all eventHandlers.
  (actions$) => actions$.pipe(
    ofType(setEventBusConnectionState.type),
    distinctUntilChanged(null, (action) => action.payload),
    filter((action) => action.payload === EventBusConnectionStates.CONNECTED),
    tap(() => eventBusClient.refreshHandlerRegistrations()),
    ignoreElements()
  )
);