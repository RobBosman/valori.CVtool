import { replaceSafeContent } from "../safe-actions";
import { createId, fetchCvFromRemote, saveAllToRemote } from "../safe-services";

describe("safe", () => {

  const sendEventSuccess = (eventName) => new Promise((resolve) => resolve({ body: `${eventName}_resolved` }));
  const sendEventError = (eventName) => new Promise((_resolve, reject) => reject({ body: `${eventName}_rejected` }));

  it("should fetchCvFromRemote success", () => {
    expect.assertions(2);
    const state = { authentication: { account: {} } };
    return new Promise((resolveTest, rejectTest) => {
      const actions = [];
      fetchCvFromRemote(state, sendEventSuccess)
        .subscribe(
          (action) => actions.push(action),
          (error) => rejectTest(error),
          () => {
            expect(actions.length).toBe(1);
            expect(actions[0]).toStrictEqual(replaceSafeContent("fetch.cv_resolved"));
            resolveTest();
          }
        );
    });
  });

  it("should fetchCvFromRemote error state", () => {
    expect.assertions(2);
    return new Promise((resolveTest, rejectTest) => {
      const actions = [];
      fetchCvFromRemote({}, sendEventSuccess)
        .subscribe(
          (action) => actions.push(action),
          (error) => {
            expect(actions.length).toBe(0);
            expect(error).toStrictEqual("authentication.account is not present");
            resolveTest();
          },
          () => rejectTest()
        );
    });
  });

  it("should fetchCvFromRemote error response", () => {
    expect.assertions(2);
    const state = { authentication: { account: {} } };
    return new Promise((resolveTest, rejectTest) => {
      const actions = [];
      fetchCvFromRemote(state, sendEventError)
        .subscribe(
          (action) => actions.push(action),
          (error) => {
            expect(actions.length).toBe(0);
            expect(error).toStrictEqual({ body: "fetch.cv_rejected" });
            resolveTest();
          },
          () => rejectTest()
        );
    });
  });

  it("should saveAllToRemote success", () => {
    expect.assertions(1);
    return new Promise((resolveTest, rejectTest) => {
      const actions = [];
      saveAllToRemote({}, sendEventSuccess)
        .subscribe(
          (action) => actions.push(action),
          (error) => rejectTest(error),
          () => {
            expect(actions.length).toBe(0);
            resolveTest();
          }
        );
    });
  });

  it("should saveAllToRemote error", () => {
    expect.assertions(1);
    return new Promise((resolveTest, rejectTest) => {
      const actions = [];
      saveAllToRemote({}, sendEventError)
        .subscribe(
          (action) => actions.push(action),
          (error) => {
            expect(actions.length).toBe(0);
            resolveTest(error);
          },
          () => rejectTest()
        );
    });
  });

  it("should create unique id", () => {
    const id0 = createId();
    expect(id0.length).toBe(36);
    expect(id0.replace(/-/g, "").length).toBe(32);

    const id1 = createId();
    expect(id1.length).toBe(36);
    expect(id1.replace(/-/g, "").length).toBe(32);
    expect(id0).not.toBe(id1);
  });
});
