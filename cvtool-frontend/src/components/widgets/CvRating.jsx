import PropTypes from "prop-types";
import React from "react";
import { Rating, Stack, Label } from "@fluentui/react";
import { useId } from "@uifabric/react-hooks";

export const CvRating = (props) => {

  const {entity, instanceId, replaceInstance,readOnly} = props.instanceContext;
  const instance = entity && entity[instanceId];

  const value = instance && instance[props.field] || props.defaultValue || 0;

  const onChange = (_event, rating) =>
    replaceInstance && replaceInstance(instanceId, { ...instance, [props.field]: rating });

  const ratingId = useId("rating");

  return (
    <Stack>
      <Label
        htmlFor={ratingId}
        disabled={!instance}
      >{props.label}</Label>
      <Rating
        id={ratingId}
        min={props.min}
        max={props.max}
        disabled={!instance}
        rating={value}
        onChange={!readOnly && onChange}
        readOnly={readOnly}
      />
    </Stack>
  );
};

CvRating.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  field: PropTypes.string,
  defaultValue: PropTypes.number,
  label: PropTypes.any,
  min: PropTypes.number,
  max: PropTypes.number
};