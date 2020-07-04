export const fetchCvFromRemote = (accountInfo, sendEvent) =>
  sendEvent("fetch.cv", { accountId: accountInfo._id })
    .then((message) => message.body);

export const saveAllToRemote = (state, sendEvent) =>
  sendEvent("save", state.safe);

// Use this function to create a unique object id (UUID).
export const createUuid = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c == "x" ? r : (r & 3 | 8);
    return v.toString(16);
  });