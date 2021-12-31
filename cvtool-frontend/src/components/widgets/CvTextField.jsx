import PropTypes from "prop-types";
import React from "react";
import { TextField } from "@fluentui/react";

export const CvTextField = (props) => {

  const {entity, instanceId, replaceInstance, readOnly} = props.instanceContext;
  
  const instance = entity && entity[instanceId];

  const value = React.useMemo(() => {
    let val = instance;
    props.field.split(".")
      .forEach(field => {
        val = val && val[field];
      });
    return val || props.defaultValue || "";
  }, [instance, props.field, props.defaultValue]);

  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    if (errorMessage) {
      const timeoutId = setTimeout(() =>
        setErrorMessage(""),
      3000);
      return () => clearTimeout(timeoutId);
    }
  }, [errorMessage]);

  const onChange = (event) => {
    if (props.validateInput) {
      const validationMessage = props.validateInput(event.target.value);
      if (validationMessage) {
        setErrorMessage(validationMessage);
        return;
      }
    }
    if (errorMessage) {
      setErrorMessage("");
    }
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

  const isReadOnly = props.readOnly || readOnly;

  return (
    <TextField
      label={props.label}
      placeholder={!isReadOnly && props.placeholder || ""}
      multiline={props.multiline}
      autoAdjustHeight={props.autoAdjustHeight}
      disabled={props.disabled || !instance}
      readOnly={isReadOnly}
      borderless={isReadOnly}
      value={value}
      styles={props.styles}
      onChange={!isReadOnly && onChange}
      errorMessage={errorMessage}
    />
  );
};

CvTextField.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  label: PropTypes.any,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  placeholder: PropTypes.string,
  multiline: PropTypes.bool,
  autoAdjustHeight: PropTypes.bool,
  styles: PropTypes.object,
  validateInput: PropTypes.func
};