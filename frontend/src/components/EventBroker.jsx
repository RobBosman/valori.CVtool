import React from "react"
import EventBus from "vertx3-eventbus-client"
import { connect } from "react-redux"
import { AuthenticationStates } from "../redux/authentication"
import { EventBusStates, updateEventBusState } from "../redux/eventBus"

const CONNECT_URL = "http://localhost:80/eventbus";
const CONNECT_OPTIONS = {
  vertxbus_reconnect_attempts_max: Infinity, // Max reconnect attempts
  vertxbus_reconnect_delay_min: 500, // Initial delay (in ms) before first reconnect attempt
  vertxbus_reconnect_delay_max: 5000, // Max delay (in ms) between reconnect attempts
  vertxbus_reconnect_exponent: 2, // Exponential backoff factor
  vertxbus_randomization_factor: 0.5 // Randomization factor between 0 and 1
};

const handlers = new Set();
const handlersToBeUnregistered = new Set();
let eventBus = null;

const EventBroker = (props) => {

  React.useEffect(() => {
    if (props.isEnabled && props.eventBus === EventBusStates.DISABLED) {
      connectEventBus();
      props.updateEventBusState(EventBusStates.CONNECTING)
    } else if (props.isEnabled && props.eventBus === EventBusStates.CONNECTED) {
      refreshHandlerRegistrations()
    } else if (!props.isEnabled && props.eventBus !== EventBusStates.DISABLED && props.eventBus !== EventBusStates.CLOSING) {
      disconnectEventBus();
      props.updateEventBusState(EventBusStates.CLOSING)
    }
  }, [props.isEnabled, props.eventBus]);

  const connectEventBus = () => {
    console.debug('Creating the vert.x EventBus.');
    eventBus = new EventBus(CONNECT_URL, CONNECT_OPTIONS);
    eventBus.enableReconnect(true);

    eventBus.onerror = (error) => {
      console.error('An error occurred on the vert.x EventBus.', error)
    };

    eventBus.onopen = () => {
      console.debug('The vert.x EventBus is open.');
      props.updateEventBusState(EventBusStates.CONNECTED);
    };

    eventBus.onclose = () => {
      console.debug(`The vert.x EventBus is closed.`);
      props.updateEventBusState(EventBusStates.CLOSED);
    }
  };

  const disconnectEventBus = () => {
    console.debug('Closing the vert.x EventBus.');
    handlersToBeUnregistered.clear();
    if (eventBus?.state === EventBus.OPEN) {
      eventBus.close();
    } else {
      eventBus?.enableReconnect(false)
    }
  };

  const refreshHandlerRegistrations = () => {
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
  isEnabled: (state.authentication.loginState === AuthenticationStates.LOGGING_IN
    || state.authentication.loginState === AuthenticationStates.LOGGED_IN),
  eventBus: state.eventBus
});

const mapDispatchToProps = (dispatch) => ({
  updateEventBusState: (state) => dispatch(updateEventBusState(state))
});

export default connect(select, mapDispatchToProps)(EventBroker)


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

export const sendEvent = (address, requestData, headerData, onSuccess, onError) => {
  if (eventBus?.state === EventBus.OPEN) {
    eventBus.send(
      address,
      requestData,
      headerData,
      (error, message) => (error) ? onError(error) : onSuccess(message)
    )
  } else {
    onError(`Error sending '${address}' event; the EventBus is not connected.`)
  }
};