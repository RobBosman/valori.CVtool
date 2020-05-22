"use strict";

import store from "../../redux/store"
import EventBus from "vertx3-eventbus-client"
import { EventBusStates, updateEventBusState } from "./eventBus-actions"

const CONNECT_URL = "http://localhost:80/eventbus";
const CONNECT_OPTIONS = {
  vertxbus_reconnect_attempts_max: Infinity, // Max reconnect attempts
  vertxbus_reconnect_delay_min: 500, // Initial delay (in ms) before first reconnect attempt
  vertxbus_reconnect_delay_max: 5000, // Max delay (in ms) between reconnect attempts
  vertxbus_reconnect_exponent: 2, // Exponential backoff factor
  vertxbus_randomization_factor: 0.5 // Randomization factor between 0 and 1
};

const _handlers = new Set();
const _handlersToBeUnregistered = new Set();
let _eventBus = null;

const updateState = (state) => store.dispatch(updateEventBusState(state));

export const addEventHandler = (handler) => {
  if (!_handlers.has(handler)) {
    _handlers.add(handler);
    if (_eventBus?.state === EventBus.OPEN) {
      _eventBus.registerHandler(handler.address, handler.headers, handler.callback)
    }
  }
};

export const removeEventHandler = (handler) => {
  if (_handlers.has(handler)) {
    _handlers.delete(handler);
    if (_eventBus?.state === EventBus.OPEN) {
      _eventBus.unregisterHandler(handler.address, handler.headers, handler.callback)
    } else {
      handlersToBeUnregistered.add(handler)
    }
  }
};

export const refreshHandlerRegistrations = () => {
  for (let i = _handlersToBeUnregistered.size - 1; i >= 0; i--) { // loop reversed, so we can 'shrink' the list
      const handler = _handlersToBeUnregistered[i];
      if (handler && _eventBus?.state === EventBus.OPEN) {
        _eventBus.unregisterHandler(handler.address, handler.headers, handler.callback);
        _handlersToBeUnregistered.delete(handler)
      }
    }
    _handlers.forEach(handler => {
      if (_eventBus?.state === EventBus.OPEN) {
        _eventBus.unregisterHandler(handler.address, handler.headers, handler.callback);
        _eventBus.registerHandler(handler.address, handler.headers, handler.callback)
      }
    });
  };

export const sendEvent = (address, requestData, headerData, onSuccess, onError) => {
  if (_eventBus?.state === EventBus.OPEN) {
    _eventBus.send(
      address,
      requestData,
      headerData,
      (error, message) => error ? onError(error) : onSuccess(message)
    )
  } else {
    onError(`Error sending '${address}' event; the EventBus is not connected.`)
  }
};

export const connectEventBus = () => {
  console.debug('Creating the vert.x EventBus.');
  _eventBus = new EventBus(CONNECT_URL, CONNECT_OPTIONS);
  _eventBus.enableReconnect(true);

  _eventBus.onerror = (error) => {
    console.error('An error occurred on the vert.x EventBus.', error)
  };

  _eventBus.onopen = () => {
    console.debug('The vert.x EventBus is open.');
    updateState(EventBusStates.CONNECTED);
  };

  _eventBus.onclose = () => {
    console.debug(`The vert.x EventBus is closed.`);
    updateState(EventBusStates.CLOSED);
  }
};

export const disconnectEventBus = () => {
  console.debug('Closing the vert.x EventBus.');
  _handlersToBeUnregistered.clear();
  if (_eventBus?.state === EventBus.OPEN) {
    _eventBus.close();
  } else {
    _eventBus?.enableReconnect(false)
  }
};