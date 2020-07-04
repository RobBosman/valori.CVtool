export const loginToRemote = (sendEvent) =>
  sendEvent("login", { authenticationCode: "My AuthCode" }) // TODO obtain authentication code
    .then((message) => {
      const accountInstances = Object.values(message.body.account || {});
      const account = accountInstances && accountInstances[0];
      if (!account) {
        throw new Error("message.body.account is not present");
      }
      return account;
    });