import { setLastError, ErrorSources } from "./error-actions";
import { fromEvent } from "rxjs";
import * as rx from "rxjs/operators";

export const errorEpics = [
  // Keep track of windows 'error' events.
  () => fromEvent(window, "error").pipe(
    rx.map(event => event.error),
    rx.filter(error => error?.message),
    rx.map(error => setLastError(`Onbekende fout: ${error.message}`, ErrorSources.windowErrorEvent, error.stack))
  )
];