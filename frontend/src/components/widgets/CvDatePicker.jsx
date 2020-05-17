import React from "react"
import { DatePicker, DayOfWeek } from "@fluentui/react"

const datePickerStrings = {
  months: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
  shortMonths: ['jan', 'feb', 'maa', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
  days: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
  shortDays: ['z', 'm', 'd', 'w', 'd', 'v', 'z'],
  goToToday: 'Ga naar vandaag',
  prevMonthAriaLabel: 'Ga naar vorige maand',
  nextMonthAriaLabel: 'Ga naar volgende maand',
  prevYearAriaLabel: 'Ga naar vorig jaar',
  nextYearAriaLabel: 'Ga naar volgend jaar',
  closeButtonAriaLabel: 'Sluit datumpicker',
  isRequiredErrorMessage: 'Een datum is verplicht.',
  invalidInputErrorMessage: 'Ongeldig datumformaat.'
};

const parseDateFromString = (value) => {
  return value && new Date(value);
};

const formatDate = (date) => {
  if (date) {
    const correctedDate = new Date(date);
    correctedDate.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // prevent timezone offset errors
    return correctedDate.toISOString().substring(0, 10);
  } else {
    return '';
  }
};

const CvDatePicker = (props) => {
  const { entity, entityId, replaceInstance } = props.instanceContext;
  const instance = entity && entity[entityId];
  const value = parseDateFromString(instance && instance[props.field] || props.defaultValue || '');

  const onChange = (newDate) => replaceInstance
    && replaceInstance(entityId,
      {
        ...instance,
        [props.field]: formatDate(newDate)
      });

  return (
    <DatePicker
      label={props.label}
      disabled={!instance}
      styles={props.styles}
      strings={datePickerStrings}
      firstDayOfWeek={DayOfWeek.Monday}
      allowTextInput
      value={value}
      onSelectDate={onChange}
      formatDate={formatDate}
      parseDateFromString={parseDateFromString} />
  );
};

export default CvDatePicker