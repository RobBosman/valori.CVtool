"use strict";

import { createAction, createReducer } from "@reduxjs/toolkit";

export const updateEventBusState = createAction("EVENT_BUS_UPDATE_STATE");

export const EventBusStates = {
  DISABLED: 'DISABLED',
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  CLOSING: 'CLOSING',
  CLOSED: 'CLOSED'
};

const eventBusReducer = createReducer(EventBusStates.DISABLED, {
  [updateEventBusState]: (currentState, action) => {
    const newState = action.payload;
    if (currentState === EventBusStates.CONNECTING && newState === EventBusStates.CLOSED) {
      // this is a failed connection attempt
      return currentState
    }
    if (currentState === EventBusStates.CLOSING && newState === EventBusStates.CLOSED) {
      // this is the last time that onClose() was called
      return EventBusStates.DISABLED
    }
    return newState;
  }
});

export default eventBusReducer