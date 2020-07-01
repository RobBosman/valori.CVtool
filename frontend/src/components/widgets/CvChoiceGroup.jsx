import PropTypes from "prop-types";
import React from "react";
import { ChoiceGroup } from "@fluentui/react";

export const CvChoiceGroup = (props) => {
  
  const { entity, entityId, replaceInstance } = props.instanceContext;
  const instance = entity && entity[entityId];
  const value = instance && instance[props.field] || props.defaultValue || "";

  const onChange = (_event, option) => replaceInstance
    && replaceInstance(entityId,
      {
        ...instance,
        [props.field]: option.key
      });

  return (
    <ChoiceGroup
      label={props.label}
      options={props.options}
      styles={props.styles}
      disabled={!instance}
      selectedKey={value}
      onChange={onChange} />
  );
};

CvChoiceGroup.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array,
  styles: PropTypes.object
};