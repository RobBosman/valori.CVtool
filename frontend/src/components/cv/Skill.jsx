import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, IconButton } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId } from "../../services/ui/ui-actions";
import { replaceSafeInstance } from "../../services/safe/safe-actions";
import { createUuid } from "../../services/safe/safe-services";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvTextField } from "../widgets/CvTextField";
import { CvCheckbox } from "../widgets/CvCheckbox";
import { CvDropdown } from "../widgets/CvDropdown";
import { SkillCategories } from "./Enums";
import { CvRating } from "../widgets/CvRating";

const entityName = "skill";

const Skill = (props) => {

  const columns = [
    {
      key: "category",
      fieldName: "category",
      name: "Soort opleiding",
      isResizable: false,
      minWidth: 150,
      maxWidth: 150,
      data: "string"
    },
    {
      key: "description",
      localeFieldName: "description",
      name: "Omschrijving",
      isResizable: true,
      minWidth: 150,
      isSorted: false,
      isSortedDescending: false,
      data: "string"
    },
    {
      key: "skillLevel",
      fieldName: "skillLevel",
      onRender: (skill) => "* ".repeat(skill.skillLevel),
      name: "Niveau",
      isResizable: false,
      minWidth: 100,
      data: "number"
    }
  ];

  // Find all {Skill} of the selected {cv}.
  const skills = props.skillEntity
    && props.selectedCvId
    && Object.values(props.skillEntity).filter((instance) => instance.cvId === props.selectedCvId)
    || [];

  const skillContext = {
    locale: props.locale,
    entity: props.skillEntity,
    entityId: props.selectedSkillId,
    setSelectedInstance: props.setSelectedSkillId,
    replaceInstance: props.replaceSkill
  };

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

  let selection;
  const onExposeSelectionRef = (selectionRef) => {
    selection = selectionRef;
  };

  const onRenderItem = (item, number, column) => {
    switch (column.fieldName) {
    case "includeInCv":
      return <CvCheckbox
        field="includeInCv"
        instanceContext={{
          ...skillContext,
          entityId: item._id
        }} />;
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

    setTimeout(() => { // TODO: fix this?
      selection.setAllSelected(false);
      selection.setKeySelected(id, true, false);
    }, 1);
  };

  const onDeleteItem = () => {
    if (props.selectedSkillId) {
      props.replaceSkill(props.selectedSkillId, {});
      props.setSelectedSkillId(undefined);
    }
  };

  return (
    <table width="100%" style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <td width="40%" valign="top">
            <Stack styles={viewStyles}>
              <Stack horizontal>
                <Text variant="xxLarge">Vaardigheden</Text>
                <IconButton
                  iconProps={{ iconName: "Add" }}
                  onClick={onAddItem} />
                <IconButton
                  iconProps={{ iconName: "Delete" }}
                  disabled={!props.selectedSkillId}
                  onClick={onDeleteItem} />
              </Stack>
              <CvDetailsList
                columns={columns}
                items={skills}
                instanceContext={skillContext}
                setKey={entityName}
                onRenderItemColumn={onRenderItem}
                onExposeSelectionRef={onExposeSelectionRef} />
            </Stack>
          </td>

          <td width="60%" valign="top">
            <Stack styles={editStyles}>
              <CvDropdown
                label="Categorie"
                field="category"
                instanceContext={skillContext}
                options={SkillCategories[skillContext.locale]} />
              <CvTextField
                label="Omschrijving"
                localeField="description"
                instanceContext={skillContext} />
              <CvRating
                label="Niveau"
                field="skillLevel"
                instanceContext={skillContext} />
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
  skillEntity: state.safe[entityName],
  selectedSkillId: state.ui.selectedId[entityName],
  replaceSkill: PropTypes.func.isRequired,
});

const mapDispatchToProps = (dispatch) => ({
  replaceSkill: (id, instance) => dispatch(replaceSafeInstance(entityName, id, instance)),
  setSelectedSkillId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Skill);