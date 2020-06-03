import PropTypes from "prop-types";
import React from "react";
import { Text } from "@fluentui/react";
import { connect } from "react-redux";
import { selectSkillId, setDialogConfig } from "../../services/ui/ui-actions";
import CvDetailsList from "../widgets/CvDetailsList";
import SkillEdit from "./SkillEdit";

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
      fieldName: "description",
      onRender: (skill) => skill.description[props.locale],
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
      name: "Niveau",
      isResizable: false,
      minWidth: 100,
      data: "string"
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
    selectInstance: props.selectSkillId
  };

  return (
    <div>
      <Text variant="xxLarge">Vaardigheden</Text>
      <CvDetailsList
        columns={columns}
        items={skills}
        instanceContext={skillContext}
        setKey="skill"
        onItemInvoked={() => props.setDialogConfig(true)} />
      <SkillEdit
        instanceContext={skillContext}/>
    </div>
  );
};

SkillList.propTypes = {
  locale: PropTypes.string.isRequired,
  selectedCvId: PropTypes.string,
  skillEntity: PropTypes.object,
  selectedSkillId: PropTypes.string,
  selectSkillId: PropTypes.func.isRequired,
  setDialogConfig: PropTypes.func.isRequired
};

const select = (state) => ({
  locale: state.ui.locale,
  selectedCvId: state.ui.selectedCvId,
  skillEntity: state.safe.skill,
  selectedSkillId: state.ui.selectedSkillId
});

const mapDispatchToProps = (dispatch) => ({
  selectSkillId: (skillId) => dispatch(selectSkillId(skillId)),
  setDialogConfig: (isOpen) => dispatch(setDialogConfig("skill", {isOpen}))
});

export default connect(select, mapDispatchToProps)(SkillList);