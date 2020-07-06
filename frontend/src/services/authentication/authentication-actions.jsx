import { createAction, createReducer } from "@reduxjs/toolkit";
import { of, merge } from "rxjs";
import { flatMap, map, filter, distinctUntilChanged, switchMap } from "rxjs/operators";
import { ofType } from "redux-observable";
import { reducerRegistry } from "../../redux/reducerRegistry";
import { epicRegistry } from "../../redux/epicRegistry";
import { replaceSafeContent, fetchCvByAccountId as fetchCvByAccountId } from "../safe/safe-actions";
import { requestToConnectEventBus, requestToDisconnectEventBus } from "../eventBus/eventBus-actions";
import { eventBusClient, EventBusConnectionStates } from "../eventBus/eventBus-services";
import { fetchAccountInfo } from "./authentication-services";

export const requestLogin = createAction("REQUET_LOGIN");
export const setLoginState = createAction("SET_LOGIN_STATE");
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

  (action$, state$) => action$.pipe(
    ofType(requestLogin.type),
    switchMap((action) => action.payload
      ? merge(
        // When requested to login then request to connect the EventBus.
        of(
          setLoginState(LoginStates.LOGGING_IN),
          requestToConnectEventBus()
        ),
        // When the EventBus is connected then fetch the accountInfo.
        state$.pipe(
          map((state) => state.eventBus.connectionState),
          distinctUntilChanged(),
          filter((connectionState) => connectionState === EventBusConnectionStates.CONNECTED),
          flatMap(() => fetchAccountInfo("authenticationCode", eventBusClient.sendEvent)), // TODO obtain authenticationCode
          flatMap((accountInfo) => of(
            setAccountInfo(accountInfo),
            setLoginState(LoginStates.LOGGED_IN),
            // Once logged in then fetch all cv data.
            fetchCvByAccountId(accountInfo._id)
          ))
        )
      )
      : merge(
        // When requested to logout then delete the accountInfo data and request to disconnect the EventBus.
        of(
          setLoginState(LoginStates.LOGGING_OUT),
          setAccountInfo(undefined),
          requestToDisconnectEventBus()
        ),
        // When the EventBus is disconnected then update the LoginState.
        state$.pipe(
          map((state) => state.eventBus.connectionState),
          distinctUntilChanged(),
          filter((connectionState) => connectionState === EventBusConnectionStates.DISCONNECTED),
          flatMap(() => of(
            setLoginState(LoginStates.LOGGED_OUT),
            // Once logged out then erase the cv data.
            replaceSafeContent(undefined)
          ))
        )
      ))
  )
);