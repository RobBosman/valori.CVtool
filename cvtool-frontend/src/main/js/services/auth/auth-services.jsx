import * as MSAL from "@azure/msal-browser";

const TENANT = {
  tenantId: "3d75b784-24a4-48cd-8149-36d9fc6f64d2",
  clientId: "2eb48338-41d2-4578-98ab-1466b7baad5f"
};

const getOAuthConfig = tenant => ({
  auth: {
    authority: `https://login.microsoftonline.com/${tenant.tenantId}`,
    clientId: tenant.clientId,
    redirectUri: window.location.origin + "/redirect"
  },
  cache: {
    cacheLocation: "localStorage"
  }
});

const msalPCA = await MSAL.createStandardPublicClientApplication(getOAuthConfig(TENANT));

export const clearLocalAccountCache = () =>
  msalPCA.clearCache();

export const authenticateAtOpenIdProvider = (forceRefresh = false, readUserProfile = false) => {
  const cachedAccount = msalPCA.getAllAccounts()?.find(account => account.tenantId === TENANT.tenantId);
  const loginConfig = {
    scopes: readUserProfile ? ["openid", "User.Read"] : ["openid"]
  };

  return (!cachedAccount || (forceRefresh && readUserProfile))
    ? msalPCA.acquireTokenPopup(loginConfig)
    : msalPCA.acquireTokenSilent({ ...loginConfig, forceRefresh: forceRefresh })
      .catch(error => {
        if (cachedAccount && error instanceof MSAL.InteractionRequiredAuthError) {
          console.warn("Error acquiring silent token:", error);
          // Fallback to interaction mode when silent call fails.
          return msalPCA.acquireTokenPopup(loginConfig);
        } else {
          console.error("Error acquiring token:", error);
          throw new Error(`Error acquiring token: ${error.message}`);
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
  
