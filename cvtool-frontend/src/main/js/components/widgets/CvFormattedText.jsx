import PropTypes from "prop-types";
import React from "react";
import { Label, Stack, Text } from "@fluentui/react";
import * as uiServices from "../../services/ui/ui-services";
import * as textFormatter from "../../utils/TextFormatter";
import * as preview from "../cv/Preview";

export const CvFormattedText = (props) => {

  const { entity, instanceId } = props.instanceContext;

  const instance = entity?.[instanceId];

  const value = React.useMemo(() => {
    let val = instance;
    props.field.split(".")
      .forEach(field => {
        val = val?.[field];
      });
    return val || "";
  }, [instance, props.field]);

  const { semanticColors, valoriYellow } = uiServices.useTheme();

  const renderBlankLine = (before, _, after, renderFunc, defaultStyle) =>
    <Text>
      {before && <Text block style={defaultStyle}>{renderFunc(before)}</Text>}
      {before && after && <Text block style={defaultStyle}>{renderFunc("\u00A0", { newParagraph: true })}</Text>}
      {after && <Text block style={defaultStyle}>{renderFunc(after, { newParagraph: true })}</Text>}
    </Text>;

  const renderParagraph = (before, _, after, renderFunc, defaultStyle) =>
    <Text style={defaultStyle}>
      {before && <Text block style={defaultStyle}>{renderFunc(before)}</Text>}
      {after && <Text block style={defaultStyle}>{renderFunc(after, { newParagraph: true })}</Text>}
    </Text>;

  const renderBulletListItem = (before, _, after, renderFunc, defaultStyle) =>
    <Text style={defaultStyle}>
      {renderFunc(before)}
      <Text style={{ ...defaultStyle, marginLeft: 12, color: valoriYellow }}>●</Text>
      <Text block style={{ ...defaultStyle, marginLeft: 32, marginTop: -18 }}>{renderFunc(after)}</Text>
    </Text>;

  const renderNumberedListItem = (before, _, after, renderFunc, defaultStyle, renderContext) => {
    renderContext.numberingStartParagraph = isNaN(renderContext.numberingStartParagraph) ? renderContext.paragraph : parseInt(renderContext.numberingStartParagraph);
    renderContext.itemNumber = isNaN(renderContext.itemNumber) ? 1 : (parseInt(renderContext.itemNumber) + 1);
    if (renderContext.numberingStartParagraph + renderContext.itemNumber - 1 !== renderContext.paragraph) {
      renderContext.numberingStartParagraph = renderContext.paragraph;
      renderContext.itemNumber = 1;
    }
    return <Text style={defaultStyle}>
      {renderFunc(before)}
      <Text style={{ ...defaultStyle, marginLeft: 12 }}>{renderContext.itemNumber}.</Text>
      <Text block style={{ ...defaultStyle, marginLeft: 32, marginTop: -18 }}>{renderFunc(after)}</Text>
    </Text>;
  };

  const renderCvHeading = (before, match, after, renderFunc, defaultStyle) =>
    <Text style={defaultStyle}>
      {renderFunc(before)}
      <Text block style={{ ...defaultStyle, color: valoriYellow, marginTop: 12 }}>{match}</Text>
      {renderFunc(after, { newParagraph: true })}
    </Text>;
  
  const cvHeadingSpecs =
    Object.values(preview.cvHeadings)
      .map(cvHeading => ({ textToMatch: cvHeading, newLineBefore: true, wordBreakAfter: true, render: renderCvHeading }));

  const formattingSpecs = React.useMemo(() => {
    const specs = props.formattingSpecs || [];
    return props.markDown
      ? [
        { textToMatch: "\n\n", render: renderBlankLine },
        { textToMatch: "\n", render: renderParagraph },
        { textToMatch: "* ", newLineBefore: true, render: renderBulletListItem },
        { textToMatch: "*\t", newLineBefore: true, render: renderBulletListItem },
        { textToMatch: "- ", newLineBefore: true, render: renderBulletListItem },
        { textToMatch: "-\t", newLineBefore: true, render: renderBulletListItem },
        { textToMatch: "\u2022 ", newLineBefore: true, render: renderBulletListItem },
        { textToMatch: "\u2022\t", newLineBefore: true, render: renderBulletListItem },
        { textToMatch: "# ", newLineBefore: true, render: renderNumberedListItem },
        ...cvHeadingSpecs,
        ...specs
      ]
      : specs;
  },
  [props.formattingSpecs, props.markDown]);

  const textComponentStyle = {
    ...preview.cvTextStyle,
    ...props.textComponentStyle
  };

  return (
    <Stack
      styles={props.styles}>
      {props.label
        && <Label
          disabled={props.disabled || !instance}>
          {props.label}
        </Label>
      }
      <Text
        style={{
          backgroundColor: instance ? semanticColors.inputBackground : semanticColors.disabledBackground,
          padding: 8,
          ...textComponentStyle
        }}>
        {textFormatter.renderAndFormat(value, formattingSpecs, textComponentStyle)}
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
  textComponentStyle: PropTypes.object,
  styles: PropTypes.object
};