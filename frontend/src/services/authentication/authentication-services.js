"use strict";

import { Observable } from "rxjs";
import { setAccount, LoginStates, confirmLoggingIn, confirmLoggedIn } from "./authentication-actions";
import { EventBusConnectionStates } from "../eventBus/eventBus-actions";
import { eventBusClient } from "../../services/eventBus/eventBus-services";

export const loginToRemoteObservable = (state) =>
  new Observable((subscriber) => {
    if (state.authentication.loginState === LoginStates.REQUESTED_LOGIN
      && state.eventBus.connectionState === EventBusConnectionStates.CONNECTED) {
      eventBusClient.sendEvent('login', { authenticationCode: "My AuthCode" }) // TODO obtain authentication code
        .then((message) => loggedInResponseHandler(message, subscriber), subscriber.error)
        .then(() => subscriber.next(confirmLoggedIn()))
        .then(() => subscriber.complete())
        .catch(console.error);
      subscriber.next(confirmLoggingIn());
    }
  });

const loggedInResponseHandler = (message, subscriber) =>
  Object.keys(message.body)
    .forEach((entity) => {
      const instances = message.body[entity];
      Object.keys(instances)
        .forEach((id) => {
          console.debug("You successfully logged in", message);
          subscriber.next(setAccount(instances[id]));
        })
    });