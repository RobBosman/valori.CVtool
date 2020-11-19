import { map, filter, distinctUntilChanged } from "rxjs/operators";
import { fromEvent } from "rxjs";
import { ofType } from "redux-observable";
import * as authActions from "../auth/auth-actions";
import * as uiActions from "./ui-actions";

export const uiEpics = [
  // Keep track of location (address bar) changes.
  () => fromEvent(window, "hashchange").pipe(
    map(() => uiActions.setLocationHash(document.location.hash || ""))
  ),

  // Delete selections on logout.
  (_, state$) => state$.pipe(
    map(state => state.auth.loginState),
    distinctUntilChanged(),
    filter(loginState => loginState === authActions.LoginStates.LOGGED_OUT),
    map(() => uiActions.resetSelectedIds())
  ),

  // Select the account who'se AccountInfo is retrieved.
  (action$) => action$.pipe(
    ofType(authActions.setAuthInfo.type),
    map(action => action.payload),
    map(authInfo => uiActions.setSelectedId("account", authInfo?.accountId))
  ),

  // Reset the se;ected cvId if the selected accountId changes.
  (action$, state$) => action$.pipe(
    ofType(uiActions.setSelectedId.type),
    map(action => action.payload),
    filter(payload => payload.entityName === "account"),
    map(payload => payload.selectedId),
    distinctUntilChanged(),
    map(accountId => {
      const cvEntity = state$.value.safe?.content?.cv;
      const cvInstance = cvEntity && Object.values(cvEntity)
        .find(cvInstance => cvInstance.accountId === accountId);
      return uiActions.setSelectedId("cv", cvInstance?._id);
    })
  )
];