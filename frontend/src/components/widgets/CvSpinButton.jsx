import PropTypes from "prop-types";
import React from "react";
import { SpinButton } from "@fluentui/react";

export const CvSpinButton = (props) => {
  const { entity, entityId, replaceInstance } = props.instanceContext;
  const instance = entity && entity[entityId];

  let value = 0;
  if (instance) {
    value = instance[props.field] || props.defaultValue || 0;
  }

  const onChange = (event) => onValueChange(event.target.value);

  const onIncrement = (value) => onValueChange(Number(value) + 1);

  const onDecrement = (value) => onValueChange(value - 1);

  const onValueChange = (value) =>
    replaceInstance && replaceInstance(entityId, {
      ...instance,
      [props.field]: Number(value)
    });

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