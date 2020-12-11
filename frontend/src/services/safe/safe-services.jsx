
export const fetchFromRemote = (entities, sendEventFunc) =>
  sendEventFunc("mongodb.fetch", entities)
    .then((message) => message.body);

export const saveToRemote = (entities, sendEventFunc) =>
  sendEventFunc("mongodb.save", entities);

export const fetchCvFromRemote = (accountId, sendEventFunc) =>
  sendEventFunc("cv.fetch", { accountId })
    .then((message) => message.body);

export const deleteAccountFromRemote = (accountId, sendEventFunc) =>
  sendEventFunc("account.delete", { accountId })
    .then((message) => message.body);

// Use this function to create a unique object id (UUID).
export const createUuid = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c == "x" ? r : (r & 3 | 8);
    return v.toString(16);
  });