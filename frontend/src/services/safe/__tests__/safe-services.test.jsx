import { replaceSafeContent } from "../safe-actions";
import { createId, fetchCvFromRemote, saveAllToRemote } from "../safe-services";

describe("safe", () => {

  const sendEventSuccess = (eventName) => new Promise((_resolve) => _resolve({ body: `${eventName}_resolved` }));
  const sendEventError = (eventName) => new Promise((_resolve, _reject) => _reject({ body: `${eventName}_rejected` }));

  it("should fetchCvFromRemote success", () => new Promise((_resolve, _reject) => {
    expect.assertions(2);
    const state = { authentication: { account: {} } };
    const actions = [];
    fetchCvFromRemote(state, sendEventSuccess)
      .subscribe(
        (action) => actions.push(action),
        (error) => _reject(error),
        () => {
          expect(actions.length).toBe(1);
          expect(actions[0]).toStrictEqual(replaceSafeContent("fetch.cv_resolved"));
          _resolve();
        }
      );
  }));

  it("should fetchCvFromRemote error state", () => new Promise((_resolve, _reject) => {
    expect.assertions(2);
    const actions = [];
    fetchCvFromRemote({}, sendEventSuccess)
      .subscribe(
        (action) => actions.push(action),
        (error) => {
          expect(actions.length).toBe(0);
          expect(error).toStrictEqual("authentication.account is not present");
          _resolve();
        },
        () => _reject(new Error("Unexpected complete()"))
      );
  }));

  it("should fetchCvFromRemote error response", () => new Promise((_resolve, _reject) => {
    expect.assertions(2);
    const state = { authentication: { account: {} } };
    const actions = [];
    fetchCvFromRemote(state, sendEventError)
      .subscribe(
        (action) => actions.push(action),
        (error) => {
          expect(actions.length).toBe(0);
          expect(error).toStrictEqual({ body: "fetch.cv_rejected" });
          _resolve();
        },
        () => _reject(new Error("Unexpected complete()"))
      );
  }));

  it("should saveAllToRemote success", () => new Promise((_resolve, _reject) => {
    expect.assertions(1);
    const actions = [];
    saveAllToRemote({}, sendEventSuccess)
      .subscribe(
        (action) => actions.push(action),
        (error) => _reject(error),
        () => {
          expect(actions.length).toBe(0);
          _resolve(new Error("Unexpected complete()"));
        }
      );
  }));

  it("should saveAllToRemote error", () => new Promise((_resolve, _reject) => {
    expect.assertions(1);
    const actions = [];
    saveAllToRemote({}, sendEventError)
      .subscribe(
        (action) => actions.push(action),
        (error) => {
          expect(actions.length).toBe(0);
          _resolve(error);
        },
        () => _reject(new Error("Unexpected complete()"))
      );
  }));

  it("should create unique ids", () => {
    const id0 = createId();
    expect(id0.length).toBe(36);
    expect(id0.replace(/-/g, "").length).toBe(32);

    const id1 = createId();
    expect(id1.length).toBe(36);
    expect(id1.replace(/-/g, "").length).toBe(32);
    expect(id0).not.toBe(id1);
  });
});
