import { map, filter, distinctUntilChanged, ignoreElements, take, mergeMap, tap, debounceTime } from "rxjs/operators";
import { fromEvent, of } from "rxjs";
import { ofType } from "redux-observable";
import * as authActions from "../auth/auth-actions";
import * as uiActions from "./ui-actions";
import * as uiServices from "./ui-services";

export const uiEpics = [
  // Keep track of location (address bar) changes.
  () => fromEvent(window, "hashchange").pipe(
    map(event => uiActions.setLocationHash(event.target.location.hash || ""))
  ),

  // Delete all selections on logout.
  (_, state$) => state$.pipe(
    map(state => state.auth?.loginState),
    distinctUntilChanged(),
    filter(loginState => loginState === authActions.LoginStates.LOGGED_OUT),
    map(() => uiActions.resetSelectedIds({}))
  ),

  // Select the account who'se AccountInfo is retrieved.
  (action$, state$) => action$.pipe(
    ofType(authActions.setAuthInfo.type),
    map(action => action.payload?.accountId),
    filter(accountId => accountId !== state$.value.ui?.selectedId?.account),
    map(accountId => uiActions.setSelectedId("account", accountId))
  ),

  // Reset all selected ids if the selected accountId changes.
  (action$, state$) => action$.pipe(
    ofType(uiActions.setSelectedId.type),
    map(action => action.payload),
    filter(payload => payload.entityName === "account"),
    map(payload => payload.selectedId),
    debounceTime(50), // When changing the selection in a DetailsList, the selection is first set to undefined and then to the new value.
    distinctUntilChanged(),
    map(accountId => {
      const cvEntity = state$.value.safe?.content?.cv;
      const cvInstance = cvEntity && Object.values(cvEntity)
        .find(cvInstance => cvInstance.accountId === accountId);
      const [entityName, selectedId] = state$.value.ui.locationHash.split("=");
      return uiActions.resetSelectedIds({
        account: accountId,
        cv: cvInstance?._id,
        [entityName.substr(1)]: selectedId
      });
    })
  ),

  // Add the selected id to the URL-hash in the address bar.
  (action$, state$) => action$.pipe(
    ofType(uiActions.setSelectedId.type),
    map(action => action.payload),
    filter(payload => state$.value.ui?.locationHash?.includes(payload.entityName)),
    filter(payload => state$.value.auth?.authInfo?.accountId !== payload.selectedId),
    distinctUntilChanged(),
    tap(payload => {
      const hash = state$.value.ui.locationHash.split("=")[0];
      window.location.hash = payload.selectedId
        ? `${hash}=${payload.selectedId}`
        : hash;
    }),
    ignoreElements()
  ),

  // Apply the selected theme and store it in localStorage.
  (action$) => action$.pipe(
    ofType(uiActions.setTheme.type),
    map(action => action.payload),
    map(themeName => {
      uiServices.loadThemeByName(themeName);
      window.localStorage.setItem("theme", themeName);
    }),
    ignoreElements()
  ),

  // Read the preferred theme from a cookie. This is done only once, when the app starts.
  // NOTE - this epic must be added last, otherwise the returned actions may not be noticed by other epics.
  (_, state$) => state$.pipe(
    take(1),
    mergeMap(() => {
      const userPrefs = uiServices.initializeUI();
      return of(
        uiActions.setLocale(userPrefs.locale),
        uiActions.setTheme(userPrefs.theme)
      );
    })
  )
];