import React from "react";
import { connect } from "react-redux";
import { selectSkillId } from "../../services/ui/ui-actions";
import CvDetailsList from "../widgets/CvDetailsList";

const select = (state) => ({
  locale: state.ui.locale,
  cvId: state.ui.selected.cvId,
  skillEntity: state.safe.skill,
  skillId: state.ui.selected.skillId
});

const mapDispatchToProps = (dispatch) => ({
  selectSkillId: (skillId) => dispatch(selectSkillId(skillId))
});

const SkillList = (props) => {
  const columns = [
    {
      key: 'category',
      fieldName: 'category',
      name: 'Soort opleiding',
      isResizable: false,
      minWidth: 150,
      maxWidth: 150,
      data: 'string'
    },
    {
      key: 'description',
      fieldName: 'description',
      onRender: (skill) => skill.description[props.locale],
      name: 'Omschrijving',
      isResizable: true,
      minWidth: 150,
      isSorted: false,
      isSortedDescending: false,
      data: 'string'
    },
    {
      key: 'skillLevel',
      fieldName: 'skillLevel',
      name: 'Niveau',
      isResizable: false,
      minWidth: 100,
      data: 'string'
    }
  ];
  // Find all {skills} of the selected {cv}.
  const skills = props.skillEntity
    && props.cvId
    && Object.values(props.skillEntity).filter((instance) => instance.cvId === props.cvId)
    || [];

  const instanceContext = {
    entity: props.skillEntity,
    entityId: props.skillId,
    selectInstance: props.selectSkillId
  };

  return (
    <CvDetailsList
      columns={columns}
      items={skills}
      instanceContext={instanceContext}
      setKey="skill" />
  )
};

export default connect(select, mapDispatchToProps)(SkillList)