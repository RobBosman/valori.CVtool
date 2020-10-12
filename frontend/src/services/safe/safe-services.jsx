export const fetchCvFromRemote = (accountId, sendEventFunc) =>
  sendEventFunc("fetch.cv", { accountId })
    .then((message) => message.body);

export const saveToRemote = (safeData, sendEventFunc) =>
  sendEventFunc("save", safeData);

// Use this function to create a unique object id (UUID).
export const createUuid = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c == "x" ? r : (r & 3 | 8);
    return v.toString(16);
  });