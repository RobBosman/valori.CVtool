"use strict";

import { eventBusClient } from "../../services/eventBus/eventBus-services";
import { replaceSafeContent } from "./safe-actions";

export const fetchCvFromRemote = (state, dispatch) => {
  const account = state.authentication.account;
  if (account)
    eventBusClient.sendEvent('fetch.cv', { accountId: account._id })
      .then((message) => dispatch(replaceSafeContent(message.body)))
      .then((message) => console.debug('Successfully received cv data', message))
      .catch(console.error);
};

export const saveAllToRemote = (state) =>
  eventBusClient.sendEvent('save', state.safe)
    .then((message) => console.debug('Successfully saved safe content', message))
    .catch(console.error);

/** Use this function to create a unique object id. */
export const createId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}