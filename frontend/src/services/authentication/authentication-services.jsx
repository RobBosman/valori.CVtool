import * as MSAL from "@azure/msal-browser";

const OAUTH2_CONFIG = {
  auth: {
    authority: "https://login.microsoftonline.com/b44ed446-bdd4-46ab-a5b3-95ccdb7d4663",
    clientId: "57e3b5d5-d7d6-40db-850b-5947ea1f2209",
    domainHint: "valori.nl",
    redirectUri: "http://localhost:8080/",
    navigateToLoginRequestUrl: false
  },
  scopes: ["openid", "Sites.ReadWrite.All", "Files.ReadWrite"]
};
const OAUTH2_REFRESH_CONFIG = {
  ...OAUTH2_CONFIG,
  auth: {
    ...OAUTH2_CONFIG.auth,
    prompt: "none"
  }
};

const msalInstance = new MSAL.PublicClientApplication(OAUTH2_CONFIG);

export const authorizeAtOpenIdProvider = () =>
  msalInstance.loginPopup();

export const refreshTokenAtOpenIdProvider = (oldAuthenticationInfo) =>
  msalInstance.acquireTokenSilent({
    ...OAUTH2_REFRESH_CONFIG,
    account: oldAuthenticationInfo.account
  });

export const fetchAccountInfoFromRemote = (sendEvent) =>
  sendEvent("authenticate", {})
    .then((message) => {
      const accountInfo = message.body.accountInfo;
      if (!accountInfo) {
        throw new Error("Authentication error: message.body contains no accountInfo");
      }
      return accountInfo;
    });