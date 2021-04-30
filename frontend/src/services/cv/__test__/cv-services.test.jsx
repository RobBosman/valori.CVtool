import * as cvServices from "../cv-services";

describe("cv-services.test", () => {

  const sendEventSuccess = (eventName) => new Promise((_resolve) => _resolve({ body: `${eventName}_resolved` }));
  const sendEventError = (eventName) => new Promise((_resolve, _reject) => _reject(new Error(`${eventName}_rejected`)));

  it("should fetchCvFromRemote success", () => {
    expect.assertions(1);
    return cvServices.fetchCvFromRemote({}, sendEventSuccess)
      .then(action => expect(action)
        .toBe("cv.fetch_resolved")
      );
  });

  it("should fetchCvFromRemote error response", () => {
    expect.assertions(2);
    const actions = [];
    return cvServices.fetchCvFromRemote({}, sendEventError)
      .then(action => actions.push(action))
      .catch(error => {
        expect(actions.length)
          .toBe(0);
        expect(error.message)
          .toBe("cv.fetch_rejected");
      });
  });

  it("should fetchCvHistoryFromRemote success", () => {
    expect.assertions(1);
    return cvServices.fetchCvHistoryFromRemote({}, sendEventSuccess)
      .then(action => expect(action)
        .toBe("cv.history_resolved")
      );
  });

  it("should fetchCvHistoryFromRemote error response", () => {
    expect.assertions(2);
    const actions = [];
    return cvServices.fetchCvHistoryFromRemote({}, sendEventError)
      .then(action => actions.push(action))
      .catch(error => {
        expect(actions.length)
          .toBe(0);
        expect(error.message)
          .toBe("cv.history_rejected");
      });
  });
});
