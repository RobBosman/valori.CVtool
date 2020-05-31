import PropTypes from "prop-types";
import React from "react";
import { TextField } from "@fluentui/react";

const CvTextField = (props) => {
  const { entity, entityId, locale, replaceInstance } = props.instanceContext;
  const instance = entity && entity[entityId];

  let value = "";
  if (instance) {
    if (props.localeField) {
      value = instance[props.localeField] && instance[props.localeField][locale];
    } else {
      value = instance[props.field];
    }
    value = value || props.defaultValue || "";
  }

  const onChange = (event) => replaceInstance
    && replaceInstance(entityId, props.localeField
      ? {
        ...instance,
        [props.localeField]: {
          ...instance[props.localeField],
          [locale]: event.target.value
        }
      }
      : {
        ...instance,
        [props.field]: event.target.value
      }
    );

  return (
    <TextField
      label={props.label}
      placeholder={props.placeholder}
      multiline={props.multiline}
      autoAdjustHeight={props.autoAdjustHeight}
      disabled={!instance}
      value={value}
      styles={props.styles}
      onChange={onChange} />
  );
};

CvTextField.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  field: PropTypes.string,
  localeField: PropTypes.string,
  defaultValue: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  multiline: PropTypes.bool,
  autoAdjustHeight: PropTypes.bool,
  styles: PropTypes.object
};

export default CvTextField;