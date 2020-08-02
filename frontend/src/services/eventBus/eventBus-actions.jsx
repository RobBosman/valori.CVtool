import { createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../redux/reducerRegistry";

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