import * as MSAL from "@azure/msal-browser";
import { fetchAllInstances } from "../safe/safe-actions";

const TENANTS = {
  CERIOS: {
    tenantId: "3d75b784-24a4-48cd-8149-36d9fc6f64d2",
    clientId: "2eb48338-41d2-4578-98ab-1466b7baad5f",
    domainHint: "cerios.nl"
  },
  VALORI: {
    tenantId: "b44ed446-bdd4-46ab-a5b3-95ccdb7d4663",
    clientId: "348af39a-f707-4090-bb0a-9e4dca6e4138",
    domainHint: "valori.nl"
  }
};

const getOAuthConfig = tenant => ({
  auth: {
    authority: `https://login.microsoftonline.com/${tenant.tenantId}`,
    clientId: tenant.clientId,
    domainHint: tenant.domainHint,
    redirectUri: window.location.origin,
    navigateToLoginRequestUrl: false
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: fetchAllInstances
  }
});

const msalCerios = await MSAL.createNestablePublicClientApplication(getOAuthConfig(TENANTS.CERIOS));
const msalValori = await MSAL.createNestablePublicClientApplication(getOAuthConfig(TENANTS.VALORI));

export const clearLocalAccountCache = () =>
  msalCerios.clearCache();

export const authenticateAtOpenIdProvider = (forceRefresh = false, readUserProfile = false) => {
  const msal = msalCerios;
  const allCachedAccounts = msal.getAllAccounts();
  const cachedAccount = allCachedAccounts?.find(account => account.tenantId == TENANTS.CERIOS.tenantId);
  const loginConfig = {
    account: cachedAccount,
    forceRefresh: forceRefresh,
    scopes: readUserProfile ? ["openid", "User.Read"] : ["openid"]
  };

  return (!cachedAccount || (forceRefresh && readUserProfile))
    ? msal.acquireTokenPopup(loginConfig)
    : msal.acquireTokenSilent(loginConfig)
      .catch(error => {
        if (cachedAccount && error instanceof MSAL.InteractionRequiredAuthError) {
          console.warn("Error acquiring silent token:", error);
          // Fallback to interaction mode when silent call fails.
          return msal.acquireTokenPopup(loginConfig);
        } else {
          console.error("Error acquiring token:", error);
          return Promise.reject(new Error(`Error acquiring token: ${error.message}`));
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
  fetch("https://graph.microsoft.com/v1.0/me/photo/$value", { headers: { Authorization: `Bearer ${accessToken}` } })
    .then(response => response.blob())
    .then(responseBlob =>
      new Promise((resolve, reject) => {
        try {
          const reader = new FileReader();
          reader.readAsDataURL(responseBlob);
          reader.onloadend = () => resolve(reader.result);
        } catch (error) {
          reject(new Error(`Error obtaining profile photo: ${error.message}`));
        }
      })
    );
  
