export const generateCvAtRemote = (accountId, locale, sendEventFunc) =>
  sendEventFunc("cv.generate", { accountId, locale })
    .then((message) => message.body);


const escapeJsonString = (keywords) =>
  keywords
    .replace(/\\/g, "\\\\") // escape backslashes
    .replace(/"/g, "\\\"") // escape double quotes
    .replace(/\s+/g, " ") // use single spaces
    .trim();

export const searchCvData = (keywords, sendEventFunc) =>
  sendEventFunc("cv.search", { searchText: escapeJsonString(keywords) })
    .then((message) => message.body);