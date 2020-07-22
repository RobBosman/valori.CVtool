import { setLastError } from "./error-actions";
import { fromEvent } from "rxjs";
import { map, tap } from "rxjs/operators";

export const errorEpics = [
  // Keep track of windows 'error' events.
  () => fromEvent(window, "error").pipe(
    tap((event) => event.preventDefault()),
    map((event) => setLastError(event.error.message))
  )
];