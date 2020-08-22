import { reducerRegistry } from "../../../redux/reducerRegistry";
import * as authenticationActions from "../authentication-actions";

describe("authentication-actions.test", () => {

  const reducer = reducerRegistry.getRootReducer();

  it("should reduce confirmLoggingIn OpenID", () => {
    const state = reducer(undefined, authenticationActions.setLoginState(authenticationActions.LoginStates.LOGGING_IN_OPENID));
    expect(state.authentication.loginState)
      .toBe(authenticationActions.LoginStates.LOGGING_IN_OPENID);
  });

  it("should reduce confirmLoggingIn Backend", () => {
    const state = reducer(undefined, authenticationActions.setLoginState(authenticationActions.LoginStates.LOGGING_IN_BACKEND));
    expect(state.authentication.loginState)
      .toBe(authenticationActions.LoginStates.LOGGING_IN_BACKEND);
  });

  it("should reduce confirmLoggedIn", () => {
    const state = reducer(undefined, authenticationActions.setLoginState(authenticationActions.LoginStates.LOGGED_IN));
    expect(state.authentication.loginState)
      .toBe(authenticationActions.LoginStates.LOGGED_IN);
  });

  it("should reduce confirmLoggingOut", () => {
    const state = reducer(undefined, authenticationActions.setLoginState(authenticationActions.LoginStates.LOGGING_OUT));
    expect(state.authentication.loginState)
      .toBe(authenticationActions.LoginStates.LOGGING_OUT);
  });

  it("should reduce confirmLoggedOut", () => {
    const state = reducer(undefined, authenticationActions.setLoginState(authenticationActions.LoginStates.LOGGED_OUT));
    expect(state.authentication.loginState)
      .toBe(authenticationActions.LoginStates.LOGGED_OUT);
  });

  it("should reduce setAccountInfo", () => {
    const dummyAccount = { _id: 313, name: "Duck" };
    const state = reducer(undefined, authenticationActions.setAccountInfo(dummyAccount));
    expect(state.authentication.accountInfo)
      .toStrictEqual(dummyAccount);
  });
});
