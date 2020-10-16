import PropTypes from "prop-types";
import React from "react";
import { SpinButton } from "@fluentui/react";

export const CvSpinButton = (props) => {

  const { entity, instanceId, replaceInstance } = props.instanceContext;
  const instance = entity && entity[instanceId];

  const value = instance && instance[props.field] || props.defaultValue || 0;

  const onChange = (event) => onValueChange(event.target.value);

  const onIncrement = (value) => onValueChange(Number(value) + 1);

  const onDecrement = (value) => onValueChange(value - 1);

  const onValueChange = (value) =>
    replaceInstance && replaceInstance(instanceId, { ...instance, [props.field]: Number(value) });

  return (
    <SpinButton
      label={props.label}
      labelPosition="top"
      placeholder={props.placeholder}
      disabled={!instance}
      value={value}
      styles={props.styles}
      onChange={onChange}
      onIncrement={onIncrement}
      onDecrement={onDecrement} />
  );
};

CvSpinButton.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  field: PropTypes.string,
  defaultValue: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  styles: PropTypes.object
};