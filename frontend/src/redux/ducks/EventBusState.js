"use strict";

const UPDATE_EVENT_BUS_STATE = "UPDATE_EVENT_BUS_STATE";

export const updateEventBusState = (state) => ({type: UPDATE_EVENT_BUS_STATE, payload: state});

export const EventBusStates = {
    DISABLED: 'DISABLED',
    CONNECTING: 'CONNECTING',
    CONNECTED: 'CONNECTED',
    CLOSING: 'CLOSING',
    CLOSED: 'CLOSED'
};

const reducer = (currentState = EventBusStates.DISABLED, action) => {
    if (action.type === UPDATE_EVENT_BUS_STATE) {
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
    } else
        return currentState;
};
export default reducer