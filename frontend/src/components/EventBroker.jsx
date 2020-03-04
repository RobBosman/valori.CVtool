import React from "react"
import EventBus from "vertx3-eventbus-client"
import {connect} from "react-redux"
import {AppStates} from "../redux/ducks/AppState"


const handlers = new Set();
const handlersToBeUnregistered = new Set();
let eventBus = null;


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


const EventBroker = (props) => {

    React.useEffect(() => {
        if (props.isLoggedIn) {
            connectEventBridge()
        } else {
            disconnectEventBridge()
        }
    });

    const connectEventBridge = () => {
        if (eventBus !== null) {
            return
        }

        const options = {
            vertxbus_reconnect_attempts_max: Infinity, // Max reconnect attempts
            vertxbus_reconnect_delay_min: 1000, // Initial delay (in ms) before first reconnect attempt
            vertxbus_reconnect_delay_max: 5000, // Max delay (in ms) between reconnect attempts
            vertxbus_reconnect_exponent: 2, // Exponential backoff factor
            vertxbus_randomization_factor: 0.5 // Randomization factor between 0 and 1
        };
        eventBus = new EventBus('http://localhost:80/eventbus', options);
        eventBus.enableReconnect(true);

        eventBus.onerror = (error) => {
            console.log('An error occurred on the vert.x EventBus', error)
        };

        eventBus.onopen = () => {
            console.log('The vert.x EventBus is now open.');
            updateHandlerRegistrations()
        };

        eventBus.onclose = () => {
            if (eventBus !== null) {
                console.log('The vert.x EventBus closed unexpectedly.')
            } else {
                console.log('The vert.x EventBus has been closed.')
            }
        };

        eventBus.onreconnect = () => {
            console.log('The vert.x EventBus has reconnected.');
        }
    };

    const disconnectEventBridge = () => {
        if (eventBus === null) {
            return
        }

        if (eventBus.state === EventBus.CONNECTING || eventBus.state === EventBus.OPEN) {
            eventBus.close();
            console.log('The vert.x EventBus is closing.')
        }
        handlersToBeUnregistered.clear();
        eventBus = null;
    };

    const updateHandlerRegistrations = () => {
        const unregisteredHandlers = new Set();
        handlersToBeUnregistered.forEach(handler => {
            if (eventBus?.state === EventBus.OPEN) {
                eventBus.unregisterHandler(handler.address, handler.headers, handler.callback);
                unregisteredHandlers.add(handler)
            }
        });
        unregisteredHandlers.forEach(handler => handlersToBeUnregistered.delete(handler));

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
    isLoggedIn: state.appState === AppStates.LOGGED_IN
});

export default connect(select)(EventBroker)


// TODO - put this somewhere else
const getHeartbeatHandler = (error, message) => {
    console.log('received a Heartbeat: ' + message.body);
};
const getCvDataHandler = (error, message) => {
    console.log('received a message: ' + JSON.stringify(message), error, message);
};


const handler1 = {address: 'cv.heartbeat', header: {}, callback: getHeartbeatHandler};
const handler2 = {address: 'cv.data.get', header: {}, callback: getCvDataHandler};
addEventHandler(handler1);
addEventHandler(handler2);
console.log('Added event handlers');