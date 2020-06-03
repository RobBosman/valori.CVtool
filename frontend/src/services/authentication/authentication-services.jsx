import { Observable } from "rxjs";
import { setAccount, LoginStates, confirmLoggingIn, confirmLoggedIn } from "./authentication-actions";
import { EventBusConnectionStates } from "../eventBus/eventBus-actions";

export const loginToRemote = (state, sendEvent) =>
  new Observable((subscriber) => {
    if (state.authentication.loginState === LoginStates.REQUESTED_LOGIN
      && state.eventBus.connectionState === EventBusConnectionStates.CONNECTED) {
      subscriber.next(confirmLoggingIn());
      sendEvent("login", { authenticationCode: "My AuthCode" }) // TODO obtain authentication code
        .then((message) => mapLoggedInResponse(message))
        .then((action) => subscriber.next(action))
        .then(() => subscriber.next(confirmLoggedIn()))
        .then(() => subscriber.complete())
        .catch((error) => subscriber.error(error));
    } else {
      subscriber.complete();
    }
  });

const mapLoggedInResponse = (message) => {
  const accountInstances = Object.values(message.body.account || {});
  const account = accountInstances && accountInstances[0];
  if (!account) {
    throw new Error("message.body.account is not present");
  }
  console.debug("You successfully logged in", message);
  return setAccount(account);
};