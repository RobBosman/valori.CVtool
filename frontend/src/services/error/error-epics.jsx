import { setLastError } from "./error-actions";
import { fromEvent } from "rxjs";
import { map, tap, delay, ignoreElements } from "rxjs/operators";

export const errorEpics = [
  // Keep windows 'error' events.
  () => fromEvent(window, "error").pipe(
    tap((event) => {
      console.log("errorEpics.error", event);
      return event;
    }),
    delay(100),
    tap((event) => event.preventDefault()),
    map((event) => setLastError(event.error.message)),
    ignoreElements()
  )
];