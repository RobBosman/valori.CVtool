import React from "react";
import { DetailsList, DetailsListLayoutMode } from "@fluentui/react";
import { connect } from "react-redux"

const columns = [
  {
    key: 'type',
    fieldName: 'type',
    name: 'Soort opleiding',
    iconName: 'PublishCourse',
    isIconOnly: true,
    isResizable: false,
    isCollapsible: true,
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
    isCollapsible: true,
    // maxWidth: 120,
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
    isCollapsible: true,
    // maxWidth: 120,
    // onColumnClick: this._onColumnClick,
    data: 'string'
  },
  {
    key: 'result',
    fieldName: 'result',
    name: 'Resultaat',
    isResizable: true,
    isCollapsible: true,
    // maxWidth: 80,
    data: 'string'
  },
  {
    key: 'year',
    fieldName: 'year',
    name: 'Jaar',
    isResizable: true,
    isCollapsible: true,
    minWidth: 60,
    maxWidth: 60,
    // onColumnClick: this._onColumnClick,
    data: 'string'
  }
];

const EducationList = (props) => {

  const educations = props.educationEntity && props.cvId && Object.values(props.educationEntity).filter((instance) => instance.cvId === props.cvId) || [];

  return (
    <DetailsList
      items={educations}
      columns={columns}
      isHeaderVisible={true}
      layoutMode={DetailsListLayoutMode.justified}
      selectionMode={1}
      selectionPreservedOnEmptyClick={true}
      // getKey={this._getKey}
      setKey="none"
      onActiveItemChanged={props.onActiveItemChanged}
    />
  )
};

const select = (state) => ({
  educationEntity: state.safe.education
});

export default connect(select)(EducationList)