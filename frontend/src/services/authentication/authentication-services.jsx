import * as MSAL from "@azure/msal-browser";

const OAUTH2_CONFIG = {
  auth: {
    clientId: "57e3b5d5-d7d6-40db-850b-5947ea1f2209",
    authority: "https://login.microsoftonline.com/b44ed446-bdd4-46ab-a5b3-95ccdb7d4663",
    redirectUri: "http://localhost:8080/",
    navigateToLoginRequestUrl: false
  }
};
const OAUTH2_SCOPES = ["openid", "Sites.ReadWrite.All", "Files.ReadWrite"];

const msalInstance = new MSAL.PublicClientApplication(OAUTH2_CONFIG);

export const authorizeAtOpenIdProvider = () =>
  msalInstance.loginPopup({scopes: OAUTH2_SCOPES});

export const fetchAccountInfoFromRemote = (sendEvent) =>
  sendEvent("authenticate", {})
    .then((message) => {
      const accountInfo = message.body.accountInfo;
      if (!accountInfo) {
        throw new Error("Authentication error: message.body contains no accountInfo");
      }
      return accountInfo;
    });