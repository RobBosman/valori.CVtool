import PropTypes from "prop-types";
import React from "react";
import { Rating, Stack, Label } from "@fluentui/react";
import { useId } from "@uifabric/react-hooks";

export const CvRating = (props) => {

  const { entity, entityId, replaceInstance } = props.instanceContext;
  const instance = entity && entity[entityId];

  const value = instance && instance[props.field] || props.defaultValue || 0;

  const onChange = (_event, rating) =>
    replaceInstance && replaceInstance(entityId, {
      ...instance,
      [props.field]: rating
    });

  const ratingId = useId("rating");

  return (
    <Stack>
      <Label
        htmlFor={ratingId}
        disabled={!instance}
      >{props.label}</Label>
      <Rating
        min={1}
        max={5}
        disabled={!instance}
        rating={value}
        onChange={onChange} />
    </Stack>
  );
};

CvRating.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  field: PropTypes.string,
  defaultValue: PropTypes.string,
  label: PropTypes.string
};