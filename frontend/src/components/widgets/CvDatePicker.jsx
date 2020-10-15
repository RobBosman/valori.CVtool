import PropTypes from "prop-types";
import React from "react";
import { DatePicker, DayOfWeek } from "@fluentui/react";

const datePickerStrings = {
  months: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
  shortMonths: ["jan", "feb", "maa", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"],
  days: ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"],
  shortDays: ["z", "m", "d", "w", "d", "v", "z"],
  goToToday: "Ga naar vandaag",
  prevMonthAriaLabel: "Ga naar vorige maand",
  nextMonthAriaLabel: "Ga naar volgende maand",
  prevYearAriaLabel: "Ga naar vorig jaar",
  nextYearAriaLabel: "Ga naar volgend jaar",
  closeButtonAriaLabel: "Sluit datumpicker",
  isRequiredErrorMessage: "Een datum is verplicht.",
  invalidInputErrorMessage: "Ongeldig datumformaat."
};

export const CvDatePicker = (props) => {

  const { entity, entityId, replaceInstance, locale } = props.instanceContext;
  const instance = entity && entity[entityId];

  const correctDateForTimezone = (date) => {
    if (date) {
      const correctedDate = new Date(date);
      correctedDate.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // prevent timezone offset errors
      return correctedDate;
    } else {
      return date;
    }
  };

  const formatDateForStorage = (date) =>
    date
      ? correctDateForTimezone(date).toISOString().substring(0, 10) // yyyy-mm-dd
      : "";

  const formatDateForScreen = (date) =>
    date
      ? correctDateForTimezone(date).toLocaleDateString(locale.replace("_", "-"))
      : "";

  const parseDateFromStorage = (dateString) =>
    dateString && new Date(dateString);

  const parseDateFromScreen = (dateString) =>
    dateString && new Date(dateString);

  const onChange = (newDate) =>
    replaceInstance && replaceInstance(entityId,
      {
        ...instance,
        [props.field]: formatDateForStorage(newDate)
      });
  
  const value = parseDateFromStorage(instance && instance[props.field] || props.defaultValue || "");

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
      formatDate={formatDateForScreen}
      parseDateFromString={parseDateFromScreen} />
  );
};

CvDatePicker.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  label: PropTypes.string,
  styles: PropTypes.object
};