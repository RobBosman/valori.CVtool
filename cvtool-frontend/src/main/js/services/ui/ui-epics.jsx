import * as rx from "rxjs/operators";
import { EMPTY, fromEvent, of } from "rxjs";
import { ofType } from "redux-observable";
import * as authActions from "../auth/auth-actions";
import * as safeActions from "../safe/safe-actions";
import * as uiActions from "./ui-actions";
import * as uiServices from "./ui-services";

export const uiEpics = [
  // Keep track of location (address bar) changes.
  () => fromEvent(window, "hashchange").pipe(
    rx.map(event => uiActions.setLocationHash(event.target.location.hash || ""))
  ),

  // Delete all selections on logout.
  (_, state$) => state$.pipe(
    rx.map(state => state.auth?.loginState),
    rx.distinctUntilChanged(),
    rx.skip(1), // Ignore the first time, when starting the app.
    rx.filter(loginState => loginState === authActions.LoginStates.LOGGED_OUT),
    rx.map(() => uiActions.resetSelectedIds({}))
  ),

  // Select the account whose AccountInfo is retrieved.
  (action$) => action$.pipe(
    ofType(authActions.setAuthInfo.type),
    rx.map(action => action.payload?.accountId),
    rx.filter(accountId => accountId),
    rx.map(accountId => uiActions.setSelectedId("account", accountId))
  ),

  // Reset all selected ids when switching to another account.
  (action$) => action$.pipe(
    ofType(uiActions.setSelectedId.type),
    rx.map(action => action.payload),
    rx.filter(payload => payload.entityName === "account"),
    rx.map(payload => payload.selectedId),
    rx.distinctUntilChanged(),
    rx.map(accountId => uiActions.resetSelectedIds({ account: accountId }))
  ),

  // Select the locationHash-instanceId when receiving cv data.
  (action$) => action$.pipe(
    ofType(safeActions.resetEntities.type),
    rx.map(action => action.payload),
    rx.filter(entities => entities?.characteristics), // Only proceed when receiving characteristics instances.
    rx.mergeMap(entities => {
      const [hash, instanceId] = window.location.hash?.split("=") || ["", null];
      const entityName = Object.keys(entities).find(entityName => hash.includes(entityName));
      return entityName && instanceId
        ? of(uiActions.setSelectedId(entityName, instanceId))
        : EMPTY;
    })
  ),

  // Add the selected id to the URL-hash in the address bar.
  (action$, state$) => action$.pipe(
    ofType(uiActions.setSelectedId.type),
    rx.map(action => action.payload),
    rx.filter(payload => state$.value.ui?.locationHash?.includes(payload.entityName)), // Only if the id's entity is in the URL-hash.
    rx.map(payload => payload.selectedId || ""),
    rx.tap(selectedId => {
      const selectedAccountId = state$.value.ui?.selectedId?.account || "";
      const ownAccountId = state$.value.auth?.authInfo?.accountId || "";
      let hash = state$.value.ui.locationHash.split("=")[0];
      if (selectedAccountId && selectedAccountId !== selectedId && selectedAccountId !== ownAccountId)
        hash = `${hash}=${selectedId}=${selectedAccountId}`;
      else if (selectedId && selectedId !== ownAccountId)
        hash = `${hash}=${selectedId}`;
      window.location.hash = hash;
    }),
    rx.ignoreElements()
  ),

  // Hide the CvHistoryView dialog if the selectedAccountId changed.
  (action$) => action$.pipe(
    ofType(uiActions.setSelectedId.type),
    rx.map(action => action.payload),
    rx.filter(payload => ["account"].includes(payload.entityName)),
    rx.map(() => uiActions.setHistoryViewVisible(false))
  ),

  // Apply the selected theme and store it in localStorage.
  (action$) => action$.pipe(
    ofType(uiActions.setTheme.type),
    rx.map(action => action.payload),
    rx.map(themeName => {
      uiServices.loadThemeByName(themeName);
      window.localStorage.setItem("theme", themeName);
    }),
    rx.ignoreElements()
  ),

  // Read the preferred theme from a cookie. This is done only once, when the app starts.
  // NOTE - this epic must be added last, otherwise the returned actions may not be noticed by other epics.
  (_, state$) => state$.pipe(
    rx.take(1),
    rx.mergeMap(() => {
      const userPrefs = uiServices.initializeUI();
      return of(
        uiActions.setLocale(userPrefs.locale),
        uiActions.setTheme(userPrefs.theme)
      );
    })
  )
];