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
    return correctDateForTimezone(date).toISOString().substring(0, 10); // yyyy-mm-dd
  } catch (error) {
    console.error("Error formatting date", date, error);
    return "";
  }
};

const parseDateFromStorage = (dateString) =>
  dateString && new Date(dateString);

export const CvDatePicker = (props) => {

  const {entity, instanceId, replaceInstance, locale, readOnly} = props.instanceContext;
  const instance = entity?.[instanceId];
  const localeForDate = locale?.substring(0, 2);

  const formatDateForScreen = (date) =>
    date && correctDateForTimezone(date).toLocaleDateString(localeForDate) || "";

  const parseDateFromScreen = (dateString) => {
    const match = dateString?.match(/^(\d+)[^\d]+(\d+)[^\d]+(\d+)$/); // 00 0 000
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
  
  // Set the value *after* the screen is fully rendered.
  // This is to prevent a bug that occurs in the Experience screen:
  // if you set focus to a DatePicker text field and then switch to another Experience,
  // the 'old' date that is still in the DatePicker is applied to the newly selected Experience.
  // The bug behaves slightly differently for filled and empty dates.
  const [value, setValue] = React.useState("");
  const [idOpenForChange, setIdOpenForChange] = React.useState(0);
  React.useEffect(() => {
    setValue(parseDateFromStorage(instance?.[props.field] || props.defaultValue || ""));
    setIdOpenForChange(instanceId);
  },
  [instance, props.field, props.defaultValue]);

  const onChange = (newDate) =>
    (idOpenForChange === instanceId)
      && replaceInstance?.(instanceId, { ...instance, [props.field]: formatDateForStorage(newDate) });

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
  label: PropTypes.any,
  styles: PropTypes.object
};