import { reducerRegistry } from "../../../redux/reducerRegistry";
import { LoginStates, requestToLogin, confirmLoggingIn, confirmLoggedIn, requestToLogout, confirmLoggingOut, confirmLoggedOut, setAccount } from "../authentication-actions";

describe("authentication", () => {

  const reducer = reducerRegistry.getRootReducer();

  it("should reduce requestToLogin", () => {
    const state = reducer(undefined, requestToLogin());
    expect(state.authentication.loginState).toBe(LoginStates.REQUESTED_TO_LOGIN);
  });

  it("should reduce confirmLoggingIn", () => {
    const state = reducer(undefined, confirmLoggingIn());
    expect(state.authentication.loginState).toBe(LoginStates.LOGGING_IN);
  });

  it("should reduce confirmLoggedIn", () => {
    const state = reducer(undefined, confirmLoggedIn());
    expect(state.authentication.loginState).toBe(LoginStates.LOGGED_IN);
  });

  it("should reduce requestToLogout", () => {
    const state = reducer(undefined, requestToLogout());
    expect(state.authentication.loginState).toBe(LoginStates.REQUESTED_TO_LOGOUT);
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
