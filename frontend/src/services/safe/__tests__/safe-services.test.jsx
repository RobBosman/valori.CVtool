import * as safeServices from "../safe-services";

describe("safe-services.test", () => {

  const sendEventSuccess = (eventName) => new Promise((_resolve) => _resolve({ body: `${eventName}_resolved` }));
  const sendEventError = (eventName) => new Promise((_resolve, _reject) => _reject(new Error(`${eventName}_rejected`)));

  it("should fetchCvFromRemote success", () => {
    expect.assertions(1);
    return safeServices.fetchCvFromRemote({}, sendEventSuccess)
      .then((action) => expect(action)
        .toBe("cv.fetch_resolved")
      );
  });

  it("should fetchCvFromRemote error response", () => {
    expect.assertions(2);
    const actions = [];
    return safeServices.fetchCvFromRemote({}, sendEventError)
      .then((action) => actions.push(action))
      .catch((error) => {
        expect(actions.length)
          .toBe(0);
        expect(error.message)
          .toBe("cv.fetch_rejected");
      });
  });

  it("should saveToRemote success", () => {
    expect.assertions(1);
    return safeServices.saveToRemote({}, sendEventSuccess)
      .then((message) => expect(message)
        .toStrictEqual({body: "mongodb.save_resolved"}));
  });

  it("should saveToRemote error", () => {
    expect.assertions(1);
    return safeServices.saveToRemote({}, sendEventError)
      .catch((error) => expect(error.message)
        .toBe("mongodb.save_rejected"));
  });

  it("should create unique ids", () => {
    const id0 = safeServices.createUuid();
    expect(id0.length)
      .toBe(36);
    expect(id0.replace(/-/g, "").length)
      .toBe(32);

    const id1 = safeServices.createUuid();
    expect(id1.length)
      .toBe(36);
    expect(id1.replace(/-/g, "").length)
      .toBe(32);
    expect(id0)
      .not.toBe(id1);
  });
});
