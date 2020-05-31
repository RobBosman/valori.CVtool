import reducerRegistry from "../../../redux/reducerRegistry";
import { LoginStates, requestLogin, confirmLoggingIn, confirmLoggedIn, requestLogout, confirmLoggingOut, confirmLoggedOut, setAccount } from "../authentication-actions";

describe("authentication", () => {

  it("should reduce", () => {
    const reducer = reducerRegistry.getRootReducer();
    let state = undefined;

    state = reducer(state, requestLogin());
    expect(state.authentication.loginState).toBe(LoginStates.REQUESTED_LOGIN);

    state = reducer(state, confirmLoggingIn());
    expect(state.authentication.loginState).toBe(LoginStates.LOGGING_IN);

    state = reducer(state, confirmLoggedIn());
    expect(state.authentication.loginState).toBe(LoginStates.LOGGED_IN);

    state = reducer(state, requestLogout());
    expect(state.authentication.loginState).toBe(LoginStates.REQUESTED_LOGOUT);

    state = reducer(state, confirmLoggingOut());
    expect(state.authentication.loginState).toBe(LoginStates.LOGGING_OUT);

    state = reducer(state, confirmLoggedOut());
    expect(state.authentication.loginState).toBe(LoginStates.LOGGED_OUT);

    const dummyAccount = { _id: 313, name: "Duck" };
    state = reducer(state, setAccount(dummyAccount));
    expect(state.authentication.account).toStrictEqual(dummyAccount);
  });
});
