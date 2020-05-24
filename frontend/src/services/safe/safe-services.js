"use strict";

import { Observable } from "rxjs";
import { eventBusClient } from "../../services/eventBus/eventBus-services";
import { replaceSafeContent } from "./safe-actions";

export const fetchCvFromRemote = (state) =>
  new Observable((subscriber) => {
    const account = state.authentication.account;
    if (account) {
      eventBusClient.sendEvent('fetch.cv', { accountId: account._id })
        .then((message) => {
          console.debug('Successfully received cv data', message);
          return message
        })
        .then((message) => subscriber.next(replaceSafeContent(message.body)))
        .then(() => subscriber.complete())
        .catch((e) => subscriber.error(e))
    } else {
      subscriber.error('authentication.account is not present')
    }
  });

export const saveAllToRemote = (state) =>
  new Observable((subscriber) =>
    eventBusClient.sendEvent('save', state.safe)
      .then(() => console.debug('Successfully saved safe content'))
      .then(() => subscriber.complete())
      .catch((e) => subscriber.error(e))
  );

/** Use this function to create a unique object id. */
export const createId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}