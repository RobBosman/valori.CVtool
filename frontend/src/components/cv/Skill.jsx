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
import { CvCheckbox } from "../widgets/CvCheckbox";
import { getEnumData, SkillCategories } from "./Enums";
import { CvRating } from "../widgets/CvRating";
import { CvComboBox } from "../widgets/CvComboBox";
import ConfirmDialog from "../ConfirmDialog";

const entityName = "skill";

const Skill = (props) => {
  
  const [skills, setSkills] = React.useState([]);

  const compareStrings = (l, r) =>
    l < r ? -1 : l > r ? 1 : 0;

  // Find all {Skill} of the selected {cv}.
  React.useEffect(() => {
    if (props.skillEntity && props.selectedCvId) {
      setSkills(Object.values(props.skillEntity)
        .filter((instance) => instance.cvId === props.selectedCvId)
        .sort((l, r) => {
          let compare = (getEnumData(SkillCategories, l.category)?.sortIndex || 0) - (getEnumData(SkillCategories, r.category)?.sortIndex || 0);
          if (compare === 0) {
            compare = (r.skillLevel || 0) - (l.skillLevel || 0);
          }
          if (compare === 0) {
            compare = compareStrings(l.description && l.description[props.locale] || "", r.description && r.description[props.locale] || "");
          }
          return compare;
        })
      );
    }
  }, [props.skillEntity, props.selectedCvId]);

  const skillContext = {
    entity: props.skillEntity,
    instanceId: props.selectedSkillId,
    setSelectedInstance: props.setSelectedSkillId,
    replaceInstance: props.replaceSkill
  };

  const renderSkill = (item) =>
    getEnumData(SkillCategories, item.category)?.text || "";

  const renderSkillLevel = (item) => "* ".repeat(item.skillLevel).trim();

  const columns = [
    {
      key: "category",
      fieldName: "category",
      name: "Categorie",
      onRender: renderSkill,
      isResizable: false,
      minWidth: 110,
      maxWidth: 110,
      data: "string"
    },
    {
      key: "description",
      fieldName: `description.${props.locale}`,
      name: "Omschrijving",
      isResizable: true,
      minWidth: 150,
      maxWidth: 400,
      isSorted: false,
      isSortedDescending: false,
      data: "string"
    },
    {
      key: "skillLevel",
      fieldName: "skillLevel",
      name: "Niveau",
      onRender: renderSkillLevel,
      isResizable: false,
      minWidth: 60,
      maxWidth: 60,
      data: "string"
    }
  ];

  const { viewPaneColor, editPaneColor } = useTheme();
  const viewStyles = {
    root: [
      {
        background: viewPaneColor,
        padding: 20,
        height: "calc(100vh - 170px)"
      }
    ]
  };
  const editStyles = {
    root: [
      {
        background: editPaneColor,
        padding: 20,
        height: "calc(100vh - 170px)"
      }
    ]
  };
  const tdStyle = {
    width: "calc(50vw - 98px)"
  };

  const onRenderItem = (item, number, column) => {
    switch (column.fieldName) {
    case "includeInCv":
      return <CvCheckbox
        field="includeInCv"
        instanceContext={{ ...skillContext, instanceId: item._id }}
      />;
    default:
      return item[column.fieldName];
    }
  };

  const [isConfirmDialogVisible, setConfirmDialogVisible] = React.useState(false);
  const selectedSkill = skills.find(experience => experience._id === props.selectedSkillId);
  const selectedItemFields = selectedSkill && {
    Categorie: renderSkill(selectedSkill),
    Omschrijving: selectedSkill.description && selectedSkill.description[props.locale]
  };

  const onAddItem = () => {
    const id = createUuid();
    props.replaceSkill(id, {
      _id: id,
      cvId: props.selectedCvId,
      skillLevel: 1,
      includeInCv: true
    });
    props.setSelectedSkillId(id);
  };

  const onDeleteItem = () => {
    if (props.selectedSkillId) {
      setConfirmDialogVisible(true);
    }
  };
  const onDeleteConfirmed = () => {
    if (props.selectedSkillId) {
      props.replaceSkill(props.selectedSkillId, {});
      props.setSelectedSkillId(undefined);
    }
    setConfirmDialogVisible(false);
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
                <Stack horizontal
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
                    itemFields={selectedItemFields}
                    isVisible={isConfirmDialogVisible}
                    onProceed={onDeleteConfirmed}
                    onCancel={onDeleteCancelled}
                  />
                </Stack>
              </Stack>
              <CvDetailsList
                columns={columns}
                items={skills}
                instanceContext={skillContext}
                setKey={entityName}
                onRenderItemColumn={onRenderItem}
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
              />
              <CvRating
                label="Niveau"
                field="skillLevel"
                instanceContext={skillContext}
                min={0}
                max={3}
              />
              <CvTextField
                label="Toelichting"
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
  locale: PropTypes.string.isRequired,
  selectedCvId: PropTypes.string,
  skillEntity: PropTypes.object,
  replaceSkill: PropTypes.func.isRequired,
  selectedSkillId: PropTypes.string,
  setSelectedSkillId: PropTypes.func.isRequired
};

const select = (state) => ({
  locale: state.ui.userPrefs.locale,
  selectedCvId: state.ui.selectedId["cv"],
  skillEntity: state.safe.content[entityName],
  selectedSkillId: state.ui.selectedId[entityName]
});

const mapDispatchToProps = (dispatch) => ({
  replaceSkill: (id, instance) => dispatch(changeInstance(entityName, id, instance)),
  setSelectedSkillId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Skill);