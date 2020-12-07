import PropTypes from "prop-types";
import React from "react";
import { TextField } from "@fluentui/react";

export const CvTextField = (props) => {

  const { entity, instanceId, replaceInstance } = props.instanceContext;

  const [state, setState] = React.useState({
    instance: undefined,
    errorMessage: ""
  });
  React.useLayoutEffect(() => {
    setState(prevState => ({ ...prevState, instance: entity && entity[instanceId] }));
  }, [props.instanceContext]);

  const value = React.useMemo(() => {
    let val = state.instance;
    props.field.split(".")
      .forEach(field => {
        val = val && val[field];
      });
    return val || props.defaultValue || "";
  }, [state.instance, props.field, props.defaultValue]);

  React.useEffect(() => {
    if (state.errorMessage) {
      const timeoutId = setTimeout(() =>
        setState(prevState => ({ ...prevState, errorMessage: "" })),
      3000);
      return () => clearTimeout(timeoutId);
    }
  }, [state.errorMessage]);

  const onChange = (event) => {
    if (props.validateInput) {
      const validationMessage = props.validateInput(event.target.value);
      if (validationMessage) {
        setState(prevState => ({ ...prevState, errorMessage: validationMessage }));
        return;
      }
    }
    if (state.errorMessage) {
      setState(prevState => ({ ...prevState, errorMessage: "" }));
    }
    let instanceToBeSaved;
    const fieldPath = props.field.split(".");
    if (fieldPath.length === 2) {
      let subInstance = state.instance[fieldPath[0]] || {};
      instanceToBeSaved = {
        ...state.instance,
        [fieldPath[0]]: {
          ...subInstance,
          [fieldPath[1]]: event.target.value
        }
      };
    } else {
      instanceToBeSaved = {
        ...state.instance,
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
      disabled={props.disabled || !state.instance}
      value={value}
      styles={props.styles}
      onChange={onChange}
      errorMessage={state.errorMessage}
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