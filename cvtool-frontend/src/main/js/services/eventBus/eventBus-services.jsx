import EventBus from "@vertx/eventbus-bridge-client.js";
import { BehaviorSubject } from "rxjs";
import * as rx from "rxjs/operators";
import * as authActions from "../auth/auth-actions.jsx";
import { store } from "../../redux/store";

const CONNECT_URL = "/eventbus";
const CONNECT_OPTIONS = {
  vertxbus_ping_interval: 30000, // Ping the server every 30 seconds
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

  #eventBus = null;
  #handlers = new Set();
  #connectionStateSubject = new BehaviorSubject(ConnectionStates.DISCONNECTED);
  #errorMessagesSubject = new BehaviorSubject("");
  #defaultHeaders = {};

  getConnectionState = () =>
    this.#connectionStateSubject.value;

  monitorConnectionState = () =>
    this.#connectionStateSubject.asObservable().pipe(
      rx.distinctUntilChanged()
    );

  monitorErrorMessages = () =>
    this.#errorMessagesSubject.asObservable();

  connectEventBus = () => {
    if (this.#eventBus?.sockJSConn) {
      this.#eventBus.close();
    }

    this.#eventBus = new EventBus(CONNECT_URL, CONNECT_OPTIONS);
    this.#eventBus.enableReconnect(true);
    this.#connectionStateSubject.next(ConnectionStates.CONNECTING);

    this.#eventBus.onopen = () => {
      // Make sure all event handlers are (re-)registered each time the EventBus connects.
      this.registerEventHandlers();
      // Give the new connection a few milliseconds to register handlers.
      setTimeout(
        () => this.#connectionStateSubject.next(ConnectionStates.CONNECTED),
        100);
    };

    this.#eventBus.onclose = () => {
      if (this.#eventBus.reconnectTimerID) {
        this.#connectionStateSubject.next(ConnectionStates.CONNECTING);
      } else {
        this.#connectionStateSubject.next(ConnectionStates.DISCONNECTED);
        this.#eventBus = null;
      }
    };

    this.#eventBus.onerror = (error) => {
      if (error.body === "rejected") {
        if (this.getConnectionState() === ConnectionStates.CONNECTED) {
          this.#errorMessagesSubject.next("Je bent uitgelogd. Log opnieuw in om verder te gaan.");
          store.dispatch(authActions.requestLogout());
        } else {
          this.#errorMessagesSubject.next("Oeps! Er ging iets mis in de communicatie met de backend server.");
        }
      } else {
        console.error("An error occurred on the vert.x EventBus.", error);
      }
    };
  };
  
  disconnectEventBus = () => {
    this.#connectionStateSubject.next(ConnectionStates.DISCONNECTING);
    if (this.#eventBus?.sockJSConn) {
      this.#eventBus.close();
    } else if (this.#eventBus) {
      this.#eventBus.enableReconnect(false);
      this.#connectionStateSubject.next(ConnectionStates.DISCONNECTED);
    }
  };

  upsertDefaultHeaders = (headers) => {
    this.#defaultHeaders = {
      ...this.#defaultHeaders,
      ...headers
    };
  };

  deleteDefaultHeaders = (headers) => {
    for (const key in headers) {
      key in this.#defaultHeaders && delete this.#defaultHeaders[key];
    }
  };

  mergeHeaders = (headers) => ({
    ...this.#defaultHeaders,
    ...headers
  });

  sendEvent = (address, requestData, headers = {}) =>
    new Promise((_resolve, _reject) => {
      if (this.#eventBus?.state === EventBus.OPEN) {
        this.#eventBus.send(address, requestData, this.mergeHeaders(headers),
          (error, message) => error
            ? _reject(new Error(`Onbekende fout in de backend server: ${JSON.stringify(error)} ${message}`))
            : _resolve(message)
        );
      } else {
        _reject(new Error("De verbinding met de backend server is verbroken. Probeer het later nog eens."));
      }
    });

  addEventHandler = (handler) => {
    if (!this.#handlers.has(handler)) {
      this.#handlers.add(handler);
      if (this.#eventBus?.state === EventBus.OPEN) {
        this.#eventBus.registerHandler(handler.address, handler.headers, handler.callback);
      }
    }
  };

  removeEventHandler = (handler) => {
    if (this.#handlers.has(handler)) {
      this.#handlers.delete(handler);
      if (this.#eventBus?.state === EventBus.OPEN) {
        this.#eventBus.unregisterHandler(handler.address, handler.headers, handler.callback);
      }
    }
  };

  registerEventHandlers = () => {
    for (const handler of this.#handlers) {
      this.#eventBus.unregisterHandler(handler.address, handler.headers, handler.callback);
      this.#eventBus.registerHandler(handler.address, handler.headers, handler.callback);
    }
  };
}

export const eventBusClient = new EventBusClient();