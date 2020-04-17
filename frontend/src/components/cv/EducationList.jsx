import React from "react";
import { DetailsList, DetailsListLayoutMode, ChoiceGroupOption } from "@fluentui/react";
import { connect } from "react-redux"
import { selectEducationId } from "../../redux/ui";

const EducationList = (props) => {

  const educations = props.educationEntity && props.cvId && Object.values(props.educationEntity).filter((instance) => instance.cvId === props.cvId) || [];

  const columns = [
    {
      key: 'type',
      fieldName: 'type',
      name: 'Soort opleiding',
      iconName: 'PublishCourse',
      isIconOnly: true,
      isResizable: false,
      // isCollapsible: true,
      minWidth: 20,
      maxWidth: 20,
      // onColumnClick: this._onColumnClick,
      data: 'string'
    },
    {
      key: 'name',
      name: 'Opleiding',
      // isRowHeader: true,
      isResizable: true,
      // isCollapsible: false,
      minWidth: 150,
      // isSorted: true,
      // isSortedDescending: false,
      // sortAscendingAriaLabel: 'Sorted A to Z',
      // sortDescendingAriaLabel: 'Sorted Z to A',
      // onColumnClick: this._onColumnClick,
      data: 'string',
      onRender: (education) => education.name['nl_NL']
    },
    {
      key: 'institution',
      fieldName: 'institution',
      name: 'Opleidingsinstituut',
      isResizable: true,
      // isCollapsible: true,
      minWidth: 150,
      // maxWidth: 120,
      // onColumnClick: this._onColumnClick,
      data: 'string'
    },
    {
      key: 'result',
      fieldName: 'result',
      name: 'Resultaat',
      isResizable: true,
      // isCollapsible: true,
      // maxWidth: 80,
      data: 'string'
    },
    {
      key: 'year',
      fieldName: 'year',
      name: 'Jaar',
      isResizable: true,
      // isCollapsible: true,
      minWidth: 40,
      maxWidth: 40,
      // onColumnClick: this._onColumnClick,
      data: 'string'
    }
  ];

  const getKey = (item) => {
    return item._id
  };

  const onActiveItemChanged = (item) => {
    props.selectEducationId(item && item._id);
  };

  return (
    <DetailsList
      items={educations}
      columns={columns}
      isHeaderVisible={true}
      layoutMode={DetailsListLayoutMode.justified}
      selectionMode={1}
      selectionPreservedOnEmptyClick={true}
      // getKey={getKey}
      // setKey={props.cvId}
      onActiveItemChanged={onActiveItemChanged}
    />
  )
};

const select = (state) => ({
  cvId: state.ui.selected.cvId,
  educationId: state.ui.selected.educationId,
  educationEntity: state.safe.education
});

const mapDispatchToProps = (dispatch) => ({
  selectEducationId: (educationId) => dispatch(selectEducationId(educationId))
});

export default connect(select, mapDispatchToProps)(EducationList)