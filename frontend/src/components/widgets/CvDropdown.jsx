import PropTypes from "prop-types";
import React from "react";
import { Dropdown } from "@fluentui/react";

export const CvDropdown = (props) => {
  
  const { entity, instanceId, replaceInstance } = props.instanceContext;
  const instance = entity && entity[instanceId];

  let value;
  let valueInstance;
  const fieldPath = props.field.split(".");
  if (fieldPath.length === 2) {
    valueInstance = instance && instance[fieldPath[0]];
    value = valueInstance && valueInstance[fieldPath[1]];
  } else {
    valueInstance = instance;
    value = valueInstance && valueInstance[fieldPath[0]];
  }
  value = value || props.defaultValue || "";

  const onChange = (_event, option) => {
    if (replaceInstance) {
      if (fieldPath.length === 2) {
        replaceInstance(instanceId, {
          ...instance,
          [fieldPath[0]]: {
            ...valueInstance,
            [fieldPath[1]]: option.key
          }
        });
      } else {
        replaceInstance(instanceId, {
          ...instance,
          [fieldPath[0]]: option.key
        });
      }
    }
  };

  return (
    <Dropdown
      label={props.label}
      options={props.options}
      styles={props.styles}
      disabled={props.disabled || !instance}
      selectedKey={value}
      onChange={onChange}
    />
  );
};

CvDropdown.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  options: PropTypes.any.isRequired,
  styles: PropTypes.object
};