import EventBus from "vertx3-eventbus-client";
import { EventBusConnectionStates } from "./eventBus-actions";

const CONNECT_URL = "http://localhost:80/eventbus"; // TODO - specify via environment variable.
const CONNECT_OPTIONS = {
  vertxbus_reconnect_attempts_max: Infinity, // Max reconnect attempts
  vertxbus_reconnect_delay_min: 500, // Initial delay (in ms) before first reconnect attempt
  vertxbus_reconnect_delay_max: 5000, // Max delay (in ms) between reconnect attempts
  vertxbus_reconnect_exponent: 2, // Exponential backoff factor
  vertxbus_randomization_factor: 0.5 // Randomization factor between 0 and 1
};

export class EventBusClient {

  constructor() {
    this._eventBus = null;
    this._handlers = new Set();
    this._handlersToBeUnregistered = new Set();
  }

  connectEventBus = (updateConnectionState) => {
    console.debug("Creating the vert.x EventBus.");
    updateConnectionState(EventBusConnectionStates.CONNECTING);
    this._eventBus = new EventBus(CONNECT_URL, CONNECT_OPTIONS);
    this._eventBus.enableReconnect(true);

    this._eventBus.onerror = (error) => {
      console.error("An error occurred on the vert.x EventBus.", error);
    };

    this._eventBus.onopen = () => {
      console.debug("The vert.x EventBus is open.");
      updateConnectionState(EventBusConnectionStates.CONNECTED);
    };

    this._eventBus.onclose = () => {
      console.debug("The vert.x EventBus is closed.");
      updateConnectionState(EventBusConnectionStates.DISCONNECTED);
    };
  };

  disconnectEventBus = (updateConnectionState) => {
    console.debug("Closing the vert.x EventBus.");
    updateConnectionState(EventBusConnectionStates.DISCONNECTING);
    this._handlersToBeUnregistered.clear();
    if (this._eventBus?.state === EventBus.OPEN) {
      this._eventBus.close();
    } else {
      this._eventBus?.enableReconnect(false);
    }
  };

  sendEvent = (address, requestData, headerData = {}) => new Promise((_resolve, _reject) => {
    if (this._eventBus?.state === EventBus.OPEN) {
      console.debug(`Sending event '${address}'`);
      this._eventBus.send(
        address, requestData, headerData,
        (error, message) => error ? _reject(error) : _resolve(message)
      );
    } else {
      _reject(`Error sending '${address}' event; the EventBus is not connected.`);
    }
  });

  addEventHandler = (handler) => new Promise((_resolve, _reject) => {
    if (this._handlers.has(handler)) {
      _resolve();
    } else {
      this._handlers.add(handler);
      if (this._eventBus?.state === EventBus.OPEN) {
        this._eventBus.registerHandler(
          handler.address, handler.headers, handler.callback,
          (error, message) => error ? _reject(error) : _resolve(message)
        );
      } else {
        _resolve();
      }
    }
  });

  removeEventHandler = (handler) => new Promise((_resolve, _reject) => {
    if (!this._handlers.has(handler)) {
      _resolve();
    } else {
      this._handlers.delete(handler);
      if (this._eventBus?.state === EventBus.OPEN) {
        this._eventBus.unregisterHandler(
          handler.address, handler.headers, handler.callback,
          (error, message) => error ? _reject(error) : _resolve(message)
        );
      } else {
        this._handlersToBeUnregistered.add(handler);
        _resolve();
      }
    }
  });

  refreshHandlerRegistrations = () => {
    for (let i = this._handlersToBeUnregistered.size - 1; i >= 0; i--) { // loop reversed, so we can 'shrink' the list
      const handler = this._handlersToBeUnregistered[i];
      if (handler && this._eventBus?.state === EventBus.OPEN) {
        this._eventBus.unregisterHandler(handler.address, handler.headers, handler.callback);
        this._handlersToBeUnregistered.delete(handler);
      }
    }
    this._handlers.forEach(handler => {
      if (this._eventBus?.state === EventBus.OPEN) {
        this._eventBus.unregisterHandler(handler.address, handler.headers, handler.callback);
        this._eventBus.registerHandler(handler.address, handler.headers, handler.callback);
      }
    });
  };
}

export const eventBusClient = new EventBusClient();