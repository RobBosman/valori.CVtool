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

const entityName = "skill";

const Skill = (props) => {

  const compareStrings = (l, r) =>
    l < r ? -1 : l > r ? 1 : 0;

  // Find all {Skill} of the selected {cv}.
  const skills = props.skillEntity
    && props.selectedCvId
    && Object.values(props.skillEntity)
      .filter((instance) => instance.cvId === props.selectedCvId)
      .sort((l, r) => {
        let compare = (getEnumData(SkillCategories, l.category)?.sortIndex || 0) - (getEnumData(SkillCategories, r.category)?.sortIndex || 0);
        if (compare === 0) {
          compare = (r.skillLevel || 0) - (l.skillLevel || 0);
        }
        if (compare === 0) {
          compare = compareStrings(l.description, r.description);
        }
        return compare;
      })
    || [];

  const skillContext = {
    locale: props.locale,
    entity: props.skillEntity,
    instanceId: props.selectedSkillId,
    setSelectedInstance: props.setSelectedSkillId,
    replaceInstance: props.replaceSkill
  };

  const columns = [
    {
      key: "category",
      fieldName: "category",
      name: "Categorie",
      onRender: (item) => getEnumData(SkillCategories, item.category)?.text || item.category,
      isResizable: false,
      minWidth: 120,
      maxWidth: 120,
      data: "string"
    },
    {
      key: "description",
      localeFieldName: "description",
      name: "Omschrijving",
      isResizable: true,
      isSorted: false,
      isSortedDescending: false,
      data: "string"
    },
    {
      key: "skillLevel",
      fieldName: "skillLevel",
      name: "Niveau",
      onRender: (item) => "* ".repeat(item.skillLevel),
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
        padding: 20
      }
    ]
  };
  const editStyles = {
    root: [
      {
        background: editPaneColor,
        padding: 20
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

  const onAddItem = () => {
    const id = createUuid();
    props.replaceSkill(id, {
      _id: id,
      cvId: props.selectedCvId,
      includeInCv: true
    });
    props.setSelectedSkillId(id);
  };

  const onDeleteItem = () => {
    if (props.selectedSkillId) {
      props.replaceSkill(props.selectedSkillId, {});
      props.setSelectedSkillId(undefined);
    }
  };

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
                allowFreeform={true}
              />
              <CvTextField
                label="Omschrijving"
                localeField="description"
                instanceContext={skillContext}
              />
              <CvRating
                label="Niveau"
                field="skillLevel"
                instanceContext={skillContext}
                min={0}
                max={3}
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
  locale: state.ui.locale,
  selectedCvId: state.ui.selectedId["cv"],
  skillEntity: state.safe.content[entityName],
  selectedSkillId: state.ui.selectedId[entityName]
});

const mapDispatchToProps = (dispatch) => ({
  replaceSkill: (id, instance) => dispatch(changeInstance(entityName, id, instance)),
  setSelectedSkillId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Skill);