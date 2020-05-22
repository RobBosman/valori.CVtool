"use strict";

import store from "../../redux/store"
import EventBus from "vertx3-eventbus-client"
import { EventBusConnectionStates, updateEventBusConnectionState } from "./eventBus-actions"

const CONNECT_URL = "http://localhost:80/eventbus";
const CONNECT_OPTIONS = {
  vertxbus_reconnect_attempts_max: Infinity, // Max reconnect attempts
  vertxbus_reconnect_delay_min: 500, // Initial delay (in ms) before first reconnect attempt
  vertxbus_reconnect_delay_max: 5000, // Max delay (in ms) between reconnect attempts
  vertxbus_reconnect_exponent: 2, // Exponential backoff factor
  vertxbus_randomization_factor: 0.5 // Randomization factor between 0 and 1
};

export class EventBusClient {

  constructor() {
    this._handlers = new Set();
    this._handlersToBeUnregistered = new Set();
    this._eventBus = null;
  }

  connectEventBus = () => {
    console.debug('Creating the vert.x EventBus.');
    this._eventBus = new EventBus(CONNECT_URL, CONNECT_OPTIONS);
    this._eventBus.enableReconnect(true);

    this._eventBus.onerror = (error) => {
      console.error('An error occurred on the vert.x EventBus.', error)
    };

    this._eventBus.onopen = () => {
      console.debug('The vert.x EventBus is open.');
      store.dispatch(updateEventBusConnectionState(EventBusConnectionStates.CONNECTED))
    };

    this._eventBus.onclose = () => {
      console.debug(`The vert.x EventBus is closed.`);
      store.dispatch(updateEventBusConnectionState(EventBusConnectionStates.CLOSED))
    }
  };

  disconnectEventBus = () => {
    console.debug('Closing the vert.x EventBus.');
    this._handlersToBeUnregistered.clear();
    if (this._eventBus?.state === EventBus.OPEN) {
      this._eventBus.close();
    } else {
      this._eventBus?.enableReconnect(false)
    }
  };

  sendEvent = (address, requestData, headerData, onSuccess, onError) => {
    if (this._eventBus?.state === EventBus.OPEN) {
      this._eventBus.send(
        address,
        requestData,
        headerData,
        (error, message) => error ? onError(error) : onSuccess(message)
      )
    } else {
      onError(`Error sending '${address}' event; the EventBus is not connected.`)
    }
  };

  addEventHandler = (handler) => {
    if (!this._handlers.has(handler)) {
      this._handlers.add(handler);
      if (this._eventBus?.state === EventBus.OPEN) {
        this._eventBus.registerHandler(handler.address, handler.headers, handler.callback)
      }
    }
  };

  removeEventHandler = (handler) => {
    if (this._handlers.has(handler)) {
      this._handlers.delete(handler);
      if (this._eventBus?.state === EventBus.OPEN) {
        this._eventBus.unregisterHandler(handler.address, handler.headers, handler.callback)
      } else {
        handlersToBeUnregistered.add(handler)
      }
    }
  };

  refreshHandlerRegistrations = () => {
    for (let i = this._handlersToBeUnregistered.size - 1; i >= 0; i--) { // loop reversed, so we can 'shrink' the list
      const handler = this._handlersToBeUnregistered[i];
      if (handler && this._eventBus?.state === EventBus.OPEN) {
        this._eventBus.unregisterHandler(handler.address, handler.headers, handler.callback);
        this._handlersToBeUnregistered.delete(handler)
      }
    }
    this._handlers.forEach(handler => {
      if (this._eventBus?.state === EventBus.OPEN) {
        this._eventBus.unregisterHandler(handler.address, handler.headers, handler.callback);
        this._eventBus.registerHandler(handler.address, handler.headers, handler.callback)
      }
    });
  };
}

export const eventBusClient = new EventBusClient();