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

export const composeCvForExport = (cvId, locale, safeContent) => {
  const cv = safeContent.cv[cvId];
  const account = safeContent.account[cv.accountId];

  const exportedCvData = {
    account: {
      [account._id]: account
    },
    cv: {
      [cv._id]: cv
    }
  };

  Object.entries(safeContent)
    .forEach(([entityName, instanceMap]) => {
      Object.values(instanceMap)
        .filter(instance => instance.cvId === cvId)
        .forEach(instance => {
          if (!exportedCvData[entityName]) {
            exportedCvData[entityName] = {};
          }
          exportedCvData[entityName][instance._id] = instance;
        });
    });

  return {
    fileName: `CV_${locale.substr(3)}_${account.name.replace(" ", "")}.json`,
    json: { ...exportedCvData }
  };
};