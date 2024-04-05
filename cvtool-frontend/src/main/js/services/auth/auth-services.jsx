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

const getLoginConfig = (readUserProfile) => ({
  scopes: readUserProfile ? ["openid", "User.Read"] : ["openid"],
  forceRefresh: false
});

const msal = new MSAL.PublicClientApplication(OAUTH2_CONFIG);
await msal.initialize();

export const authenticateAtOpenIdProvider = (forceRefresh = false, readUserProfile = false) => {
  const allCachedAccounts = msal.getAllAccounts();
  const cachedAccount = allCachedAccounts?.[0];
  const loginConfig = {
    ...getLoginConfig(readUserProfile),
    account: cachedAccount,
    forceRefresh: forceRefresh // Set this to "true" to skip a cached token and obtain a new one.
  };

  return (!cachedAccount)
    ? msal.acquireTokenPopup(loginConfig)
    : msal.acquireTokenSilent(loginConfig)
      .catch(error => {
        if (cachedAccount && error instanceof MSAL.InteractionRequiredAuthError) {
          console.log("Error acquiring token:", error);
          // Fallback to interaction mode when silent call fails.
          return msal.acquireTokenPopup(loginConfig);
        } else {
          console.error("Error acquiring token:", error);
          return Promise.reject(error);
        }
      });
};

export const fetchAuthInfoFromRemote = (email, name, sendEvent) =>
  sendEvent("authInfo.fetch",
    {
      email: email,
      name: name || email.split("@")[0]
    }
  )
  .then(message => {
    const authInfo = message.body;
    if (!authInfo) {
      throw new Error("Authentication error: message.body contains no authInfo");
    }
    return authInfo;
  });

  export const fetchProfilePhoto = accessToken =>
    fetch('https://graph.microsoft.com/v1.0/me/photo/$value', { headers: { Authorization: `Bearer ${accessToken}` } })
    .then(response => response.blob())
    .then(responseBlob =>
      new Promise((resolve, reject) => {
        try {
          const reader = new FileReader();
          reader.readAsDataURL(responseBlob);
          reader.onloadend = () => resolve(reader.result);
        } catch (e) {
          reject(e);
        }
      })
    );
  
