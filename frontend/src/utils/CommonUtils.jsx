export const compareStrings = (l, r) =>
  l < r ? -1 : l > r ? 1 : 0;

export const isValidYear = (value) =>
  !/^\d*$/.test(value) ? "Voer een jaartal in" : value.length > 4 ? "Maximaal vier cijfers" : "";

export const isValidText = (maxSize) =>
  value => value.length > maxSize ? `Maximaal ${maxSize} tekens` : "";

export const isFilledLocaleField = (...localeFields) =>
  localeFields && localeFields.find(localeField =>
    localeField && Object.values(localeField).find(localeValue => localeValue));