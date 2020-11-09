import PropTypes from "prop-types";
import React from "react";
import { Dropdown } from "@fluentui/react";

export const CvDropdown = (props) => {
  
  const { entity, instanceId, replaceContentInstance } = props.instanceContext;
  const instance = entity && entity[instanceId];
  const value = instance && instance[props.field] || props.defaultValue || "";

  const onChange = (_event, option) => replaceInstance
    && replaceInstance(instanceId, { ...instance, [props.field]: option.key });

  return (
    <Dropdown
      label={props.label}
      options={props.options}
      styles={props.styles}
      disabled={!instance}
      selectedKey={value}
      onChange={onChange} />
  );
};

CvDropdown.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.any.isRequired,
  styles: PropTypes.object
};