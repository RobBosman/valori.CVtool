import React from "react"
import { ChoiceGroup } from "@fluentui/react"

const CvChoiceGroup = (props) => {
  const { entity, entityId, replaceInstance } = props.instanceContext;
  const instance = entity && entity[entityId];
  const value = instance && instance[props.field] || props.defaultValue || '';

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

export default CvChoiceGroup