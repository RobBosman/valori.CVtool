import PropTypes from "prop-types";
import React from "react";
import { Checkbox } from "@fluentui/react";

export const CvCheckbox = (props) => {
  
  const { entity, entityId, replaceInstance } = props.instanceContext;
  const instance = entity && entity[entityId];
  let value = instance && instance[props.field];
  value = value !== undefined ? !!value : props.defaultValue;
  value = value !== undefined ? !!value : false;

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
  styles: PropTypes.object
};