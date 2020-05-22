"use strict";

import store from "../../redux/store";
import { sendEvent } from "../../services/eventBus/eventBus-services";
import { replaceSafeContent } from "./safe-actions";

export const fetchCvFromRemote = (state) => {
  const account = state.authentication.account;
  if (account)
    sendEvent(
      'fetch.cv',
      { accountId: account._id },
      {},
      (message) => {
        store.dispatch(replaceSafeContent(message.body))
        console.debug(`Successfully received cv data`, message);
      },
      console.error)
};

export const saveAllToRemote = (state) => sendEvent(
  'save',
  state.safe,
  (message) => console.debug(`Successfully saved all safe`, message),
  console.error);

/**
 * Use this function to create a unique object id.
 */
export const createId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}