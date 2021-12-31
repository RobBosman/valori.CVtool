export const comparePrimitives = (l, r) => {
  const L = typeof l === "string" ? l.toUpperCase() : l;
  const R = typeof r === "string" ? r.toUpperCase() : r;
  return L < R ? -1 : L > R ? 1 : 0;
};

export const compareItemsByField = (l, r, field) => {
  const fieldPath = field?.split(".", 2) || [];
  return fieldPath.length > 1
    ? compareItemsByField(l[fieldPath[0]], r[fieldPath[0]], fieldPath[1])
    : comparePrimitives(l && l[field] || "", r && r[field] || "");
};

export const isValidYear = (value) =>
  isNaN(value) ? "Voer een jaartal in" : value.length > 4 ? "Maximaal vier cijfers" : "";

export const isValidText = (maxSize) =>
  value => value.length > maxSize ? `Maximaal ${maxSize} tekens` : "";

export const isFilledLocaleField = (...localeFields) =>
  localeFields && localeFields.find(localeField =>
    Object.values(localeField || {}).find(localeValue => localeValue));

export const getPlaceholder = (instances, selectedId, fieldName, locale) =>
  getValueOrFallback(instances?.find(instance => instance._id === selectedId), fieldName, locale);

export const getValueOrFallback = (instance, fieldName, locale) => {
  const field = instance && instance[fieldName];
  if (field) {
    if (field[locale]) {
      return field[locale];
    }
    const fallback = Object.values(field).find(fieldValue => fieldValue);
    if (fallback) {
      return fallback;
    }
  }
  return "";
};

export const isAccountEditable = (accountId, authInfo) =>
  accountId === authInfo.accountId || ["ADMIN", "UNIT_LEAD"].includes(authInfo.authorizationLevel);