import PropTypes from "prop-types";
import React from "react";
import { Label, Stack, Text } from "@fluentui/react";
import * as uiServices from "../../services/ui/ui-services";
import * as textFormatter from "../../utils/TextFormatter";

export const CvFormattedText = (props) => {

  const {entity, instanceId} = props.instanceContext;
  
  const instance = entity && entity[instanceId];

  const value = React.useMemo(() => {
    let val = instance;
    props.field.split(".")
      .forEach(field => {
        val = val && val[field];
      });
    return val || "";
  }, [instance, props.field]);

  const {semanticColors} = uiServices.useTheme();

  const textBlock = (p) => <Text block>{p.children}</Text>;
  const markDownSpecs = [
    {
      text: "\n", wordOnly: false, render: textBlock
    }
  ];

  const needleSpecs = React.useMemo(() =>
    props.markDown
      ? [
        ...markDownSpecs,
        ...(props.needleSpecs || [])
      ]
      : props.needleSpecs,
  [props.needleSpecs, props.markDown]);

  const textStyle = {
    backgroundColor: instance ? semanticColors.inputBackground : semanticColors.disabledBackground,
    padding: 8,
    minHeight: 16
  };

  return (
    <Stack>
      { props.label
        && <Label
          disabled={props.disabled || !instance}>
          {props.label}
        </Label>
      }
      <Text
        style={textStyle}>
        {textFormatter.renderWithHighlightedKeywords(value, needleSpecs)}
      </Text>
    </Stack>
  );
};

CvFormattedText.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  needleSpecs: PropTypes.object,
  markDown: PropTypes.bool,
};