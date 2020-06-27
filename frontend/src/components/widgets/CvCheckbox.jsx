import PropTypes from "prop-types";
import React from "react";
import { Checkbox } from "@fluentui/react";

export const CvCheckbox = (props) => {
  const { entity, entityId, replaceInstance } = props.instanceContext;
  const instance = entity && entity[entityId];
  const value = instance && instance[props.field] || props.defaultValue || false;

  const onChange = (_event, isChecked) =>
    replaceInstance && replaceInstance(entityId,
      {
        ...instance,
        [props.field]: isChecked
      });

  return (
    <Checkbox
      label={props.label}
      disabled={!instance}
      defaultChecked={value}
      onChange={onChange}
      styles={props.styles} />
  );
};

CvCheckbox.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  defaultValue: PropTypes.bool,
  label: PropTypes.string,
  styles: PropTypes.object
};