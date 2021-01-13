import PropTypes from "prop-types";
import React from "react";
import { Label, Stack, Text } from "@fluentui/react";
import * as uiServices from "../../services/ui/ui-services";
import * as textFormatter from "../../utils/TextFormatter";

export const CvFormattedText = (props) => {

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

  const { semanticColors } = uiServices.useTheme();

  const renderParagraph = (before, match, after, formattingSpecs) =>
    <Text>
      {before && <Text block>{textFormatter.renderAndFormat(before, formattingSpecs)}</Text>}
      {after && <Text block>{textFormatter.renderAndFormat(after, formattingSpecs)}</Text>}
    </Text>;

  const renderBulletListItem = (before, match, after, formattingSpecs) =>
    <Text>
      {textFormatter.renderAndFormat(before, formattingSpecs)}
      <Text style={{ marginLeft: 12 }}>●</Text>
      <Text block style={{ marginLeft: 32, marginTop: -18 }}>{textFormatter.renderAndFormat(after, formattingSpecs)}</Text>
    </Text>;

  const formattingSpecs = React.useMemo(() => {
    const specs = props.formattingSpecs || [];
    return props.markDown
      ? [
        { textToMatch: "\n", renderAndFormat: renderParagraph },
        { textToMatch: "* ", newLineBefore: true, renderAndFormat: renderBulletListItem },
        ...specs
      ]
      : specs;
  },
  [props.formattingSpecs, props.markDown]);

  const textStyle = {
    backgroundColor: instance ? semanticColors.inputBackground : semanticColors.disabledBackground,
    padding: 8,
    minHeight: 16
  };

  return (
    <Stack
      styles={props.styles}>
      { props.label
        && <Label
          disabled={props.disabled || !instance}>
          {props.label}
        </Label>
      }
      <Text
        style={textStyle}>
        {textFormatter.renderAndFormat(value, formattingSpecs)}
      </Text>
    </Stack>
  );
};

CvFormattedText.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  formattingSpecs: PropTypes.array,
  markDown: PropTypes.bool,
  styles: PropTypes.object
};