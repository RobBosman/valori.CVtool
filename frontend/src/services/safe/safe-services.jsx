export const fetchAccountsFromRemote = (sendEventFunc) =>
  sendEventFunc("accounts.fetch", {})
    .then((message) => message.body);

export const fetchCvFromRemote = (accountId, sendEventFunc) =>
  sendEventFunc("cv.fetch", { accountId })
    .then((message) => message.body);

export const saveAccountToRemote = (accountData, sendEventFunc) =>
  sendEventFunc("account.save", accountData);


export const saveCvToRemote = (cvData, sendEventFunc) =>
  sendEventFunc("cv.save", cvData);

// Use this function to create a unique object id (UUID).
export const createUuid = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c == "x" ? r : (r & 3 | 8);
    return v.toString(16);
  });