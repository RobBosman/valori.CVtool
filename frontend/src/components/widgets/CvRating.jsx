import PropTypes from "prop-types";
import React from "react";
import { Rating } from "@fluentui/react";

export const CvRating = (props) => {

  const { entity, entityId, replaceInstance } = props.instanceContext;
  const instance = entity && entity[entityId];

  const value = instance && instance[props.field] || props.defaultValue || 0;

  const onChange = (_event, rating) =>
    replaceInstance && replaceInstance(entityId, {
      ...instance,
      [props.field]: rating
    });

  return (
    <Rating
      label={props.label}
      min={1}
      max={5}
      disabled={!instance}
      rating={value}
      onChange={onChange} />
  );
};

CvRating.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  field: PropTypes.string,
  defaultValue: PropTypes.string,
  label: PropTypes.string
};