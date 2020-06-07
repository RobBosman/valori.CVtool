import reducerRegistry from "../../../redux/reducerRegistry";
import { LoginStates, requestLogin, confirmLoggingIn, confirmLoggedIn, requestLogout, confirmLoggingOut, confirmLoggedOut, setAccount } from "../authentication-actions";

describe("authentication", () => {

  const reducer = reducerRegistry.getRootReducer();

  it("should reduce requestLogin", () => {
    const state = reducer(undefined, requestLogin());
    expect(state.authentication.loginState).toBe(LoginStates.REQUESTED_LOGIN);
  });

  it("should reduce confirmLoggingIn", () => {
    const state = reducer(undefined, confirmLoggingIn());
    expect(state.authentication.loginState).toBe(LoginStates.LOGGING_IN);
  });

  it("should reduce confirmLoggedIn", () => {
    const state = reducer(undefined, confirmLoggedIn());
    expect(state.authentication.loginState).toBe(LoginStates.LOGGED_IN);
  });

  it("should reduce requestLogout", () => {
    const state = reducer(undefined, requestLogout());
    expect(state.authentication.loginState).toBe(LoginStates.REQUESTED_LOGOUT);
  });

  it("should reduce confirmLoggingOut", () => {
    const state = reducer(undefined, confirmLoggingOut());
    expect(state.authentication.loginState).toBe(LoginStates.LOGGING_OUT);
  });

  it("should reduce confirmLoggedOut", () => {
    const state = reducer(undefined, confirmLoggedOut());
    expect(state.authentication.loginState).toBe(LoginStates.LOGGED_OUT);
  });

  it("should reduce setAccount", () => {
    const dummyAccount = { _id: 313, name: "Duck" };
    const state = reducer(undefined, setAccount(dummyAccount));
    expect(state.authentication.account).toStrictEqual(dummyAccount);
  });
});
