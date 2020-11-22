import EventBus from "vertx3-eventbus-client";
import { BehaviorSubject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

const CONNECT_URL = "/eventbus";
const CONNECT_OPTIONS = {
  vertxbus_reconnect_attempts_max: Infinity, // Max reconnect attempts
  vertxbus_reconnect_delay_min: 500, // Initial delay (in ms) before first reconnect attempt
  vertxbus_reconnect_delay_max: 5000, // Max delay (in ms) between reconnect attempts
  vertxbus_reconnect_exponent: 2, // Exponential backoff factor
  vertxbus_randomization_factor: 0.5 // Randomization factor between 0 and 1
};

export const ConnectionStates = {
  DISCONNECTED: "DISCONNECTED",
  CONNECTING: "CONNECTING",
  CONNECTED: "CONNECTED",
  DISCONNECTING: "DISCONNECTING"
};

export class EventBusClient {

  constructor() {
    this._eventBus = null;
    this._handlers = new Set();
    this._connectionStateSubject = new BehaviorSubject(ConnectionStates.DISCONNECTED);
    this._errorMessagesSubject = new BehaviorSubject("");
    this._defaultHeaders = {};
  }

  getConnectionState = () =>
    this._connectionStateSubject.value;

  monitorConnectionState = () =>
    this._connectionStateSubject.asObservable().pipe(
      distinctUntilChanged()
    );

  monitorErrorMessages = () =>
    this._errorMessagesSubject.asObservable();

  connectEventBus = () => {
    if (this._eventBus?.sockJSConn) {
      this._eventBus.close();
    }

    this._eventBus = new EventBus(CONNECT_URL, CONNECT_OPTIONS);
    this._eventBus.enableReconnect(true);
    this._connectionStateSubject.next(ConnectionStates.CONNECTING);

    this._eventBus.onopen = () => {
      // Make sure all event handlers are (re-)registered each time the EventBus connects.
      this.registerEventHandlers();
      // Give the new connection a few milliseconds to register handlers.
      setTimeout(
        () => this._connectionStateSubject.next(ConnectionStates.CONNECTED),
        100);
    };

    this._eventBus.onclose = () => {
      if (this._eventBus.reconnectTimerID) {
        this._connectionStateSubject.next(ConnectionStates.CONNECTING);
      } else {
        this._connectionStateSubject.next(ConnectionStates.DISCONNECTED);
        this._eventBus = null;
      }
    };

    this._eventBus.onerror = (error) => {
      if (error.body === "rejected") {
        this._errorMessagesSubject.next("Je hebt onvoldoende rechten voor deze actie.");
      } else {
        console.error("An error occurred on the vert.x EventBus.", error);
      }
    };
  }
  
  disconnectEventBus = () => {
    this._connectionStateSubject.next(ConnectionStates.DISCONNECTING);
    if (this._eventBus?.sockJSConn) {
      this._eventBus.close();
    } else if (this._eventBus) {
      this._eventBus.enableReconnect(false);
      this._connectionStateSubject.next(ConnectionStates.DISCONNECTED);
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
          (error, message) => error
            ? _reject(`Onbekende fout in de backend: ${error} ${message}`)
            : _resolve(message)
        );
      } else {
        _reject(new Error("De verbinding met de backend is verbroken. Probeer het later nog eens."));
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
      this._eventBus.unregisterHandler(handler.address, handler.headers, handler.callback);
      this._eventBus.registerHandler(handler.address, handler.headers, handler.callback);
    });
}

export const eventBusClient = new EventBusClient();