import PropTypes from "prop-types";
import React from "react";
import { Checkbox } from "@fluentui/react";

export const CvCheckbox = (props) => {
  
  const { entity, instanceId, replaceInstance } = props.instanceContext;
  const instance = entity && entity[instanceId];
  let value = instance && instance[props.field];
  value = value !== undefined ? !!value : props.defaultValue;
  value = value !== undefined ? !!value : false;

  const onChange = (_event, isChecked) =>
    replaceInstance && replaceInstance(instanceId,
      {
        ...instance,
        [props.field]: isChecked
      });

  return (
    <Checkbox
      label={props.label}
      disabled={!instance || props.disabled}
      checked={value}
      onChange={onChange}
      styles={props.styles}
    />
  );
};

CvCheckbox.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  defaultValue: PropTypes.bool,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  styles: PropTypes.object
};