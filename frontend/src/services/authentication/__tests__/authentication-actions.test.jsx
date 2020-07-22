import { reducerRegistry } from "../../../redux/reducerRegistry";
import { LoginStates, setLoginState, setAccountInfo } from "../authentication-actions";

describe("authentication-actions", () => {

  const reducer = reducerRegistry.getRootReducer();

  it("should reduce confirmLoggingIn", () => {
    const state = reducer(undefined, setLoginState(LoginStates.LOGGING_IN));
    expect(state.authentication.loginState)
      .toBe(LoginStates.LOGGING_IN);
  });

  it("should reduce confirmLoggedIn", () => {
    const state = reducer(undefined, setLoginState(LoginStates.LOGGED_IN));
    expect(state.authentication.loginState)
      .toBe(LoginStates.LOGGED_IN);
  });

  it("should reduce confirmLoggingOut", () => {
    const state = reducer(undefined, setLoginState(LoginStates.LOGGING_OUT));
    expect(state.authentication.loginState)
      .toBe(LoginStates.LOGGING_OUT);
  });

  it("should reduce confirmLoggedOut", () => {
    const state = reducer(undefined, setLoginState(LoginStates.LOGGED_OUT));
    expect(state.authentication.loginState)
      .toBe(LoginStates.LOGGED_OUT);
  });

  it("should reduce setAccountInfo", () => {
    const dummyAccount = { _id: 313, name: "Duck" };
    const state = reducer(undefined, setAccountInfo(dummyAccount));
    expect(state.authentication.accountInfo)
      .toStrictEqual(dummyAccount);
  });
});
