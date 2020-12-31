export const generateCvAtRemote = (accountId, locale, sendEventFunc) =>
  sendEventFunc("cv.generate", { accountId, locale })
    .then((message) => message.body);


const escapeJsonString = (text) =>
  text
    .replace("\\", "\\\\") // escape backslashes
    .replace("\"", "\\\"") // escape double quotes
    .replace(/\s+/g, " ") // use single spaces
    .trim();

export const searchCvData = (searchText, sendEventFunc) =>
  searchText
    ? sendEventFunc("cv.search", { searchText: escapeJsonString(searchText) })
      .then((message) => message.body)
    : Promise.resolve({});