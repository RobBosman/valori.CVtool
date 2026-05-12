import { broadcastResponseToMainFrame } from "@azure/msal-browser/redirect-bridge";

broadcastResponseToMainFrame()
  .catch(error => {
    console.error("Error broadcasting MSAL response to main frame:", error);
  });
