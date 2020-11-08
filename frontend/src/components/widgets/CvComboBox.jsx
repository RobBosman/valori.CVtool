import PropTypes from "prop-types";
import React from "react";
import { ComboBox } from "@fluentui/react";

export const CvComboBox = (props) => {
  
  const { entity, instanceId, replaceInstance } = props.instanceContext;
  const instance = entity && entity[instanceId];
  const value = instance && instance[props.field] || props.defaultValue || "";

  const onChange = (event, option) =>
    replaceInstance && replaceInstance(instanceId, { ...instance, [props.field]: (option?.key || event.target.value) });

  return (
    <ComboBox
      label={props.label}
      options={props.options}
      allowFreeform={props.allowFreeform}
      autoComplete="on"
      styles={props.styles}
      disabled={!instance}
      selectedKey={value}
      onChange={onChange}
    />
  );
};

CvComboBox.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.any.isRequired,
  allowFreeform: PropTypes.bool,
  styles: PropTypes.object
};