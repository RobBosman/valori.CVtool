import { createUuid, fetchCvFromRemote, saveAllToRemote } from "../safe-services";

describe("safe", () => {

  const sendEventSuccess = (eventName) => new Promise((_resolve) => _resolve({ body: `${eventName}_resolved` }));
  const sendEventError = (eventName) => new Promise((_resolve, _reject) => _reject(new Error(`${eventName}_rejected`)));

  it("should fetchCvFromRemote success", () => {
    expect.assertions(1);
    return fetchCvFromRemote({}, sendEventSuccess)
      .then((action) => expect(action)
        .toBe("fetch.cv_resolved")
      );
  });

  it("should fetchCvFromRemote error response", () => {
    expect.assertions(2);
    const actions = [];
    return fetchCvFromRemote({}, sendEventError)
      .then((action) => actions.push(action))
      .catch((error) => {
        expect(actions.length)
          .toBe(0);
        expect(error.message)
          .toBe("fetch.cv_rejected");
      });
  });

  it("should saveAllToRemote success", () => {
    expect.assertions(1);
    return saveAllToRemote({}, sendEventSuccess)
      .then((message) => expect(message)
        .toStrictEqual({body: "save_resolved"}));
  });

  it("should saveAllToRemote error", () => {
    expect.assertions(1);
    return saveAllToRemote({}, sendEventError)
      .catch((error) => expect(error.message)
        .toBe("save_rejected"));
  });

  it("should create unique ids", () => {
    const id0 = createUuid();
    expect(id0.length)
      .toBe(36);
    expect(id0.replace(/-/g, "").length)
      .toBe(32);

    const id1 = createUuid();
    expect(id1.length)
      .toBe(36);
    expect(id1.replace(/-/g, "").length)
      .toBe(32);
    expect(id0)
      .not.toBe(id1);
  });
});
