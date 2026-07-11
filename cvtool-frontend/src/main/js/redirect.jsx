import {broadcastResponseToMainFrame} from "@azure/msal-browser/redirect-bridge";

try {
  await broadcastResponseToMainFrame();
} catch (error) {
  console.error("Error broadcasting MSAL response:", error);
}