import { Buffer } from "buffer";

export const fetchCvFromRemote = (accountId, sendEventFunc) =>
  sendEventFunc("cv.fetch", { accountId })
    .then(message => message.body);

export const fetchCvHistoryFromRemote = (accountId, sendEventFunc) =>
  sendEventFunc("cv.history", { accountId })
    .then(message => message.body);

export const generateCvAtRemote = (accountId, locale, sendEventFunc) =>
  sendEventFunc("cv.generate", { accountId, locale })
    .then(message => message.body);

export const fetchDemoCvAtRemote = (accountId, locale, sendEventFunc) =>
  sendEventFunc("cv.download.demo", { accountId, locale })
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

const downloadFile = (fileName, blob) => {
  const a = document.createElement("a");
  a.style = "display: none";
  document.body.appendChild(a);
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const downloadDocxFile = (fileName, b64Data) => {
  const blob = new Blob([Buffer.from(b64Data, "base64")], {type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
  downloadFile(fileName, blob);
};

export const downloadJsonFile = (fileName, jsonData) => {
  const blob = new Blob([JSON.stringify(jsonData)], {type: "application/json"});
  downloadFile(fileName, blob);
};

export const composeCvForExport = (accountId, safeContent) => {
  const account = safeContent.account[accountId];

  const exportedCvData = {
    account: {
      [account._id]: account
    }
  };

  Object.entries(safeContent)
    .forEach(([entityName, instanceMap]) => {
      Object.values(instanceMap)
        .filter(instance => instance.accountId === accountId)
        .forEach(instance => {
          if (!exportedCvData[entityName]) {
            exportedCvData[entityName] = {};
          }
          exportedCvData[entityName][instance._id] = instance;
        });
    });

  const now = new Date();

  return {
    fileName: `CV_${account.name.replace(" ", "")}-${now.toLocaleString().replace(" ", "_")}.json`,
    json: {
      accountId: accountId,
      timestamp: now.toISOString(),
      content: exportedCvData
    }
  };
};