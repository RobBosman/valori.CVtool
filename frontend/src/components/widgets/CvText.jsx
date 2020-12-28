import PropTypes from "prop-types";
import React from "react";
import { Text } from "@fluentui/react";

export const CvText = (props) => {

  const { entity, instanceId } = props.instanceContext;
  
  const instance = entity && entity[instanceId];

  const value = React.useMemo(() => {
    let val = instance;
    props.field.split(".")
      .forEach(field => {
        val = val && val[field];
      });
    return val || "";
  }, [instance, props.field]);

  return (
    <Text
      styles={props.styles}>
      {value}
    </Text>
  );
};

CvText.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  styles: PropTypes.object
};