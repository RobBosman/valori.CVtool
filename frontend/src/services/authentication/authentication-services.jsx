import * as MSAL from "@azure/msal-browser";

const OAUTH2_CONFIG = {
  auth: {
    authority: "https://login.microsoftonline.com/b44ed446-bdd4-46ab-a5b3-95ccdb7d4663",
    clientId: "348af39a-f707-4090-bb0a-9e4dca6e4138",
    domainHint: "valori.nl",
    redirectUri: window.location.origin,
    navigateToLoginRequestUrl: false
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge.
  }
};
const LOGIN_CONFIG = {
  scopes: ["openid", "Sites.ReadWrite.All", "Files.ReadWrite"],
  forceRefresh: false // Set this to "true" to skip a cached token and go to the server to get a new token.
};

const msal = new MSAL.PublicClientApplication(OAUTH2_CONFIG);

export const authorizeAtOpenIdProvider = () => {
  const allAccounts = msal.getAllAccounts();
  if (allAccounts?.length > 0) {
    const loginConfig = {
      ...LOGIN_CONFIG,
      account: allAccounts[0]
    };
    return msal
      .acquireTokenSilent(loginConfig)
      .catch((error) => {
        if (error instanceof MSAL.InteractionRequiredAuthError) {
          // fallback to interaction when silent call fails
          return msal.acquireTokenPopup(loginConfig);
        } else {
          console.warn(error);
          return Promise.resolve();
        }
      });
  } else {
    return msal.acquireTokenPopup(LOGIN_CONFIG);
  }
};

export const fetchAccountInfoFromRemote = (sendEvent) =>
  sendEvent("authInfo.fetch", {})
    .then((message) => {
      const accountInfo = message.body.accountInfo;
      if (!accountInfo) {
        throw new Error("Authentication error: message.body contains no accountInfo");
      }
      return accountInfo;
    });