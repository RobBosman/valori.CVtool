import EventBus from "vertx3-eventbus-client";
import { BehaviorSubject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

const CONNECT_URL = "http://localhost:80/eventbus"; // TODO - specify via environment variable.
const CONNECT_OPTIONS = {
  vertxbus_reconnect_attempts_max: Infinity, // Max reconnect attempts
  vertxbus_reconnect_delay_min: 500, // Initial delay (in ms) before first reconnect attempt
  vertxbus_reconnect_delay_max: 5000, // Max delay (in ms) between reconnect attempts
  vertxbus_reconnect_exponent: 2, // Exponential backoff factor
  vertxbus_randomization_factor: 0.5 // Randomization factor between 0 and 1
};

export const EventBusConnectionStates = {
  DISCONNECTED: "DISCONNECTED",
  CONNECTING: "CONNECTING",
  CONNECTED: "CONNECTED",
  DISCONNECTING: "DISCONNECTING"
};

export class EventBusClient {

  constructor() {
    this._eventBus = null;
    this._handlers = new Set();
    this._connectionStateSubject = new BehaviorSubject(EventBusConnectionStates.DISCONNECTED);
    this._defaultHeaders = {};
  }

  getConnectionState = () =>
    this._connectionStateSubject.value;

  monitorConnectionState = () =>
    this._connectionStateSubject.asObservable().pipe(
      distinctUntilChanged()
    );

  connectEventBus = () => {
    if (this._eventBus?.sockJSConn) {
      this._eventBus.close();
    }

    this._eventBus = new EventBus(CONNECT_URL, CONNECT_OPTIONS);
    this._eventBus.enableReconnect(true);
    this._connectionStateSubject.next(EventBusConnectionStates.CONNECTING);

    this._eventBus.onopen = () => {
      // Make sure all event handlers are (re-)registered each time the EventBus connects.
      this.registerEventHandlers();
      this._connectionStateSubject.next(EventBusConnectionStates.CONNECTED);
    };

    this._eventBus.onclose = () => {
      if (this._eventBus.reconnectTimerID) {
        this._connectionStateSubject.next(EventBusConnectionStates.CONNECTING);
      } else {
        this._connectionStateSubject.next(EventBusConnectionStates.DISCONNECTED);
        this._eventBus = null;
      }
    };

    this._eventBus.onerror = (error) => {
      console.debug("An error occurred on the vert.x EventBus.", error);
      throw error;
    };
  }
  
  disconnectEventBus = () => {
    this._connectionStateSubject.next(EventBusConnectionStates.DISCONNECTING);
    if (this._eventBus?.sockJSConn) {
      this._eventBus.close();
    } else if (this._eventBus) {
      this._eventBus.enableReconnect(false);
      this._connectionStateSubject.next(EventBusConnectionStates.DISCONNECTED);
    }
  };

  addDefaultHeaders = (headers) => {
    this._defaultHeaders = {
      ...this._defaultHeaders,
      ...headers
    };
  }

  deleteDefaultHeaders = (headers) =>
    Object.keys(headers).forEach((key) =>
      key in this._defaultHeaders && delete this._defaultHeaders[key]);

  mergeHeaders = (headers) => ({
    ...this._defaultHeaders,
    ...headers
  });

  sendEvent = (address, requestData, headers = {}) =>
    new Promise((_resolve, _reject) => {
      if (this._eventBus?.state === EventBus.OPEN) {
        console.debug(`Sending event '${address}'`);
        this._eventBus.send(address, requestData, this.mergeHeaders(headers),
          (error, message) => error ? _reject(error) : _resolve(message)
        );
      } else {
        _reject(new Error(`Error sending '${address}' event; the EventBus is not connected.`));
      }
    });

  addEventHandler = (handler) => {
    if (!this._handlers.has(handler)) {
      this._handlers.add(handler);
      if (this._eventBus?.state === EventBus.OPEN) {
        this._eventBus.registerHandler(handler.address, handler.headers, handler.callback);
      }
    }
  };

  removeEventHandler = (handler) => {
    if (this._handlers.has(handler)) {
      this._handlers.delete(handler);
      if (this._eventBus?.state === EventBus.OPEN) {
        this._eventBus.unregisterHandler(handler.address, handler.headers, handler.callback);
      }
    }
  };

  registerEventHandlers = () =>
    this._handlers.forEach(handler => {
      if (this._eventBus?.state === EventBus.OPEN) {
        this._eventBus.unregisterHandler(handler.address, handler.headers, handler.callback);
        this._eventBus.registerHandler(handler.address, handler.headers, handler.callback);
      }
    });
}

export const eventBusClient = new EventBusClient();