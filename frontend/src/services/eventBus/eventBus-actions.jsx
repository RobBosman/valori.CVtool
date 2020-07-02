import { createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../redux/reducerRegistry";

export const updateEventBusConnectionState = createAction("EVENT_BUS_UPDATE_CONNECTION_STATE");

export const EventBusConnectionStates = {
  DISABLED: "DISABLED",
  CONNECTING: "CONNECTING",
  CONNECTED: "CONNECTED",
  DISCONNECTING: "DISCONNECTING",
  DISCONNECTED: "DISCONNECTED"
};

reducerRegistry.register(
  "eventBus",
  createReducer(
    {
      connectionState: EventBusConnectionStates.DISABLED
    },
    {
      [updateEventBusConnectionState]: (state, action) => {
        const currentState = state.connectionState;
        const newState = action.payload;
        if (currentState === EventBusConnectionStates.CONNECTING
         && newState === EventBusConnectionStates.DISCONNECTED) {
        // this is a failed connection attempt
          return;
        }
        if (currentState === EventBusConnectionStates.DISCONNECTING
         && newState === EventBusConnectionStates.DISCONNECTED) {
        // this is the last time that onClose() was called
          state.connectionState = EventBusConnectionStates.DISABLED;
        } else {
          state.connectionState = newState;
        }
      }
    }
  )
);