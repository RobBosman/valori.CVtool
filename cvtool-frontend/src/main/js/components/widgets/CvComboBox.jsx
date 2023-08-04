import PropTypes from "prop-types";
import React from "react";
import { ComboBox, TextField } from "@fluentui/react";

export const CvComboBox = (props) => {
  
  const {entity, instanceId, replaceInstance, readOnly} = props.instanceContext;
  const instance = entity?.[instanceId];
  const value = instance?.[props.field] || props.defaultValue || "";

  const onChange = (event, option) =>
    replaceInstance?.(instanceId, { ...instance, [props.field]: (option?.key || event.target.value) });

  return readOnly
    ? <TextField
      label={props.label}
      readOnly={true}
      borderless={true}
      value={props.options.find(option => option.key === value)?.text}
      disabled={!instance}
      styles={props.styles}
    />
    : <ComboBox
      label={props.label}
      options={props.options}
      allowFreeform={props.allowFreeform}
      autoComplete="on"
      styles={props.styles}
      disabled={!instance}
      selectedKey={value}
      onChange={onChange}
    />;
};

CvComboBox.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  label: PropTypes.any,
  options: PropTypes.any.isRequired,
  allowFreeform: PropTypes.bool,
  styles: PropTypes.object
};