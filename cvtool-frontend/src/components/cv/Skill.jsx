import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, DefaultButton, Modal, ContextualMenu, IconButton, PrimaryButton } from "@fluentui/react";
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
import * as preview from "./Preview";

const entityName = "skill";

const Skill = (props) => {

  const cv = props.cvEntity && props.cvEntity[props.selectedCvId];
  const isEditable = commonUtils.isAccountEditable(cv?.accountId, props.authInfo);

  const skillContext = {
    entity: props.skillEntity,
    instanceId: props.selectedSkillId,
    setSelectedInstanceId: props.setSelectedSkillId,
    replaceInstance: props.replaceSkill,
    readOnly: !isEditable
  };
  
  // Find all {Skill} of the selected {cv}.
  const skills = React.useMemo(() =>
    props.selectedCvId && Object.values(props.skillEntity || {})
      .filter(instance => instance.cvId === props.selectedCvId)
      .sort((l, r) => {
        let compare = (enums.getEnumData(enums.SkillCategories, l.category)?.sortIndex || 0)
          - (enums.getEnumData(enums.SkillCategories, r.category)?.sortIndex || 0);
        if (compare === 0) {
          compare = (r.skillLevel || 0) - (l.skillLevel || 0);
        }
        if (compare === 0) {
          compare = commonUtils.comparePrimitives(l.description && l.description[props.locale] || "", r.description && r.description[props.locale] || "");
        }
        return compare;
      })
      || [],
  [props.skillEntity, props.selectedCvId]);

  const renderSkill = (item) =>
    enums.getEnumData(enums.SkillCategories, item.category)?.text || "";

  const renderDescription = (item) =>
    item.description && item.description[props.locale] || commonUtils.getPlaceholder(skills, item._id, "description", props.locale);

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
  const previewStyles = {
    root: {
      background: viewPaneBackground,
      padding: 20
    }
  };
  const tdStyle = {
    width: "calc(50vw - 98px)"
  };

  const [isConfirmDialogVisible, setConfirmDialogVisible] = React.useState(false);
  const [isPreviewVisible, setPreviewVisible] = React.useState(false);
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
        cvId: props.selectedCvId,
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

  const adjustFlexLayout = React.useCallback(() => {
    const skillsPreview = document.getElementById("skillsPreview");
    if (isPreviewVisible && skillsPreview) {

      const flexContainer = skillsPreview.getBoundingClientRect();
      const flexBoxes = [ ...skillsPreview.childNodes ]
        .map(childNode => childNode.getBoundingClientRect());
      const flexBoxHeights = flexBoxes
        .map(flexBox => flexBox.height);
      const flexBoxWidth = flexBoxes
        .map(flexBox => flexBox.width)
        .reduce((acc, h) => h > acc ? h : acc, 0); // get max value
      const largestFlexBoxHeight = flexBoxHeights
        .reduce((acc, h) => h > acc ? h : acc, 0); // get max value
      const totalFlexBoxHeight = flexBoxHeights
        .reduce((acc, h) => acc + h, 0); // aggregate
      const largestFlexBoxLeft = flexBoxes
        .map(flexBox => flexBox.left - flexContainer.left)
        .reduce((acc, l) => l > acc ? l : acc, 0); // get max value
      const flexContainerHeight = flexBoxes
        .map(flexBox => flexBox.bottom - flexContainer.top)
        .reduce((acc, h) => h > acc ? h : acc, 0); // get max value

      const targetFlexBoxOffset = (flexBoxWidth + flexGapHorizontal) * 2;

      // The resulting height must be at least as high as:
      // - the highest flexBox and
      // - the total height of all flexBoxes, divided by the number of columns.
      const minimunHeight = Math.max(largestFlexBoxHeight, totalFlexBoxHeight / 3);

      if (skillsPreview.childNodes.length <= 3) {
        // Fixed layout.
        setPreviewHeight(largestFlexBoxHeight);
      }

      else if (largestFlexBoxLeft < targetFlexBoxOffset) {
        // The flex container is not wide enough, so we must decrease its height.
        // Great reset!
        setPreviewHeight(minimunHeight);
      }
      
      else if (largestFlexBoxLeft > targetFlexBoxOffset) {
        // The flex container is too wide, so we must increase its height.
        const minimunNewHeight = Math.max(minimunHeight, previewHeight);
        const potentialHeights = new Set();

        const partitionToWindows = (inputArray, windowSize) =>
          Array.from(
            { length: inputArray.length - (windowSize - 1) },
            (_, index) => inputArray.slice(index, index + windowSize));

        for (let windowSize = 1; windowSize < flexBoxHeights.length; windowSize++) {
          partitionToWindows(flexBoxHeights, windowSize) // array of arrays with n heights each
            .map(window => window.reduce((acc, h) => acc + h, 0) + (windowSize - 1) * flexGapVertical) // array of aggregated heights
            .filter(height => height > minimunNewHeight)
            .forEach(height => potentialHeights.add(height));
        }

        if (potentialHeights.size > 0) {
          const newHeight = [ ...potentialHeights ]
            .reduce((acc, h) => h < acc ? h : acc, Infinity); // get min value
          setPreviewHeight(newHeight);
        }
      }

      else if (largestFlexBoxLeft === targetFlexBoxOffset) {
        // The width of the flex container is okay.
        if (flexContainerHeight < previewHeight) {
          // The flex container is too high.
          // Fine-tune its height.
          setPreviewHeight(flexContainerHeight);
        }
        else if (totalFlexBoxHeight !== previewFlexBoxHeight) {
          // However, the number of skills has changed.
          // Great reset!
          setPreviewHeight(minimunHeight);
        }
      }
      
      setPreviewFlexBoxHeight(totalFlexBoxHeight);
    }
  },
  [skills, isPreviewVisible, previewHeight, previewFlexBoxHeight]);

  React.useEffect(() => {
    // Adjust the height of the preview window to exactly fit all skills.
    const timeoutId = isPreviewVisible && setTimeout(adjustFlexLayout, 10);
    // at the close:
    return () => timeoutId && clearTimeout(timeoutId);
  },
  [skills, isPreviewVisible, previewHeight, previewFlexBoxHeight]);

  const renderPreviewDescription = (skill) =>
    preview.wrapText(skill.description && skill.description[props.locale] || "");

  const renderPreviewSkill = (skill) =>
    <tr key={skill._id}>
      <td width="158px" style={{ maxWidth: 158, whiteSpace: "pre", overflowX: "hidden" }}>
        {renderPreviewDescription(skill)}
      </td>
      <td width="41px" align="right" valign="bottom">
        <strong>{renderSkillLevel(skill)}</strong>
      </td>
    </tr>;

  const renderPreviewSkillsOfCategory = (category, skillsOfCategory) =>
    <div key={category.key}>
      <table style={{ ...previewTextStyles, borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td colSpan={2} style={{ color: valoriYellow, fontWeight: "bold" }}>{category.text}</td>
          </tr>
          {skillsOfCategory.map(renderPreviewSkill)}
        </tbody>
      </table>
    </div>;

  const renderPreview = React.useCallback(() =>
    <Stack
      styles={{
        root: {
          backgroundColor: "white",
          borderColor: valoriYellow,
          borderWidth: 1,
          borderStyle: "solid none none none",
          width: 650,
          height: 400
        }
      }}
      tokens={{ childrenGap: "l1"}}>
      <div
        id="skillsPreview"
        style={{
          display: "flex",
          flex: "0 0 auto",
          flexDirection: "column",
          flexWrap: "wrap",
          gap: `${flexGapVertical}px ${flexGapHorizontal}px`,
          height: previewHeight,
          overflow: "hidden"
        }}>
        {enums.SkillCategories
          .sort((l, r) => l.sortIndex - r.sortIndex)
          .map(category => [
            category,
            skills
              .filter(skill => skill.category === category.key)
              .filter(skill => commonUtils.isFilledLocaleField(skill.description))
              .filter(skill => skill.includeInCv)
          ])
          .filter(([, skillsOfCategory]) => skillsOfCategory.length > 0)
          .map(([category, skillsOfCategory]) => renderPreviewSkillsOfCategory(category, skillsOfCategory))}
      </div>
      <Stack horizontal tokens={{ childrenGap: "55px"}}>
        <Text style={previewTextStyles}><strong>&#x2605;</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;foundation</Text>
        <Text style={previewTextStyles}><strong>&#x2605; &#x2605;</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;advanced</Text>
        <Text style={previewTextStyles}><strong>&#x2605; &#x2605; &#x2605;</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;expert</Text>
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
                      disabled={!props.selectedCvId}
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
                      isVisible={isConfirmDialogVisible}
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
                  options={enums.SkillCategories}
                  styles={{ root: { width: 160 } }}
                />
                {isPreviewVisible
                && <Modal
                  isOpen={isPreviewVisible}
                  onDismiss={() => setPreviewVisible(false)}
                  isModeless={true}
                  dragOptions={{
                    moveMenuItemText: "Move",
                    closeMenuItemText: "Close",
                    menu: ContextualMenu
                  }}
                  styles={{ root: { overflow: "hidden", margin: "-8px" } }}>
                  <Stack styles={previewStyles}>
                    <Stack horizontal horizontalAlign="space-between">
                      <Text variant="xxLarge">Preview</Text>
                      <IconButton
                        iconProps={{ iconName: "Cancel" }}
                        onClick={() => setPreviewVisible(false)}
                      />
                    </Stack>
                    {renderPreview()}
                  </Stack>
                </Modal>
                }
                <PrimaryButton
                  text="Preview"
                  iconProps={{ iconName: "EntryView" }}
                  onClick={() => setPreviewVisible(!isPreviewVisible)}
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
                      <strong>&#x2605;</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Foundation</strong> - Basiskennisniveau verkregen door training. Geen (concrete) praktijkervaring
                      <br/><strong>&#x2605; &#x2605;</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Advanced</strong> - Gevorderd niveau verkregen door training en/of aantoonbare praktijkervaring
                      <br/><strong>&#x2605; &#x2605; &#x2605;</strong>&nbsp;&nbsp;<strong>Expert</strong> - Specialistisch niveau met aantoonbare meerjarige ervaring
                    </Text>
                })}
                field="skillLevel"
                instanceContext={skillContext}
                min={0}
                max={3}
              />
              <CvTextField
                label={createHelpIcon({
                  label: "Toelichting",
                  content:
                    <Text>
                      Deze informatie is voor eigen/intern gebruik en wordt niet getoond op het CV.
                      <br/>Wanneer Sales in de CV Tool zoekt naar bepaalde expertises dan kan deze informatie
                      <br/>erg relevant zijn om een goede match te vinden bij een aanvraag.
                      <br/>Vul dit dus zoveel mogelijk in.
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
  cvEntity: PropTypes.object,
  selectedCvId: PropTypes.string,
  skillEntity: PropTypes.object,
  replaceSkill: PropTypes.func.isRequired,
  selectedSkillId: PropTypes.string,
  setSelectedSkillId: PropTypes.func.isRequired
};

const select = (store) => ({
  authInfo: store.auth.authInfo,
  locale: store.ui.userPrefs.locale,
  cvEntity: store.safe.content.cv,
  selectedCvId: store.ui.selectedId.cv,
  skillEntity: store.safe.content[entityName],
  selectedSkillId: store.ui.selectedId[entityName]
});

const mapDispatchToProps = (dispatch) => ({
  replaceSkill: (id, instance) => dispatch(changeInstance(entityName, id, instance)),
  setSelectedSkillId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Skill);