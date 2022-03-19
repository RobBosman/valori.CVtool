import PropTypes from "prop-types";
import React from "react";
import { TextField } from "@fluentui/react";

export const CvTextField = (props) => {

  const {entity, instanceId, replaceInstance, readOnly} = props.instanceContext;
  
  const instance = entity && entity[instanceId];

  const isReadOnly = props.readOnly || readOnly;

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

  const textFieldRef = React.useRef(null);

  const getScrollParent = (node) => {
    const isScrollable = (node) => {
      const overflowY = window.getComputedStyle(node).overflowY;
      return overflowY === "scroll" || overflowY === "auto";
    };
    while (node instanceof HTMLElement && (!isScrollable(node) || node.scrollHeight <= node.clientHeight)) {
      node = node.parentNode;
    }
    return node;
  };

  // Override the TextField.autoAdjustHeight feature to prevent unexpected scrolling,
  // see also https://github.com/microsoft/fluentui/issues/16653.
  const adjustHeight = React.useCallback(() => {
    const domTextField = textFieldRef?.current?._textElement?.current;
    if (domTextField && props.autoAdjustHeight && !textFieldRef.current.props.autoAdjustHeight) {
      const domScrollableContainer = getScrollParent(domTextField.parentNode);
      const scrollTop = domScrollableContainer?.scrollTop;

      domTextField.style.height = ""; // NB - resetting the height may cause unexpected scrolling.
      domTextField.style.height = domTextField.scrollHeight + "px";

      if (scrollTop> 0) {
        domScrollableContainer.scrollTop = scrollTop;
      }
    }
  }, [textFieldRef, isReadOnly, props.multiline, props.autoAdjustHeight]);

  React.useEffect(adjustHeight, [value]);

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

  return (
    <TextField
      componentRef={textFieldRef}
      label={props.label}
      placeholder={!isReadOnly && props.placeholder || ""}
      multiline={props.multiline}
      autoAdjustHeight={props.autoAdjustHeight && (isReadOnly || !props.multiline)}
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