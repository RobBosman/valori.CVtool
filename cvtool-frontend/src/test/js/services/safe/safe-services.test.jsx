/**
 * @jest-environment jsdom
 */
import * as commonUtils from "../../../../main/js/utils/CommonUtils";
import * as safeServices from "../../../../main/js/services/safe/safe-services";

describe("safe-services.test", () => {

  const sendEventSuccess = (eventName) => Promise.resolve({ body: `${eventName}_resolved` });
  const sendEventError = (eventName) => Promise.reject(new Error(`${eventName}_rejected`));

  it("should saveToRemote success", () => {
    expect.assertions(1);
    return safeServices.saveToRemote({}, sendEventSuccess)
      .then(message => expect(message)
        .toStrictEqual({body: "mongodb.save_resolved"}));
  });

  it("should saveToRemote error", () => {
    expect.assertions(1);
    return safeServices.saveToRemote({}, sendEventError)
      .catch((error) => expect(error.message)
        .toBe("mongodb.save_rejected"));
  });

  it("should create unique ids", () => {
    const id0 = commonUtils.createUuid();
    expect(id0.length)
      .toBe(36);
    expect(id0.replace(/-/g, "").length)
      .toBe(32);

    const id1 = commonUtils.createUuid();
    expect(id1.length)
      .toBe(36);
    expect(id1.replace(/-/g, "").length)
      .toBe(32);
    expect(id0)
      .not.toBe(id1);
  });
});
