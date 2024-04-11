export const fetchFromRemote = (entities, sendEventFunc) =>
  sendEventFunc("mongodb.fetch", entities)
    .then((message) => message.body);

export const saveToRemote = (entities, sendEventFunc) =>
  sendEventFunc("mongodb.save", entities);

export const deleteAccountFromRemote = (accountId, sendEventFunc) =>
  sendEventFunc("account.delete", { "account": { [accountId]: {} } })
    .then((message) => message.body);
