export const fetchCvFromRemote = (accountId, sendEventFunc) =>
  sendEventFunc("cv.fetch", { accountId })
    .then(message => message.body);

export const fetchCvHistoryFromRemote = (accountId, sendEventFunc) =>
  sendEventFunc("cv.history", { accountId })
    .then(message => message.body);

export const generateCvAtRemote = (accountId, locale, sendEventFunc) =>
  sendEventFunc("cv.generate", { accountId, locale })
    .then(message => message.body);

const escapeJsonString = (text) =>
  text
    .replace(/\\/g, "\\\\") // escape backslashes
    .replace(/"/g, "\\\"") // escape double quotes
    .replace(/\s+/g, " ") // use single spaces
    .trim();

export const searchCvData = (searchText, sendEventFunc) =>
  searchText
    ? sendEventFunc("cv.search", { searchText: escapeJsonString(searchText) })
      .then(message => message.body)
    : Promise.resolve({});