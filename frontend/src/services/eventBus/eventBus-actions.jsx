import { createAction, createReducer } from "@reduxjs/toolkit";
import { ofType } from "redux-observable";
import { map, ignoreElements, filter, distinctUntilChanged, mergeMap, take } from "rxjs/operators";
import { reducerRegistry } from "../../redux/reducerRegistry";
import { epicRegistry } from "../../redux/epicRegistry";
import { eventBusClient, EventBusConnectionStates } from "./eventBus-services";
import { EMPTY } from "rxjs";

export const requestEventBusConnection = createAction("REQUEST_EVENT_BUS_CONNECTION");
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
      }
    }
  )
);

epicRegistry.register(

  // Monitor the EventBus connection state.
  (_action$, state$) => state$.pipe(
    take(1),
    mergeMap(() => eventBusClient.monitorConnectionState()),
    map((connectionState) => setEventBusConnectionState(connectionState))
  ),

  // When requested to connect the EventBus, monitor its connection state.
  (action$, state$) => action$.pipe(
    ofType(requestEventBusConnection.type),
    mergeMap((action) => {
      const connectionState = state$.value.eventBus.connectionState;
      if (action.payload && connectionState === EventBusConnectionStates.DISCONNECTED) {
        eventBusClient.connectEventBus();
      } else if (!action.payload && connectionState !== EventBusConnectionStates.DISCONNECTED) {
        eventBusClient.disconnectEventBus();
      }
      return EMPTY;
    })
  ),

  // When the EventBus connection state changes to CONNECTED, re-register all eventHandlers.
  (_action$, state$) => state$.pipe(
    map((state) => state.eventBus?.connectionState),
    distinctUntilChanged(),
    filter((connectionState) => connectionState === EventBusConnectionStates.CONNECTED),
    map(() => eventBusClient.refreshHandlerRegistrations()),
    ignoreElements()
  )
);