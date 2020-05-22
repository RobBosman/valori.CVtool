"use strict";

import store from "../../redux/store";
import { EventBusConnectionStates } from "../eventBus/eventBus-actions";
import { eventBusClient } from "../../services/eventBus/eventBus-services";
import { setAccount } from "./authentication-actions";

export const loginToRemote = (state) => {
  if (!state.ui.account
    && state.eventBus.connectionState === EventBusConnectionStates.CONNECTED) {
    eventBusClient.sendEvent(
      'login',
      { authenticationCode: "My AuthCode" }, // TODO obtain authentication code
      {},
      (message) => {
        Object.keys(message.body)
          .forEach((entity) => {
            const instances = message.body[entity];
            Object.keys(instances)
              .forEach((id) => {
                store.dispatch(setAccount(instances[id]))
                console.debug("You successfully logged in", message);
              })
          })
      },
      console.error);
  }
};