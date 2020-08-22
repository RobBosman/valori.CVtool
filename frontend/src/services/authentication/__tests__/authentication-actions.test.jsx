import { reducerRegistry } from "../../../redux/reducerRegistry";
import * as authenticationActions from "../authentication-actions";

describe("authentication-actions.test", () => {

  const reducer = reducerRegistry.getRootReducer();

  it("should reduce confirmLoggingIn", () => {
    const state = reducer(undefined, authenticationActions.setLoginState(authenticationActions.LoginStates.LOGGING_IN));
    expect(state.authentication.loginState)
      .toBe(authenticationActions.LoginStates.LOGGING_IN);
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
