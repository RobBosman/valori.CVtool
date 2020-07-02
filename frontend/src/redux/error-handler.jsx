import { store } from "./store";
import { setWindowError } from "./error-actions";

window.addEventListener("unhandledrejection", (event) => {
  console.error(`Uncaught error in Promise - ${JSON.stringify(event)}`);
  store.dispatch(setWindowError(event));
});
  
window.addEventListener("error", (event) => {
  console.error(`Uncaught error - ${JSON.stringify(event)}`);
  store.dispatch(setWindowError(event));
});