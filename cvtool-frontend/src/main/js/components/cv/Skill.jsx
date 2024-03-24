import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, DefaultButton, PrimaryButton } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId } from "../../services/ui/ui-actions";
import { changeInstance } from "../../services/safe/safe-actions";
import { createUuid } from "../../services/safe/safe-services";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvTextField } from "../widgets/CvTextField";
import { CvRating } from "../widgets/CvRating";
import { CvComboBox } from "../widgets/CvComboBox";
import { CvCheckbox } from "../widgets/CvCheckbox";
import { createHelpIcon } from "../widgets/CvHelpIcon";
import ConfirmDialog from "../ConfirmDialog";
import * as enums from "./Enums";
import * as commonUtils from "../../utils/CommonUtils";
import Preview, * as preview from "./Preview";

const entityName = "skill";

const Skill = (props) => {

  const isEditable = commonUtils.isEditAccountAllowed(props.selectedAccountId, props.authInfo);
  const hasCharacteristics = commonUtils.hasInstances(props.characteristicsEntity, props.selectedAccountId);

  const skillContext = {
    entity: props.skillEntity,
    instanceId: props.selectedSkillId,
    setSelectedInstanceId: props.setSelectedSkillId,
    replaceInstance: props.replaceSkill,
    readOnly: !isEditable
  };

  // Find all {Skill} of the selected account.
  const skills = React.useMemo(() =>
    props.selectedAccountId && Object.values(props.skillEntity || {})
      .filter(instance => instance.accountId === props.selectedAccountId)
      .sort((l, r) =>
        commonUtils.comparePrimitives(
          enums.getValue(enums.SkillCategories, l.category)?.sortIndex || 0,
          enums.getValue(enums.SkillCategories, r.category)?.sortIndex || 0)
        || commonUtils.comparePrimitives(r.skillLevel || 0, l.skillLevel || 0)
        || commonUtils.comparePrimitives(
          commonUtils.getValueOrFallback(l, "description", props.locale),
          commonUtils.getValueOrFallback(r, "description", props.locale)))
    || [],
    [props.skillEntity, props.selectedAccountId]);

  const renderSkill = (item) =>
    enums.getText(enums.SkillCategories, item.category, props.locale);

  const renderDescription = (item) =>
    item.description?.[props.locale] || commonUtils.getValueOrFallback(item, "description", props.locale);

  const renderSkillLevel = (item) =>
    "\u2605 ".repeat(item.skillLevel).trim();

  const renderInCvCheckbox = (item) =>
    <CvCheckbox
      field="includeInCv"
      instanceContext={{ ...skillContext, instanceId: item._id }}
    />;

  const columns = [
    {
      key: "category",
      fieldName: "category",
      name: "Categorie",
      onRender: renderSkill,
      isResizable: false,
      minWidth: 110,
      maxWidth: 110
    },
    {
      key: "description",
      fieldName: `description.${props.locale}`,
      name: "Omschrijving",
      onRender: renderDescription,
      isResizable: true
    },
    {
      key: "skillLevel",
      fieldName: "skillLevel",
      name: "Niveau",
      onRender: renderSkillLevel,
      isResizable: false,
      minWidth: 70,
      maxWidth: 70
    },
    {
      key: "includeInCv",
      fieldName: "includeInCv",
      name: "In cv",
      onRender: renderInCvCheckbox,
      isResizable: false,
      minWidth: 40,
      maxWidth: 40,
      data: "boolean"
    }
  ];

  const { viewPaneBackground, editPaneBackground, valoriBlue, valoriYellow } = useTheme();
  const viewStyles = {
    root: {
      background: viewPaneBackground,
      padding: 20,
      minWidth: 350,
      height: "calc(100vh - 170px)"
    }
  };
  const editStyles = {
    root: {
      background: editPaneBackground,
      padding: 20,
      height: "calc(100vh - 170px)"
    }
  };
  const tdStyle = {
    width: "calc(50vw - 98px)"
  };

  const [confirmDialogVisible, setConfirmDialogVisible] = React.useState(false);
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [previewHeight, setPreviewHeight] = React.useState(0);
  const [previewFlexBoxHeight, setPreviewFlexBoxHeight] = React.useState(0);

  const selectedItemFields = React.useCallback(() => {
    const selectedSkill = skills.find(skill => skill._id === props.selectedSkillId);
    return selectedSkill && {
      Categorie: renderSkill(selectedSkill),
      Omschrijving: commonUtils.getValueOrFallback(selectedSkill, "description", props.locale)
    };
  },
    [skills, props.selectedSkillId, props.locale]);

  const isFilledSkill = (skill) =>
    skill.category || commonUtils.isFilledLocaleField(skill.description);

  const onAddItem = () => {
    let newSkill = skills.find(publication => !isFilledSkill(publication));
    if (!newSkill) {
      newSkill = {
        _id: createUuid(),
        accountId: props.selectedAccountId,
        skillLevel: 1,
        includeInCv: true
      };
      props.replaceSkill(newSkill._id, newSkill);
    }
    props.setSelectedSkillId(newSkill._id);
  };

  const onDeleteItem = () => {
    if (props.selectedSkillId) {
      setConfirmDialogVisible(true);
    }
  };
  const onDeleteConfirmed = () => {
    setConfirmDialogVisible(false);
    if (props.selectedSkillId) {
      props.replaceSkill(props.selectedSkillId, {});
      props.setSelectedSkillId(undefined);
    }
  };
  const onDeleteCancelled = () =>
    setConfirmDialogVisible(false);

  const flexGapHorizontal = 10;
  const flexGapVertical = 5;
  const previewTextStyles = { ...preview.cvTextStyle, lineHeight: 1.0, color: valoriBlue };

  const adjustPreviewHeight = (minimumHeight, previewHeight, flexBoxHeights) => {
    // The flex container is too wide, so we must increase its height.
    const minimumNewHeight = Math.max(minimumHeight, previewHeight);
    const potentialHeights = new Set();

    const partitionToWindows = (inputArray, windowSize) =>
      Array.from(
        { length: inputArray.length - (windowSize - 1) },
        (_, index) => inputArray.slice(index, index + windowSize));

    for (let windowSize = 1; windowSize < flexBoxHeights.length; windowSize++) {
      partitionToWindows(flexBoxHeights, windowSize) // array of arrays with n heights each
        .map(window => window.reduce((acc, h) => acc + h, 0) + (windowSize - 1) * flexGapVertical) // array of aggregated heights
        .filter(height => height > minimumNewHeight)
        .forEach(height => potentialHeights.add(height));
    }

    if (potentialHeights.size > 0) {
      const newHeight = [...potentialHeights]
        .reduce((acc, h) => h < acc ? h : acc, Infinity); // get min value
      setPreviewHeight(newHeight);
    }
  }

  const getFlexBoxDimensions = (flexBoxes, flexContainer, flexBoxHeights) => ({
    flexBoxWidth: flexBoxes
      .map(flexBox => flexBox.width)
      .reduce((acc, h) => h > acc ? h : acc, 0), // get max value
    largestFlexBoxHeight: flexBoxHeights
      .reduce((acc, h) => h > acc ? h : acc, 0), // get max value
    totalFlexBoxHeight: flexBoxHeights
      .reduce((acc, h) => acc + h, 0), // aggregate
    largestFlexBoxLeft: flexBoxes
      .map(flexBox => flexBox.left - flexContainer.left)
      .reduce((acc, l) => l > acc ? l : acc, 0), // get max value
    flexContainerHeight: flexBoxes
      .map(flexBox => flexBox.bottom - flexContainer.top)
      .reduce((acc, h) => h > acc ? h : acc, 0) // get max value
  });

  const adjustFlexLayout = React.useCallback(() => {
    const skillsPreview = document.getElementById("skillsPreview");
    if (previewVisible && skillsPreview) {

      const flexBoxes = [...skillsPreview.childNodes]
        .map(childNode => childNode.getBoundingClientRect());
      const flexContainer = skillsPreview.getBoundingClientRect();
      const flexBoxHeights = flexBoxes
        .map(flexBox => flexBox.height);

      const flexBoxDimensions = getFlexBoxDimensions(flexBoxes, flexContainer, flexBoxHeights);

      const targetFlexBoxOffset = (flexBoxDimensions.flexBoxWidth + flexGapHorizontal) * 2;

      // The resulting height must be at least as high as:
      // - the highest flexBox and
      // - the total height of all flexBoxes, divided by the number of columns.
      const minimumHeight = Math.max(flexBoxDimensions.largestFlexBoxHeight, flexBoxDimensions.totalFlexBoxHeight / 3);

      if (skillsPreview.childNodes.length <= 3) {
        // Fixed layout.
        setPreviewHeight(flexBoxDimensions.largestFlexBoxHeight);
      }

      else if (flexBoxDimensions.largestFlexBoxLeft < targetFlexBoxOffset) {
        // The flex container is not wide enough, so we must decrease its height.
        // Great reset!
        setPreviewHeight(minimumHeight);
      }

      else if (flexBoxDimensions.largestFlexBoxLeft > targetFlexBoxOffset) {
        adjustPreviewHeight(minimumHeight, previewHeight, flexBoxHeights);
      }

      else if (flexBoxDimensions.largestFlexBoxLeft === targetFlexBoxOffset) {
        // The width of the flex container is okay.
        if (flexBoxDimensions.flexContainerHeight < previewHeight) {
          // The flex container is too high.
          // Fine-tune its height.
          setPreviewHeight(flexBoxDimensions.flexContainerHeight);
        }
        else if (flexBoxDimensions.totalFlexBoxHeight !== previewFlexBoxHeight) {
          // However, the number of skills has changed.
          // Great reset!
          setPreviewHeight(minimumHeight);
        }
      }

      setPreviewFlexBoxHeight(flexBoxDimensions.totalFlexBoxHeight);
    }
  },
    [skills, previewVisible, previewHeight, previewFlexBoxHeight]);

  React.useEffect(() => {
    // Adjust the height of the preview window to exactly fit all skills.
    const timeoutId = previewVisible && setTimeout(adjustFlexLayout, 10);
    // at the close:
    return () => timeoutId && clearTimeout(timeoutId);
  },
    [skills, previewVisible, previewHeight, previewFlexBoxHeight]);

  const renderPreviewDescription = (skill) =>
    preview.wrapText(commonUtils.getValueOrFallback(skill, "description", props.locale));

  const renderPreviewSkill = (skill) =>
    <tr key={skill._id}>
      <td style={{
        width: 156, // ~ 42.5 mm
        maxWidth: 156,
        whiteSpace: "pre",
        overflowX: "hidden"
      }}>
        {renderPreviewDescription(skill)}
      </td>
      <td style={{
        width: 41,
        textAlign: "right",
        verticalAlign: "bottom"
      }}>
        <strong>{renderSkillLevel(skill)}</strong>
      </td>
    </tr>;

  const renderPreviewSkillsOfCategory = (category, skillsOfCategory) =>
    <table
      key={category.key}
      style={{
        ...previewTextStyles,
        borderCollapse: "collapse"
      }}>
      <tbody>
        <tr>
          <td colSpan={2} style={{ color: valoriYellow, fontWeight: "bold" }}>
            {enums.getTextFromValue(category, props.locale)}
          </td>
        </tr>
        {skillsOfCategory
          .sort((l, r) =>
            commonUtils.comparePrimitives(r.skillLevel || 0, l.skillLevel || 0)
            || commonUtils.comparePrimitives(
              commonUtils.getValueOrFallback(l, "description", props.locale),
              commonUtils.getValueOrFallback(r, "description", props.locale)))
          .map(renderPreviewSkill)}
      </tbody>
    </table>;

  const renderPreview = React.useCallback(() =>
    <Stack
      styles={{
        root: {
          margin: 8,
          overflow: "hidden"
        }
      }}
      tokens={{ childrenGap: "l1" }}>
      <div
        id="skillsPreview"
        style={{
          display: "flex",
          flex: "0 0 auto",
          flexDirection: "column",
          flexWrap: "wrap",
          gap: `${flexGapVertical}px ${flexGapHorizontal}px`,
          width: 623,
          height: previewHeight
        }}>
        {
          enums.SkillCategories
            .toSorted((l, r) => l.sortIndex - r.sortIndex)
            .map(category => [
              category,
              skills
                .filter(isFilledSkill)
                .filter(skill => skill.category === category.key)
                .filter(skill => skill.includeInCv)
            ])
            .filter(([, skillsOfCategory]) => skillsOfCategory.length > 0)
            .map(([category, skillsOfCategory]) => renderPreviewSkillsOfCategory(category, skillsOfCategory))
        }
      </div>
      <Stack horizontal tokens={{ childrenGap: "55px" }}>
        <Text style={previewTextStyles}><strong>&#x2605;</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{props.locale === "uk_UK" ? "basic" : "basis"}</Text>
        <Text style={previewTextStyles}><strong>&#x2605; &#x2605;</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{props.locale === "uk_UK" ? "advanced" : "gevorderd"}</Text>
        <Text style={previewTextStyles}><strong>&#x2605; &#x2605; &#x2605;</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{props.locale === "uk_UK" ? "experienced" : "ervaren"}</Text>
      </Stack>
    </Stack>,
    [skills, props.locale, previewHeight]);

  const isValidDescription = (text) =>
    (preview.wrapText(text).match(/\n/g) || []).length > 1 // more than two lines?
      ? "Deze tekst beslaat meer dan twee regels"
      : commonUtils.isValidText(50)(text);

  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <td valign="top" style={tdStyle}>
            <Stack styles={viewStyles}>
              <Stack horizontal horizontalAlign="space-between"
                tokens={{ childrenGap: "l1" }}>
                <Text variant="xxLarge">Vaardigheden</Text>
                {isEditable
                  && <Stack horizontal
                    tokens={{ childrenGap: "l1" }}>
                    <DefaultButton
                      text="Toevoegen"
                      iconProps={{ iconName: "Add" }}
                      disabled={!hasCharacteristics}
                      onClick={onAddItem}
                    />
                    <DefaultButton
                      text="Verwijderen"
                      iconProps={{ iconName: "Delete" }}
                      disabled={!props.selectedSkillId}
                      onClick={onDeleteItem}
                    />
                    <ConfirmDialog
                      title="Definitief verwijderen?"
                      primaryButtonText="Verwijderen"
                      selectedItemFields={selectedItemFields}
                      isVisible={confirmDialogVisible}
                      onProceed={onDeleteConfirmed}
                      onCancel={onDeleteCancelled}
                    />
                  </Stack>
                }
              </Stack>
              <CvDetailsList
                columns={columns}
                items={skills}
                instanceContext={skillContext}
                setKey={entityName}
              />
            </Stack>
          </td>

          <td valign="top" style={tdStyle}>
            <Stack styles={editStyles}>
              <Stack horizontal horizontalAlign="space-between">
                <CvComboBox
                  label="Categorie"
                  field="category"
                  instanceContext={skillContext}
                  options={enums.getOptions(enums.SkillCategories, props.locale)}
                  styles={{ root: { width: 180 } }}
                />
                <Preview
                  isVisible={previewVisible}
                  rootStyles={{
                    width: 638,
                    height: 400
                  }}
                  renderContent={renderPreview}
                  onDismiss={() => setPreviewVisible(false)}
                />
                <PrimaryButton
                  text="Preview"
                  iconProps={{ iconName: "EntryView" }}
                  onClick={() => setPreviewVisible(!previewVisible)}
                  style={{ top: "28px" }}
                />
              </Stack>
              <CvTextField
                label="Omschrijving"
                field={`description.${props.locale}`}
                instanceContext={skillContext}
                validateInput={isValidDescription}
                placeholder={commonUtils.getPlaceholder(skills, props.selectedSkillId, "description", props.locale)}
              />
              <CvRating
                label={createHelpIcon({
                  label: "Niveau",
                  content:
                    <Text>
                      <strong>&#x2605;</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Basis</strong> - Basiskennisniveau verkregen door training. Geen (concrete) praktijkervaring
                      <br /><strong>&#x2605; &#x2605;</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Gevorderd</strong> - Gevorderd niveau verkregen door training en/of aantoonbare praktijkervaring
                      <br /><strong>&#x2605; &#x2605; &#x2605;</strong>&nbsp;&nbsp;<strong>Ervaren</strong> - Specialistisch niveau met aantoonbare meerjarige ervaring
                    </Text>
                })}
                field="skillLevel"
                instanceContext={skillContext}
                allowZeroStars={true}
                max={3}
              />
              <CvTextField
                label={createHelpIcon({
                  label: "Toelichting",
                  content:
                    <Text>
                      Deze informatie is voor eigen/intern gebruik en wordt niet getoond op het CV.
                      <br />Wanneer Sales in de CV Tool zoekt naar bepaalde expertises dan kan deze informatie
                      <br />erg relevant zijn om een goede match te vinden bij een aanvraag.
                      <br />Vul dit dus zoveel mogelijk in.
                    </Text>
                })}
                field={`explanation.${props.locale}`}
                instanceContext={skillContext}
                multiline
                autoAdjustHeight
              />
            </Stack>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

Skill.propTypes = {
  authInfo: PropTypes.object,
  locale: PropTypes.string.isRequired,
  selectedAccountId: PropTypes.string,
  characteristicsEntity: PropTypes.object,
  skillEntity: PropTypes.object,
  replaceSkill: PropTypes.func.isRequired,
  selectedSkillId: PropTypes.string,
  setSelectedSkillId: PropTypes.func.isRequired
};

const select = (store) => ({
  authInfo: store.auth.authInfo,
  locale: store.ui.userPrefs.locale,
  selectedAccountId: store.ui.selectedId.account,
  characteristicsEntity: store.safe.content.characteristics,
  skillEntity: store.safe.content[entityName],
  selectedSkillId: store.ui.selectedId[entityName]
});

const mapDispatchToProps = (dispatch) => ({
  replaceSkill: (id, instance) => dispatch(changeInstance(entityName, id, instance)),
  setSelectedSkillId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Skill);