import PropTypes from "prop-types";
import React from "react";
import { DatePicker, DayOfWeek, TextField } from "@fluentui/react";

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

  const {entity, instanceId, replaceInstance, locale, readOnly} = props.instanceContext;
  const instance = entity && entity[instanceId];
  const localeForDate = locale?.substr(0, 2);

  const correctDateForTimezone = (date) => {
    if (date) {
      const correctedDate = new Date(date);
      correctedDate.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // prevent timezone offset errors
      return correctedDate;
    } else {
      return date;
    }
  };

  const formatDateForStorage = (date) => {
    try {
      return correctDateForTimezone(date).toISOString().substr(0, 10); // yyyy-mm-dd
    } catch (error) {
      return "";
    }
  };

  const formatDateForScreen = (date) =>
    date && correctDateForTimezone(date).toLocaleDateString(localeForDate) || "";

  const parseDateFromStorage = (dateString) =>
    dateString && new Date(dateString);

  const parseDateFromScreen = (dateString) => {
    const match = dateString?.match(/(\d+)[^\d]+(\d+)[^\d]+(\d+)/); // 00 0 000
    if (match)
      switch (localeForDate) {
      case "nl":
        return new Date(match[3], match[2] - 1, match[1]); // d, m, y
      case "uk":
        return new Date(match[3], match[1], match[2] - 1); // m, d, y
      default:
        return new Date(match[1], match[2] - 1, match[1]); // y, m, d
      }
  };

  const onChange = (newDate) =>
    replaceInstance && replaceInstance(instanceId, { ...instance, [props.field]: formatDateForStorage(newDate) });
  
  const value = parseDateFromStorage(instance && instance[props.field] || props.defaultValue || "");

  return readOnly
    ? <TextField
      label={props.label}
      readOnly={true}
      borderless={true}
      disabled={!instance}
      value={value && formatDateForScreen(value)}
      styles={props.styles}
    />
    : <DatePicker
      label={props.label}
      disabled={!instance}
      styles={props.styles}
      strings={datePickerStrings}
      firstDayOfWeek={DayOfWeek.Monday}
      allowTextInput
      value={value}
      onSelectDate={onChange}
      formatDate={formatDateForScreen}
      parseDateFromString={parseDateFromScreen}
    />;
};

CvDatePicker.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  label: PropTypes.string,
  styles: PropTypes.object
};