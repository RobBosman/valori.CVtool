import { setLastError, ErrorSources } from "./error-actions";
import { fromEvent } from "rxjs";
import * as rx from "rxjs/operators";

export const errorEpics = [
  // Keep track of windows 'error' events.
  () => fromEvent(window, "error").pipe(
    rx.map((event) => event.error?.message),
    rx.filter((errorMessage) => errorMessage),
    rx.map((errorMessage) => setLastError(`Onbekende fout: ${errorMessage}`, ErrorSources.windowErrorEvent))
  )
];