import { createAction, createReducer } from "@reduxjs/toolkit";
import { of, merge, EMPTY } from "rxjs";
import { flatMap, map, filter, distinctUntilChanged, switchMap } from "rxjs/operators";
import { ofType } from "redux-observable";
import { reducerRegistry } from "../../redux/reducerRegistry";
import { epicRegistry } from "../../redux/epicRegistry";
import { replaceSafeContent, fetchAccountInfo, fetchCvByAccountId } from "../safe/safe-actions";
import { EventBusConnectionStates } from "../eventBus/eventBus-services";
import { requestToDisconnectEventBus } from "../eventBus/eventBus-actions";

export const requestLogin = createAction("REQUEST_LOGIN");
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
      ? of(
        // When requested to login then request to connect the EventBus.
        setLoginState(LoginStates.LOGGING_IN),
        fetchAccountInfo("authenticationCode") // TODO obtain authenticationCode
      )
      : merge(
        // When requested to logout then delete the accountInfo data and request to disconnect the EventBus.
        of(
          setLoginState(LoginStates.LOGGING_OUT),
          setAccountInfo(undefined)
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
      )
    )
  ),

  (_action$, state$) => state$.pipe(
    map((state) => state.authentication?.loginState),
    distinctUntilChanged(),
    flatMap((loginState) => {
      if (loginState === LoginStates.LOGGED_IN) {
        // Once logged in then fetch the cv data.
        return of(
          fetchCvByAccountId(state$.value.authentication.accountInfo._id)
        );
      } else if (loginState === LoginStates.LOGGED_OUT) {
        // Once logged out then erase the cv data.
        return of(
          replaceSafeContent(undefined),
          requestToDisconnectEventBus()
        );
      } else {
        return EMPTY;
      }
    })
  ),

  (action$) => action$.pipe(
    ofType(setAccountInfo.type),
    map((action) => action.payload?._id),
    map((accountId) => accountId
      ? setLoginState(LoginStates.LOGGED_IN)
      : setLoginState(LoginStates.LOGGED_OUT)
    )
  )
);