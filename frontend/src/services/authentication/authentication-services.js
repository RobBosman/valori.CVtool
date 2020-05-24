"use strict";

import { Observable } from "rxjs";
import { setAccount, LoginStates, confirmLoggingIn, confirmLoggedIn } from "./authentication-actions";
import { EventBusConnectionStates } from "../eventBus/eventBus-actions";
import { eventBusClient } from "../../services/eventBus/eventBus-services";

export const loginToRemote = (state) =>
  new Observable((subscriber) => {
    if (state.authentication.loginState === LoginStates.REQUESTED_LOGIN
      && state.eventBus.connectionState === EventBusConnectionStates.CONNECTED) {
      subscriber.next(confirmLoggingIn());
      eventBusClient.sendEvent('login', { authenticationCode: "My AuthCode" }) // TODO obtain authentication code
        .then((message) => mapLoggedInResponse(message))
        .then((action) => subscriber.next(action))
        .then(() => subscriber.next(confirmLoggedIn()))
        .then(() => subscriber.complete())
        .catch((e) => subscriber.error(e))
    } else {
      subscriber.complete()
    }
  });

const mapLoggedInResponse = (message) => {
  const accountInstances = Object.values(message.body.account || {});
  const account = accountInstances && accountInstances[0];
  if (!account) {
    throw new Error('message.body.account is not present');
  }
  console.debug("You successfully logged in", message);
  return setAccount(account);
}