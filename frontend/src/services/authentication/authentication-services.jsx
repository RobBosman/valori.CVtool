import * as MSAL from "@azure/msal-browser";

const OAUTH2_CONFIG = {
  auth: {
    clientId: "348af39a-f707-4090-bb0a-9e4dca6e4138",
    authority: "https://login.microsoftonline.com/b44ed446-bdd4-46ab-a5b3-95ccdb7d4663",
    redirectUri: "http://localhost:8080/",
    navigateToLoginRequestUrl: false
  }
};
const OAUTH2_SCOPES = ["openid", "Sites.ReadWrite.All", "Files.ReadWrite"];

const msalInstance = new MSAL.PublicClientApplication(OAUTH2_CONFIG);

export const authorizeAtOpenIdProvider = () =>
  msalInstance.loginPopup({scopes: OAUTH2_SCOPES});

export const fetchAccountInfoFromRemote = (accessToken, sendEvent) =>
  sendEvent("login", { accessToken })
    .then((message) => {
      const accountInstances = Object.values(message.body.account || {});
      const accountInfo = accountInstances && accountInstances[0];
      if (!accountInfo) {
        throw new Error("message.body.account is not present");
      }
      return accountInfo;
    });