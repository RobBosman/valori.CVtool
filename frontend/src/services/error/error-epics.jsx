import { setLastError, ErrorSources } from "./error-actions";
import { fromEvent } from "rxjs";
import { map, filter } from "rxjs/operators";

export const errorEpics = [
  // Keep track of windows 'error' events.
  () => fromEvent(window, "error").pipe(
    map((event) => event.error?.message),
    filter((errorMessage) => errorMessage),
    map((errorMessage) => setLastError(errorMessage, ErrorSources.windowErrorEvent))
  )
];