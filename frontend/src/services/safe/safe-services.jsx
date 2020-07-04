import { Observable } from "rxjs";
import { replaceSafeContent } from "./safe-actions";

export const fetchCvFromRemote = (state, sendEvent) =>
  new Observable((subscriber) => {
    const account = state.authentication?.account;
    if (account) {
      sendEvent("fetch.cv", { accountId: account._id })
        .then((message) => subscriber.next(replaceSafeContent(message.body)))
        .then(() => subscriber.complete())
        .catch((error) => subscriber.error(error));
    } else {
      subscriber.error("authentication.account is not present");
    }
  });

export const saveAllToRemote = (state, sendEvent) =>
  sendEvent("save", state.safe);

// Use this function to create a unique object id (UUID).
export const createId = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c == "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });