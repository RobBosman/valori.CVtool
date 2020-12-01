import PropTypes from "prop-types";
import React from "react";
import { TextField } from "@fluentui/react";

export const CvTextField = (props) => {

  const [errorMessage, setErrorMessage] = React.useState("");
  React.useEffect(() => {
    const timeoutId = setTimeout(() => setErrorMessage(""), 3000);
    return () => clearTimeout(timeoutId);
  }, [errorMessage]);
  
  const { entity, instanceId, replaceInstance } = props.instanceContext;
  const instance = entity && entity[instanceId];

  let value = instance;
  props.field.split(".")
    .forEach(field => {
      value = value && value[field];
    });
  value = value || props.defaultValue || "";

  const onChange = (event) => {
    if (props.validateInput) {
      const validationMessage = props.validateInput(event.target.value);
      if (validationMessage) {
        setErrorMessage(validationMessage);
        return;
      }
    }
    setErrorMessage("");
    let instanceToBeSaved;
    const fieldPath = props.field.split(".");
    if (fieldPath.length === 2) {
      let subInstance = instance[fieldPath[0]] || {};
      instanceToBeSaved = {
        ...instance,
        [fieldPath[0]]: {
          ...subInstance,
          [fieldPath[1]]: event.target.value
        }
      };
    } else {
      instanceToBeSaved = {
        ...instance,
        [fieldPath[0]]: event.target.value
      };
    }
    replaceInstance && replaceInstance(instanceId, instanceToBeSaved);
  };

  return (
    <TextField
      label={props.label}
      placeholder={props.placeholder}
      multiline={props.multiline}
      autoAdjustHeight={props.autoAdjustHeight}
      disabled={props.disabled || !instance}
      value={value}
      styles={props.styles}
      onChange={onChange}
      errorMessage={errorMessage}
    />
  );
};

CvTextField.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  multiline: PropTypes.bool,
  autoAdjustHeight: PropTypes.bool,
  styles: PropTypes.object,
  validateInput: PropTypes.func
};