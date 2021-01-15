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

  const renderBlankLine = (before, match, after, renderFunc) =>
    <Text>
      {before && <Text block>{renderFunc(before)}</Text>}
      {before && after && <Text block>{renderFunc("\u00A0", { newParagraph: true })}</Text>}
      {after && <Text block>{renderFunc(after, { newParagraph: true })}</Text>}
    </Text>;

  const renderParagraph = (before, match, after, renderFunc) =>
    <Text>
      {before && <Text block>{renderFunc(before)}</Text>}
      {after && <Text block>{renderFunc(after, { newParagraph: true })}</Text>}
    </Text>;

  const renderBulletListItem = (before, match, after, renderFunc) =>
    <Text>
      {renderFunc(before)}
      <Text style={{ marginLeft: 12, color: "#F29100" }}>●</Text>
      <Text block style={{ marginLeft: 32, marginTop: -18 }}>{renderFunc(after)}</Text>
    </Text>;

  const renderNumberedListItem = (before, match, after, renderFunc, renderContext) => {
    renderContext.numberingStartParagraph = isNaN(renderContext.numberingStartParagraph) ? renderContext.paragraph : parseInt(renderContext.numberingStartParagraph);
    renderContext.itemNumber = isNaN(renderContext.itemNumber) ? 1 : (parseInt(renderContext.itemNumber) + 1);
    if (renderContext.numberingStartParagraph + renderContext.itemNumber - 1 !== renderContext.paragraph) {
      renderContext.numberingStartParagraph = renderContext.paragraph;
      renderContext.itemNumber = 1;
    }
    return <Text>
      {renderFunc(before)}
      <Text style={{ marginLeft: 12 }}>{renderContext.itemNumber}.</Text>
      <Text block style={{ marginLeft: 32, marginTop: -18 }}>{renderFunc(after)}</Text>
    </Text>;
  };

  const formattingSpecs = React.useMemo(() => {
    const specs = props.formattingSpecs || [];
    return props.markDown
      ? [
        { textToMatch: "\n\n", renderMatch: renderBlankLine },
        { textToMatch: "\n", renderMatch: renderParagraph },
        { textToMatch: "* ", newLineBefore: true, renderMatch: renderBulletListItem },
        { textToMatch: "# ", newLineBefore: true, renderMatch: renderNumberedListItem },
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