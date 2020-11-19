import { reducerRegistry } from "../../../redux/reducerRegistry";
import * as authActions from "../auth-actions";

describe("auth-actions.test", () => {

  const reducer = reducerRegistry.getRootReducer();

  it("should reduce confirmLoggingIn OpenID", () => {
    const state = reducer(undefined, authActions.setLoginState(authActions.LoginStates.LOGGING_IN_OPENID));
    expect(state.auth.loginState)
      .toBe(authActions.LoginStates.LOGGING_IN_OPENID);
  });

  it("should reduce confirmLoggingIn Backend", () => {
    const state = reducer(undefined, authActions.setLoginState(authActions.LoginStates.LOGGING_IN_BACKEND));
    expect(state.auth.loginState)
      .toBe(authActions.LoginStates.LOGGING_IN_BACKEND);
  });

  it("should reduce confirmLoggedIn", () => {
    const state = reducer(undefined, authActions.setLoginState(authActions.LoginStates.LOGGED_IN));
    expect(state.auth.loginState)
      .toBe(authActions.LoginStates.LOGGED_IN);
  });

  it("should reduce confirmLoggingOut", () => {
    const state = reducer(undefined, authActions.setLoginState(authActions.LoginStates.LOGGING_OUT));
    expect(state.auth.loginState)
      .toBe(authActions.LoginStates.LOGGING_OUT);
  });

  it("should reduce confirmLoggedOut", () => {
    const state = reducer(undefined, authActions.setLoginState(authActions.LoginStates.LOGGED_OUT));
    expect(state.auth.loginState)
      .toBe(authActions.LoginStates.LOGGED_OUT);
  });

  it("should reduce setAuthInfo", () => {
    const dummyAccount = { _id: 313, name: "Duck" };
    const state = reducer(undefined, authActions.setAuthInfo(dummyAccount));
    expect(state.auth.authInfo)
      .toStrictEqual(dummyAccount);
  });
});
