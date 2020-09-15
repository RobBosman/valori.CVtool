import * as MSAL from "@azure/msal-browser";

const OAUTH2_CONFIG = {
  auth: {
    authority: "https://login.microsoftonline.com/b44ed446-bdd4-46ab-a5b3-95ccdb7d4663",
    clientId: "57e3b5d5-d7d6-40db-850b-5947ea1f2209",
    domainHint: "valori.nl",
    redirectUri: window.location.origin,
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

const msal = new MSAL.PublicClientApplication(OAUTH2_CONFIG);

export const authorizeAtOpenIdProvider = () =>
  msal.getAllAccounts().length > 0
    ? msal
      .ssoSilent({
        ...OAUTH2_CONFIG,
        loginHint: msal.getAllAccounts()[0].username
      })
      .catch(() => msal.loginPopup())
    : msal.loginPopup();
  

export const refreshTokenAtOpenIdProvider = (oldAuthenticationInfo) =>
  msal.acquireTokenSilent({
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