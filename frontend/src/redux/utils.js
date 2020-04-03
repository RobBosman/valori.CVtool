"use strict";

export const heavyWait = (remark = '', waitMillis = 1000) => {
    if (waitMillis > 0) {
        console.log(`    ${remark} - waiting ${waitMillis} ms...`);
        let now = new Date().getTime();
        let end = now + waitMillis;
        while (now < end) {
            now = new Date().getTime();
        }
    }
};

export const mapHelpers = (entities, entityId, onChangeEntity, locale) => {

    const instance = entities && entities[entityId];

    const getValue = (propertyName, defaultValue = '') =>
        instance && instance[propertyName] && instance[propertyName] || defaultValue;

    const getValueLocale = (propertyName, defaultValue = '') =>
        instance && instance[propertyName] && instance[propertyName][locale] || defaultValue;

    const defaultConvertEvent = (event) => event.target.value;

    const onChange = (propertyName, convert = defaultConvertEvent) => (event, option) => onChangeEntity({
            ...instance,
            [propertyName]: convert(event, option)
        },
        entityId);

    const onChangeLocale = (propertyName, convert = defaultConvertEvent) => (event, option) => onChangeEntity({
            ...instance,
            [propertyName]: {
                ...instance[propertyName],
                [locale]: convert(event, option)
            }
        },
        entityId);

    return {
        instance,
        getValue,
        getValueLocale,
        onChange,
        onChangeLocale
    };
};