import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, Modal, ContextualMenu, IconButton } from "@fluentui/react";
import * as uiServices from "../../services/ui/ui-services";

export const cvHeadings = {
  activities: "Taken/werkzaamheden:",
  results: "Resultaat:",
  keywords: "Werkomgeving:"
};

export const cvTextStyle = {
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "10pt",
  lineHeight: 1.3
};

export const formatDate = (dateText) => {
  try {
    const isoDate = new Date(dateText).toISOString();
    return `${isoDate.substring(8, 10)}-${isoDate.substring(5, 7)}-${isoDate.substring(0, 4)}`; // yyyy-mm-dd
  } catch (error) {
    return dateText;
  }
};

export const composeExperiencePeriod = (experience, locale) => {
  const separator = locale === "uk_UK" ? "." : "-";
  const beginString = experience.periodBegin
    ? `${experience.periodBegin.substring(5, 7)}${separator}${experience.periodBegin.substring(0, 4)}`
    : "";
  const endString = experience.periodEnd
    ? `${experience.periodEnd.substring(5, 7)}${separator}${experience.periodEnd.substring(0, 4)}`
    : locale === "uk_UK" ? "today" : "heden";
  return `${beginString} \u2014 ${endString}`;
};

export const composeExperienceDescription = (experience, locale) => {
  const assignment = experience.assignment && experience.assignment[locale]?.trim() || "";
  const activities = experience.activities && experience.activities[locale]?.trim() || "";
  const results = experience.results && experience.results[locale]?.trim() || "";
  const keywords = experience.keywords && experience.keywords[locale]?.trim() || "";
  var composedText = assignment;
  if (activities)
    composedText += `\n${cvHeadings.activities}\n${activities}`;
  if (results)
    composedText += `\n${cvHeadings.results}\n${results}`;
  if (keywords)
    composedText += `\n${cvHeadings.keywords}\n${keywords}`;
  return composedText.trim();
};

export const composeExperiencePreview = (experience, locale) => ({
  period: composeExperiencePeriod(experience, locale),
  role: experience.role,
  clientOrEmployer: experience.client || experience.employer || "",
  description: {
    [locale]: composeExperienceDescription(experience, locale)
  }
});

// The widths in this table are in mm. They are based on the Arial 10pt font used in MS-Word.
const ARIAL_WIDTH_MAP = {
  "ijl": 0.75,
  "Ift, /": 1.00,
  "r.-()": 1.20,
  "JLcksvxyz": 1.75,
  "abdeghnopqu0123456789=": 1.95,
  "FTZ&": 2.25,
  "ABEKPSVXY": 2.35,
  "CDHNRUw": 2.55,
  "GMOQ": 2.75,
  "m": 2.95,
  "W": 3.30
};

const getCharWidth = (ch) => {
  const entry = Object.entries(ARIAL_WIDTH_MAP)
    .find(([key]) => key.includes(ch));
  return entry && entry[1] || 1.0;
};

const getTextWidth = (text) =>
  [...text]
    .map(c => getCharWidth(c))
    .reduce((acc, c) => acc + c, 0.0);

/**
 * Search for the letter-index at 42.5 mm using table WIDTH_MAP.
 * That is 17 capitals of about 2,47 mm or 24 lower case letters of circa 1,75 mm wide.
 * If the text is longer than that, then replace the last space *before* that index with a newline.
 *
 * NB - The implementation of this function has a Kotlin counterpart, see XsUtils.kt.
 */
export const wrapText = (text, wrapWidth = 42.0) => {

  const spaceWidth = getCharWidth(" ");

  let buildUpWidth = 0.0;
  let wrappedText = "";
  text
    .split(/\s+/g)
    .forEach(fragmentText => {
      const fragmentWidth = getTextWidth(fragmentText);

      if (wrappedText.length === 0) {
        wrappedText = fragmentText;
        buildUpWidth = fragmentWidth;
      } else if (buildUpWidth + spaceWidth + fragmentWidth <= wrapWidth) {
        wrappedText += ` ${fragmentText}`;
        buildUpWidth += spaceWidth + fragmentWidth;
      } else {
        wrappedText = `${wrappedText}\n${fragmentText}`.trim();
        buildUpWidth = fragmentWidth;
      }
    });

  return wrappedText;
};


/**
 * React web component
 */
const Preview = (props) => {
  
  const {viewPaneBackground, valoriYellow} = uiServices.useTheme();

  return (
    <Modal
      isOpen={props.isVisible}
      onDismiss={props.onDismiss}
      isModeless={true}
      styles={{
        root: {
          margin: "-8px"
        }
      }}
      dragOptions={{
        moveMenuItemText: "Move",
        closeMenuItemText: "Close",
        menu: ContextualMenu
      }}>
      <Stack styles={{
        root: {
          background: viewPaneBackground,
          padding: 20
        }
      }}>
        <Stack horizontal horizontalAlign="space-between">
          <Text variant="xxLarge">Preview</Text>
          <IconButton
            iconProps={{ iconName: "Cancel" }}
            onClick={props.onDismiss}
          />
        </Stack>
        <Stack
          styles={{
            root: {
              backgroundColor: "white",
              borderColor: valoriYellow,
              borderWidth: 1,
              borderStyle: "solid none none none",
              overflow: "auto",
              ...(props.rootStyles || {})
            }
          }}
          tokens={{ childrenGap: "5px"}}>
          {props.isVisible
            && props.renderContent()
          }
        </Stack>
      </Stack>
    </Modal>
  );
};

Preview.propTypes = {
  rootStyles: PropTypes.object,
  renderContent: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired
};

export default Preview;