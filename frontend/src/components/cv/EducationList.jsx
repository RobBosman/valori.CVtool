import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { selectEducationId } from "../../services/ui/ui-actions";
import CvDetailsList from "../widgets/CvDetailsList";

const EducationList = (props) => {

  const columns = [
    {
      key: "type",
      fieldName: "type",
      name: "Soort opleiding",
      iconName: "PublishCourse",
      isIconOnly: true,
      isResizable: false,
      minWidth: 40,
      maxWidth: 40,
      data: "string"
    },
    {
      key: "name",
      fieldName: "name",
      onRender: (education) => education.name[props.locale],
      name: "Opleiding",
      isResizable: true,
      minWidth: 150,
      isSorted: false,
      isSortedDescending: false,
      data: "string"
    },
    {
      key: "institution",
      fieldName: "institution",
      name: "Opleidingsinstituut",
      isResizable: true,
      minWidth: 150,
      data: "string"
    },
    {
      key: "result",
      fieldName: "result",
      name: "Resultaat",
      isResizable: true,
      data: "string"
    },
    {
      key: "year",
      fieldName: "year",
      name: "Jaar",
      isResizable: true,
      minWidth: 40,
      maxWidth: 40,
      data: "number"
    }
  ];

  // Find all {educations} of the selected {cv}.
  const educations = props.educationEntity
    && props.selectedCvId
    && Object.values(props.educationEntity).filter((instance) => instance.cvId === props.selectedCvId)
    || [];

  const exposeSelectionRef = (selectionRef) => props.onExposeSelectionRef && props.onExposeSelectionRef(selectionRef);

  const instanceContext = {
    entity: props.educationEntity,
    entityId: props.educationId,
    selectInstance: props.selectEducationId
  };

  return (
    <CvDetailsList
      columns={columns}
      items={educations}
      instanceContext={instanceContext}
      setKey="educations"
      onExposeSelectionRef={exposeSelectionRef}/>
  );
};

EducationList.propTypes = {
  selectedCvId: PropTypes.string,
  educationEntity: PropTypes.object,
  educationId: PropTypes.string,
  locale: PropTypes.string,
  onExposeSelectionRef: PropTypes.func.isRequired,
  selectEducationId: PropTypes.func.isRequired
};

const select = (state) => ({
  locale: state.ui.locale,
  selectedCvId: state.ui.selectedCvId,
  educationId: state.ui.selectedEducationId,
  educationEntity: state.safe.education
});

const mapDispatchToProps = (dispatch) => ({
  selectEducationId: (educationId) => dispatch(selectEducationId(educationId))
});

export default connect(select, mapDispatchToProps)(EducationList);