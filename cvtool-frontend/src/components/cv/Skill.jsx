import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, DefaultButton } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId } from "../../services/ui/ui-actions";
import { changeInstance } from "../../services/safe/safe-actions";
import { createUuid } from "../../services/safe/safe-services";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvTextField } from "../widgets/CvTextField";
import { CvRating } from "../widgets/CvRating";
import { CvComboBox } from "../widgets/CvComboBox";
import { getEnumData, SkillCategories } from "./Enums";
import * as commonUtils from "../../utils/CommonUtils";
import ConfirmDialog from "../ConfirmDialog";
import { CvCheckbox } from "../widgets/CvCheckbox";
import { createHelpIcon } from "../widgets/CvHelpIcon";

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
        let compare = (getEnumData(SkillCategories, l.category)?.sortIndex || 0) - (getEnumData(SkillCategories, r.category)?.sortIndex || 0);
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
    getEnumData(SkillCategories, item.category)?.text || "";

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

  const {viewPaneBackground, editPaneBackground} = useTheme();
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

  const [isConfirmDialogVisible, setConfirmDialogVisible] = React.useState(false);
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
              <CvComboBox
                label="Categorie"
                field="category"
                instanceContext={skillContext}
                options={SkillCategories}
                styles={{ root: { width: 160 } }}
              />
              <CvTextField
                label="Omschrijving"
                field={`description.${props.locale}`}
                instanceContext={skillContext}
                validateInput={commonUtils.isValidText(50)}
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