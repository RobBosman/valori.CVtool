export const generateCvAtRemote = (accountId, locale, sendEventFunc) =>
  sendEventFunc("cv.generate", { accountId, locale })
    .then((message) => message.body);
