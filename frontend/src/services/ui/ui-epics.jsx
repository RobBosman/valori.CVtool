import { map, filter, distinctUntilChanged, ignoreElements, take, mergeMap, skip, tap } from "rxjs/operators";
import { EMPTY, fromEvent, of } from "rxjs";
import { ofType } from "redux-observable";
import * as authActions from "../auth/auth-actions";
import * as safeActions from "../safe/safe-actions";
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
    skip(1), // Ignore the first time, when starting the app.
    filter(loginState => loginState === authActions.LoginStates.LOGGED_OUT),
    map(() => uiActions.resetSelectedIds({}))
  ),

  // Select the account whose AccountInfo is retrieved.
  (action$) => action$.pipe(
    ofType(authActions.setAuthInfo.type),
    map(action => action.payload?.accountId),
    filter(accountId => accountId),
    map(accountId => uiActions.setSelectedId("account", accountId))
  ),

  // Reset all selected ids when switching to another account.
  (action$, state$) => action$.pipe(
    ofType(uiActions.setSelectedId.type),
    map(action => action.payload),
    filter(payload => payload.entityName === "account"),
    map(payload => payload.selectedId),
    distinctUntilChanged(),
    map(accountId => {
      const cvEntity = state$.value.safe?.content?.cv;
      const cvInstance = Object.values(cvEntity || {})
        .find(cvInstance => cvInstance.accountId === accountId);
      return uiActions.resetSelectedIds({
        account: accountId,
        cv: cvInstance?._id
      });
    })
  ),

  // Select the locationHash-instanceId when receiving cv data.
  (action$) => action$.pipe(
    ofType(safeActions.resetEntities.type),
    map(action => action.payload),
    filter(entities => entities?.cv), // Only proceed when receiving cv instances.
    mergeMap(entities => {
      const [hash, instanceId] = window.location.hash?.split("=");
      const entityName = Object.keys(entities).find(entityName => hash.includes(entityName));
      return entityName && instanceId
        ? of(uiActions.setSelectedId(entityName, instanceId))
        : EMPTY;
    })
  ),

  // Add the selected id to the URL-hash in the address bar.
  (action$, state$) => action$.pipe(
    ofType(uiActions.setSelectedId.type),
    map(action => action.payload),
    filter(payload => state$.value.ui?.locationHash?.includes(payload.entityName)), // Only if the id's entity is in the URL-hash.
    map(payload => payload.selectedId || ""),
    tap(selectedId => {
      const selectedAccountId = state$.value.ui?.selectedId?.account || "";
      const ownAccountId = state$.value.auth?.authInfo?.accountId || "";
      let hash = state$.value.ui.locationHash.split("=")[0];
      if (selectedAccountId && selectedAccountId !== selectedId && selectedAccountId !== ownAccountId)
        hash = `${hash}=${selectedId}=${selectedAccountId}`;
      else if (selectedId && selectedId !== ownAccountId)
        hash = `${hash}=${selectedId}`;
      window.location.hash = hash;
    }),
    ignoreElements()
  ),

  // Hide the CvHistoryView dialog if the selectedAccountId or selectedCvId changed.
  (action$) => action$.pipe(
    ofType(uiActions.setSelectedId.type),
    map(action => action.payload),
    filter(payload => ["account", "cv"].includes(payload.entityName)),
    map(() => uiActions.setHistoryViewVisible(false))
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