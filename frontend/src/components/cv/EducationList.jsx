import React from "react";
import { DetailsList, DetailsListLayoutMode, Selection } from "@fluentui/react";
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
      minWidth: 40,
      maxWidth: 40,
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
      isSorted: false,
      isSortedDescending: false,
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

  const selection = new Selection({
    getKey: getKey,
    onSelectionChanged: () => {
      props.selectEducationId(selection.getSelection()[0] && selection.getSelection()[0]._id)
    }
  });

  React.useEffect(() => selection.setKeySelected(props.educationId, true, false));

  return (
    <DetailsList
      setKey="educations"
      items={educations}
      getKey={getKey}
      columns={columns}
      isHeaderVisible={true}
      layoutMode={DetailsListLayoutMode.justified}
      selection={selection}
      selectionMode={1}
      selectionPreservedOnEmptyClick={true}
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