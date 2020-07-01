import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, IconButton } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedSkillId, setDialogConfig } from "../../services/ui/ui-actions";
import { replaceSafeInstance } from "../../services/safe/safe-actions";
import { createId } from "../../services/safe/safe-services";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import SkillEdit from "./SkillEdit";

const entityName = "skill";

const SkillList = (props) => {

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

  // Find all {skills} of the selected {cv}.
  const skills = props.skillEntity
    && props.selectedCvId
    && Object.values(props.skillEntity).filter((instance) => instance.cvId === props.selectedCvId)
    || [];

  const skillContext = {
    locale: props.locale,
    entity: props.skillEntity,
    entityId: props.selectedSkillId,
    setSelectedInstance: props.setSelectedSkillId
  };

  const { viewPaneColor } = useTheme();
  const viewStyles = {
    root: [
      {
        background: viewPaneColor,
        padding: 20
      }
    ]
  };

  let selection;
  const onExposeSelectionRef = (selectionRef) => {
    selection = selectionRef;
  };

  const onAddItem = () => {
    const id = createId();
    props.replaceSkill(id, {
      _id: id,
      cvId: props.selectedCvId
    });
    props.setSelectedSkillId(id);
    props.setDialogConfig(true);

    setTimeout(() => { // TODO: fix this
      selection.setAllSelected(false);
      selection.setKeySelected(id, true, false);
    }, 10);
  };

  const onEditItem = () => props.setDialogConfig(!props.dialogConfig?.isOpen);

  const onDeleteItem = () => {
    if (props.selectedSkillId) {
      props.replaceSkill(props.selectedSkillId, {});
      props.setSelectedSkillId(undefined);
      props.setDialogConfig(false);
    }
  };

  return (
    <Stack styles={viewStyles}>
      <Stack horizontal>
        <Text variant="xxLarge">Vaardigheden</Text>
        <IconButton
          iconProps={{ iconName: "Add" }}
          onClick={onAddItem} />
        <IconButton
          iconProps={{ iconName: "Edit" }}
          disabled={!props.selectedSkillId}
          onClick={onEditItem} />
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
        onExposeSelectionRef={onExposeSelectionRef}
        onItemInvoked={onEditItem} />
      <SkillEdit
        instanceContext={skillContext}/>
    </Stack>
  );
};

SkillList.propTypes = {
  locale: PropTypes.string.isRequired,
  selectedCvId: PropTypes.string,
  skillEntity: PropTypes.object,
  replaceSkill: PropTypes.func.isRequired,
  selectedSkillId: PropTypes.string,
  setSelectedSkillId: PropTypes.func.isRequired,
  dialogConfig: PropTypes.object.isRequired,
  setDialogConfig: PropTypes.func.isRequired
};

const select = (state) => ({
  locale: state.ui.locale,
  selectedCvId: state.ui.selectedCvId,
  skillEntity: state.safe[entityName],
  selectedSkillId: state.ui.selectedSkillId,
  dialogConfig: state.ui.dialogConfig[entityName] || {}
});

const mapDispatchToProps = (dispatch) => ({
  replaceSkill: (id, instance) => dispatch(replaceSafeInstance(entityName, id, instance)),
  setSelectedSkillId: (skillId) => dispatch(setSelectedSkillId(skillId)),
  setDialogConfig: (isOpen) => dispatch(setDialogConfig(entityName, {isOpen}))
});

export default connect(select, mapDispatchToProps)(SkillList);