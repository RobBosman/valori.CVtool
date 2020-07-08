export const fetchAccountInfoFromRemote = (authorizationCode, sendEvent) =>
  sendEvent("login", { authorizationCode })
    .then((message) => {
      const accountInstances = Object.values(message.body.account || {});
      const accountInfo = accountInstances && accountInstances[0];
      if (!accountInfo) {
        throw new Error("message.body.account is not present");
      }
      return accountInfo;
    });