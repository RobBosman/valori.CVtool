import { epicRegistry } from "../redux/epicRegistry";
import { tap, switchMap } from "rxjs/operators";
import { EMPTY } from "rxjs";

/**
 * A utility function to deliberately 'inject' a delay of (by default) 1000 milliseconds.
 * This is to show/exaggerate the impact of slow performing code.
 * @param remark - will be shown in debug
 * @param waitMillis - delay in milliseconds
 */
export const heavyWait = (remark = "", waitMillis = 1000) => {
  if (waitMillis > 0) {
    console.debug(`    ${remark} - waiting ${waitMillis} ms...`);
    let now = new Date().getTime();
    const end = now + waitMillis;
    while (now < end) {
      now = new Date().getTime();
    }
  }
};

epicRegistry.register([
  (actions$) => actions$.pipe(
    // tap((action) => console.debug("dispatched action: ", action)),
    tap((action) => heavyWait(action.type, 0)),
    switchMap(() => EMPTY)
  )
]);