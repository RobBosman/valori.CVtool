export const compareStrings = (l, r) =>
  l < r ? -1 : l > r ? 1 : 0;

export const compareItemsByField = (l, r, field) => {
  const fieldPath = field.split(".", 2);
  if (fieldPath.length > 1) {
    return compareItemsByField(l[fieldPath[0]], r[fieldPath[0]], fieldPath[1]);
  }
  return compareStrings(l && l[field] || "", r && r[field] || "");
};

export const isValidYear = (value) =>
  !/^\d*$/.test(value) ? "Voer een jaartal in" : value.length > 4 ? "Maximaal vier cijfers" : "";

export const isValidText = (maxSize) =>
  value => value.length > maxSize ? `Maximaal ${maxSize} tekens` : "";

export const isFilledLocaleField = (...localeFields) =>
  localeFields && localeFields.find(localeField =>
    localeField && Object.values(localeField).find(localeValue => localeValue));

export const getPlaceholder = (instances, fieldName, selectedId, locale) => {
  const selectedInstance = instances.find(instance => instance._id === selectedId);
  return selectedInstance && selectedInstance[fieldName] && !selectedInstance[fieldName][locale]
    ? Object.values(selectedInstance[fieldName]).find(field => field)
    : "";
};