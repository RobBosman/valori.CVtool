export const fetchAccountInfo = (authenticationCode, sendEvent) =>
  sendEvent("login", { authenticationCode })
    .then((message) => {
      const accountInstances = Object.values(message.body.account || {});
      const accountInfo = accountInstances && accountInstances[0];
      if (!accountInfo) {
        throw new Error("message.body.account is not present");
      }
      return accountInfo;
    });