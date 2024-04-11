export const comparePrimitives = (l, r) => {
  const L = typeof l === "string" ? l.toUpperCase() : l;
  const R = typeof r === "string" ? r.toUpperCase() : r;
  if (L < R) {
    return -1;
  } else if (L > R) {
    return 1;
  } else {
    return 0;
  }
};

export const compareItemsByField = (l, r, field) => {
  const fieldPath = field?.split(".", 2) || [];
  return fieldPath.length > 1
    ? compareItemsByField(l[fieldPath[0]], r[fieldPath[0]], fieldPath[1])
    : comparePrimitives(l?.[field] || "", r?.[field] || "");
};

export const parseTimeString = timeString =>
  timeString ? new Date(timeString) : null;

export const isValidYear = (value) => {
  if (isNaN(value)) {
    return "Voer een jaartal in";
  } else if (value.length > 4) {
    return "Maximaal vier cijfers";
  } else {
    return "";
  }
};

export const isValidText = (maxSize) =>
  value => value.length > maxSize ? `Maximaal ${maxSize} tekens` : "";

export const isFilledLocaleField = (...localeFields) =>
  localeFields?.find(localeField =>
    Object.values(localeField || {}).find(localeValue => localeValue));

export const getPlaceholder = (instances, selectedId, fieldName, locale) =>
  getValueOrFallback(instances?.find(instance => instance._id === selectedId), fieldName, locale);

export const getValueOrFallback = (instance, fieldName, locale) => {
  const field = instance?.[fieldName];
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

export const isEditAccountAllowed = (accountId, authInfo) =>
  accountId === authInfo.accountId || ["ADMIN", "UNIT_LEAD"].includes(authInfo.authorizationLevel);

export const hasInstances = (entity, accountId) =>
  Object.values(entity || {})
    .some(instance => instance.accountId === accountId && instance.includeInCv);

const getRandomByte = () => {
  const buf = new Uint8Array(1);
  crypto.getRandomValues(buf);
  return buf[0] & 15;
};

// Use this function to create a unique object id (UUID).
export const createUuid = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = getRandomByte();
    const v = c == "x" ? r : (r & 3 | 8);
    return v.toString(16);
  });
