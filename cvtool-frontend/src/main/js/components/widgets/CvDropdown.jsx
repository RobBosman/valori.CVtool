import PropTypes from "prop-types";
import React from "react";
import { Dropdown, TextField } from "@fluentui/react";

export const CvDropdown = (props) => {
  
  const {entity, instanceId, replaceInstance, readOnly} = props.instanceContext;
  const instance = entity?.[instanceId];

  let value;
  let valueInstance;
  const fieldPath = props.field.split(".");
  if (fieldPath.length === 2) {
    valueInstance = instance?.[fieldPath[0]];
    value = valueInstance?.[fieldPath[1]];
  } else {
    valueInstance = instance;
    value = valueInstance?.[fieldPath[0]];
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

  return readOnly || props.readOnly
    ? <TextField
      label={props.label}
      readOnly={true}
      borderless={true}
      value={props.options.find(option => option.key === value)?.text}
      disabled={props.disabled || !instance}
      styles={props.styles}
    />
    : <Dropdown
      label={props.label}
      options={props.options}
      styles={props.styles}
      disabled={props.disabled || !instance}
      selectedKey={value}
      onChange={onChange}
    />;
};

CvDropdown.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  label: PropTypes.any,
  disabled: PropTypes.bool,
  options: PropTypes.any.isRequired,
  styles: PropTypes.object
};