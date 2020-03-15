import React from "react"
import EventBus from "vertx3-eventbus-client"
import {connect} from "react-redux"
import {AppStates} from "../redux/ducks/AppState"

export const ConnectionStates = {
    DISABLED: 'DISABLED',
    CONNECTING: 'CONNECTING',
    OPEN: 'OPEN',
    CLOSING: 'CLOSING',
    CLOSED: 'CLOSED'
};

const handlers = new Set();
const handlersToBeUnregistered = new Set();
let eventBus = null;

const EventBroker = (props) => {

    const [connectionState, setConnectionState] = React.useState(ConnectionStates.DISABLED);

    const updateConnectionState = (newState) => setConnectionState((currentState) => {
        if (currentState === ConnectionStates.CONNECTING && newState === ConnectionStates.CLOSED) {
            // this is a failed connection attempt
            return currentState
        }
        if (currentState === ConnectionStates.CLOSING && newState === ConnectionStates.CLOSED) {
            // this is the last time that onClose() was called
            return ConnectionStates.DISABLED
        }
        return newState
    });

    React.useEffect(() => {
        if (props.isEnabled && connectionState === ConnectionStates.DISABLED) {
            connectEventBus();
            updateConnectionState(ConnectionStates.CONNECTING)
        } else if (props.isEnabled && connectionState === ConnectionStates.OPEN) {
            refreshHandlerRegistrations()
        } else if (!props.isEnabled && connectionState !== ConnectionStates.DISABLED && connectionState !== ConnectionStates.CLOSING) {
            disconnectEventBus();
            updateConnectionState(ConnectionStates.CLOSING)
        }
    }, [props.isEnabled, connectionState]);

    const connectEventBus = () => {
        console.debug('Creating the vert.x EventBus.');
        const options = {
            vertxbus_reconnect_attempts_max: Infinity, // Max reconnect attempts
            vertxbus_reconnect_delay_min: 500, // Initial delay (in ms) before first reconnect attempt
            vertxbus_reconnect_delay_max: 5000, // Max delay (in ms) between reconnect attempts
            vertxbus_reconnect_exponent: 2, // Exponential backoff factor
            vertxbus_randomization_factor: 0.5 // Randomization factor between 0 and 1
        };
        eventBus = new EventBus('http://localhost:80/eventbus', options);
        eventBus.enableReconnect(true);

        eventBus.onerror = (error) => {
            console.error('An error occurred on the vert.x EventBus.', error)
        };

        eventBus.onopen = () => {
            console.log('The vert.x EventBus is open.');
            updateConnectionState(ConnectionStates.OPEN);
        };

        eventBus.onclose = () => {
            console.log(`The vert.x EventBus is closed.`);
            updateConnectionState(ConnectionStates.CLOSED);
        }
    };

    const disconnectEventBus = () => {
        console.debug('Closing the vert.x EventBus.');
        handlersToBeUnregistered.clear();
        if (eventBus.state === EventBus.OPEN) {
            eventBus.close();
        } else {
            eventBus.enableReconnect(false)
        }
    };

    const refreshHandlerRegistrations = () => {
        console.debug(`Refreshing handler registration`);
        for (let i = handlersToBeUnregistered.size - 1; i >= 0; i--) { // loop reversed, so we can 'shrink' the list
            const handler = handlersToBeUnregistered[i];
            if (handler && eventBus?.state === EventBus.OPEN) {
                eventBus.unregisterHandler(handler.address, handler.headers, handler.callback);
                handlersToBeUnregistered.delete(handler)
            }
        }
        handlers.forEach(handler => {
            if (eventBus?.state === EventBus.OPEN) {
                eventBus.unregisterHandler(handler.address, handler.headers, handler.callback);
                eventBus.registerHandler(handler.address, handler.headers, handler.callback)
            }
        });
    };

    return props.children
};

const select = (state) => ({
    isEnabled: state.appState === AppStates.LOGGED_IN
});

export default connect(select)(EventBroker)


export const addEventHandler = (handler) => {
    if (!handlers.has(handler)) {
        handlers.add(handler);
        if (eventBus?.state === EventBus.OPEN) {
            eventBus.registerHandler(handler.address, handler.headers, handler.callback)
        }
    }
};

export const removeEventHandler = (handler) => {
    if (handlers.has(handler)) {
        handlers.delete(handler);
        if (eventBus?.state === EventBus.OPEN) {
            eventBus.unregisterHandler(handler.address, handler.headers, handler.callback)
        } else {
            handlersToBeUnregistered.add(handler)
        }
    }
};

export const sendEvent = (address, requestData, headerData, responseHandler) => {
    if (eventBus?.state === EventBus.OPEN) {
        eventBus.send(address, requestData, headerData, responseHandler)
    } else if (responseHandler) {
        responseHandler("The EventBus is not connected.")
    } else {
        console.error(`Error sending event to '${address}'; the EventBus is not connected.`)
    }
};