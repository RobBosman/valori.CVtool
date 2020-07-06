import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Stack, Text, IconButton } from "@fluentui/react";
import { setSelectedId, setDialogConfig } from "../../services/ui/ui-actions";
import { useTheme } from "../../services/ui/ui-services";
import { replaceSafeInstance } from "../../services/safe/safe-actions";
import { createUuid } from "../../services/safe/safe-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import EducationEdit from "./EducationEdit";

const entityName = "education";

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
      localeFieldName: "name",
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

  const educationContext = {
    locale: props.locale,
    entity: props.educationEntity,
    entityId: props.selectedEducationId,
    setSelectedInstance: props.setSelectedEducationId
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
    const id = createUuid();
    props.replaceEducation(id, {
      _id: id,
      cvId: props.selectedCvId,
      name: {}
    });
    props.setSelectedEducationId(id);
    props.setDialogConfig(true);

    setTimeout(() => { // TODO: fix this
      selection.setAllSelected(false);
      selection.setKeySelected(id, true, false);
    }, 10);
  };

  const onEditItem = () => props.setDialogConfig(!props.dialogConfig?.isOpen);

  const onDeleteItem = () => {
    if (props.selectedEducationId) {
      props.replaceEducation(props.selectedEducationId, {});
      props.setSelectedEducationId(undefined);
      props.setDialogConfig(false);
    }
  };

  return (
    <Stack styles={viewStyles}>
      <Stack horizontal tokens={{childrenGap: "l1"}}>
        <Stack.Item align="start">
          <Text variant="xxLarge">Opleiding</Text>
        </Stack.Item>
        <Stack.Item align="end">
          <IconButton
            iconProps={{ iconName: "Add" }}
            onClick={onAddItem} />
        </Stack.Item>
        <Stack.Item align="end">
          <IconButton
            iconProps={{ iconName: "Edit" }}
            disabled={!props.selectedEducationId}
            onClick={onEditItem} />
        </Stack.Item>
        <Stack.Item align="end">
          <IconButton
            iconProps={{ iconName: "Delete" }}
            disabled={!props.selectedEducationId}
            onClick={onDeleteItem} />
        </Stack.Item>
      </Stack>
      <CvDetailsList
        columns={columns}
        items={educations}
        instanceContext={educationContext}
        setKey={entityName}
        onExposeSelectionRef={onExposeSelectionRef}
        onItemInvoked={onEditItem} />
      <EducationEdit
        instanceContext={educationContext}/>
    </Stack>
  );
};

EducationList.propTypes = {
  locale: PropTypes.string.isRequired,
  selectedCvId: PropTypes.string,
  educationEntity: PropTypes.object,
  replaceEducation: PropTypes.func.isRequired,
  selectedEducationId: PropTypes.string,
  setSelectedEducationId: PropTypes.func.isRequired,
  dialogConfig: PropTypes.object.isRequired,
  setDialogConfig: PropTypes.func.isRequired
};

const select = (state) => ({
  locale: state.ui.locale,
  selectedCvId: state.ui.selectedId["cv"],
  educationEntity: state.safe[entityName],
  selectedEducationId: state.ui.selectedId[entityName],
  dialogConfig: state.ui.dialogConfig[entityName] || {}
});

const mapDispatchToProps = (dispatch) => ({
  replaceEducation: (id, instance) => dispatch(replaceSafeInstance(entityName, id, instance)),
  setSelectedEducationId: (educationId) => dispatch(setSelectedId(entityName, educationId)),
  setDialogConfig: (isOpen) => dispatch(setDialogConfig(entityName, {isOpen}))
});

export default connect(select, mapDispatchToProps)(EducationList);