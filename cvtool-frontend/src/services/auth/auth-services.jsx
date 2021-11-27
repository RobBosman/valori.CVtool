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
  scopes: ["openid"],
  forceRefresh: false // Set this to "true" to skip a cached token and go to the backend server to get a new token.
};

const msal = new MSAL.PublicClientApplication(OAUTH2_CONFIG);

export const authenticateAtOpenIdProvider = () => {
  const allAccounts = msal.getAllAccounts();
  const cachedAccount = allAccounts && allAccounts[0];
  const loginConfig = {
    ...LOGIN_CONFIG,
    account: cachedAccount
  };

  // Check if the cached token is still valid.
  const expirationDate = new Date("1970-01-01T00:00:00.000+00:00"); // Epoch, t = 0.
  expirationDate.setSeconds(cachedAccount?.idTokenClaims?.exp || 0);
  if (expirationDate > new Date()) {
    return msal
      .acquireTokenSilent(loginConfig)
      .catch((error) => {
        if (error instanceof MSAL.InteractionRequiredAuthError) {
          // Fallback to interaction mode when silent call fails.
          return msal.acquireTokenPopup(loginConfig);
        } else {
          console.warn(error);
          return Promise.resolve();
        }
      });
  } else {
    return msal.acquireTokenPopup(loginConfig);
  }
};

export const fetchAuthInfoFromRemote = (authenticationResult, sendEvent) => {
  const {account} = authenticationResult;
  return sendEvent("authInfo.fetch", { email: account.username, name: account.name || account.username.split("@")[0] })
    .then((message) => {
      const authInfo = message.body;
      if (!authInfo) {
        throw new Error("Authentication error: message.body contains no authInfo");
      }
      return authInfo;
    });
};