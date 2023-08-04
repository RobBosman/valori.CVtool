import {getRandomValues} from 'crypto';

export const fetchFromRemote = (entities, sendEventFunc) =>
  sendEventFunc("mongodb.fetch", entities)
    .then((message) => message.body);

export const saveToRemote = (entities, sendEventFunc) =>
  sendEventFunc("mongodb.save", entities);

export const deleteAccountFromRemote = (accountId, sendEventFunc) =>
  sendEventFunc("account.delete", { "account": { [accountId]: {} } })
    .then((message) => message.body);

// Use this function to create a unique object id (UUID).
export const createUuid = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const buf = new Uint8Array(1);
    getRandomValues(buf);
    const r = buf[0] & 15;
    const v = c == "x" ? r : (r & 3 | 8);
    return v.toString(16);
  });