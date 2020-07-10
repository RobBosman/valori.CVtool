import { createAction, createReducer } from "@reduxjs/toolkit";
import { of, merge } from "rxjs";
import { mergeMap, map, switchMap, filter } from "rxjs/operators";
import { ofType } from "redux-observable";
import { reducerRegistry } from "../../redux/reducerRegistry";
import { epicRegistry } from "../../redux/epicRegistry";
import { requestEventBusConnection } from "../eventBus/eventBus-actions";
import { EventBusConnectionStates, eventBusClient } from "../eventBus/eventBus-services";
import { replaceSafeContent, fetchCvByAccountId } from "../safe/safe-actions";
import { fetchAccountInfoFromRemote } from "../authentication/authentication-services";

export const requestLogin = createAction("REQUEST_LOGIN");
export const setLoginState = createAction("SET_LOGIN_STATE");
export const fetchAccountInfo = createAction("FETCH_ACCOUNT_INFO");
export const eraseAccountInfo = createAction("ERASE_ACCOUNT_INFO");
export const setAccountInfo = createAction("SET_ACCOUNT_INFO");

export const LoginStates = {
  LOGGED_OUT: "LOGGED_OUT",
  LOGGING_IN: "LOGGING_IN",
  LOGGED_IN: "LOGGED_IN",
  LOGGING_OUT: "LOGGING_OUT"
};

reducerRegistry.register(
  "authentication",
  createReducer(
    {
      loginState: LoginStates.LOGGED_OUT
    },
    {
      [setLoginState]: (state, action) => {
        state.loginState = action.payload;
      },
      [setAccountInfo]: (state, action) => {
        state.accountInfo = action.payload;
      }
    }
  )
);

epicRegistry.register(

  // Handle requests to login/out.
  (action$) => action$.pipe(
    ofType(requestLogin.type),
    switchMap((action) => action.payload
      ? of(
        // When requested to login then fetch the accountInfo data.
        setLoginState(LoginStates.LOGGING_IN),
        fetchAccountInfo("authorizationCode") // TODO obtain authorizationCode
      )
      : of(
        // When requested to logout then delete the accountInfo data.
        setLoginState(LoginStates.LOGGING_OUT),
        eraseAccountInfo()
      )
    )
  ),

  // Fetch the accountInfo. But first ensure the EventBus is connected.
  (action$) => action$.pipe(
    ofType(fetchAccountInfo.type),
    map((action) => action.payload),
    switchMap((authorizationCode) => eventBusClient.getConnectionState() === EventBusConnectionStates.CONNECTED
      ? of(authorizationCode).pipe(
        mergeMap(() => fetchAccountInfoFromRemote(authorizationCode, eventBusClient.sendEvent)),
        map((accountInfo) => setAccountInfo(accountInfo))
      )
      : merge(
        of(requestEventBusConnection(true)),
        // When the EventBus is connected then fetch the accountInfo data from remote.
        eventBusClient.monitorConnectionState().pipe(
          filter((connectionState) => connectionState === EventBusConnectionStates.CONNECTED),
          mergeMap(() => fetchAccountInfoFromRemote(authorizationCode, eventBusClient.sendEvent)),
          map((accountInfo) => setAccountInfo(accountInfo))
        )
      )
    )
  ),

  // Erase the accountInfo and close the EventBus connection.
  (action$) => action$.pipe(
    ofType(eraseAccountInfo.type),
    map((action) => action.payload),
    mergeMap(() => of(
      setAccountInfo(undefined),
      requestEventBusConnection(false)
    ))
  ),

  // Store or clear the accountInfo (and other data).
  (action$) => action$.pipe(
    ofType(setAccountInfo.type),
    map((action) => action.payload?._id),
    switchMap((accountId) => accountId
      ? of(
        setLoginState(LoginStates.LOGGED_IN),
        // Once logged in then fetch the cv data.
        fetchCvByAccountId(accountId)
      )
      : of(
        setLoginState(LoginStates.LOGGED_OUT),
        // Once logged out then erase the cv data.
        replaceSafeContent(undefined)
      )
    )
  )
);