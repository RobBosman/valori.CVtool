export const generateCvAtRemote = (accountId, sendEventFunc) =>
  sendEventFunc("cv.generate", { accountId })
    .then((message) => message.body);
