import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, IconButton } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId, setDialogConfig } from "../../services/ui/ui-actions";
import { replaceSafeInstance } from "../../services/safe/safe-actions";
import { createUuid } from "../../services/safe/safe-services";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import ExperienceEdit from "./ExperienceEdit";

const entityName = "experience";

const ExperienceList = (props) => {
  const columns = [
    {
      key: "periodBegin",
      fieldName: "periodBegin",
      name: "van",
      isResizable: false,
      minWidth: 100,
      maxWidth: 100,
      data: "date"
    },
    {
      key: "periodEnd",
      fieldName: "periodEnd",
      name: "t/m",
      isResizable: false,
      minWidth: 100,
      maxWidth: 100,
      data: "date"
    },
    {
      key: "employer",
      fieldName: "employer",
      name: "Werkgever",
      isResizable: false,
      minWidth: 100,
      maxWidth: 100,
      data: "string"
    },
    {
      key: "client",
      fieldName: "client",
      name: "Opdrachtgever",
      isResizable: false,
      minWidth: 100,
      maxWidth: 100,
      data: "string"
    },
    {
      key: "role",
      localeFieldName: "role",
      name: "Rol",
      isResizable: true,
      minWidth: 150,
      isSorted: false,
      isSortedDescending: false,
      data: "string"
    },
    {
      key: "assignment",
      localeFieldName: "assignment",
      name: "Opdrachtomschrijving",
      isResizable: true,
      minWidth: 150,
      isSorted: false,
      isSortedDescending: false,
      data: "string"
    },
    {
      key: "activities",
      localeFieldName: "activities",
      name: "Activiteiten",
      isResizable: true,
      minWidth: 150,
      isSorted: false,
      isSortedDescending: false,
      data: "string"
    },
    {
      key: "results",
      localeFieldName: "results",
      name: "Resultaten",
      isResizable: true,
      minWidth: 150,
      isSorted: false,
      isSortedDescending: false,
      data: "string"
    },
    {
      key: "keywords",
      localeFieldName: "keywords",
      name: "Keywords",
      isResizable: true,
      minWidth: 150,
      isSorted: false,
      isSortedDescending: false,
      data: "string"
    },
    {
      key: "sortIndex",
      fieldName: "sortIndex",
      name: "sortIndex",
      isResizable: false,
      minWidth: 100,
      data: "number"
    },
    {
      key: "includeInCv",
      fieldName: "includeInCv",
      name: "In Cv",
      isResizable: false,
      minWidth: 100,
      data: "bool"
    }
  ];

  // Find all {Experiences} of the selected {cv}.
  const experiences = props.experienceEntity
    && props.selectedCvId
    && Object.values(props.experienceEntity).filter((instance) => instance.cvId === props.selectedCvId)
    || [];

  const experienceContext = {
    locale: props.locale,
    entity: props.experienceEntity,
    entityId: props.selectedExperienceId,
    setSelectedInstance: props.setSelectedExperienceId
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
    props.replaceExperience(id, {
      _id: id,
      cvId: props.selectedCvId
    });
    props.setSelectedExperienceId(id);
    props.setDialogConfig(true);

    setTimeout(() => { // TODO: fix this
      selection.setAllSelected(false);
      selection.setKeySelected(id, true, false);
    }, 10);
  };

  const onEditItem = () => props.setDialogConfig(!props.dialogConfig?.isOpen);

  const onDeleteItem = () => {
    if (props.selectedExperienceId) {
      props.replaceExperience(props.selectedExperienceId, {});
      props.setSelectedExperienceId(undefined);
      props.setDialogConfig(false);
    }
  };

  return (
    <Stack styles={viewStyles}>
      <Stack horizontal>
        <Text variant="xxLarge">Werkervaring</Text>
        <IconButton
          iconProps={{ iconName: "Add" }}
          onClick={onAddItem} />
        <IconButton
          iconProps={{ iconName: "Edit" }}
          disabled={!props.selectedExperienceId}
          onClick={onEditItem} />
        <IconButton
          iconProps={{ iconName: "Delete" }}
          disabled={!props.selectedExperienceId}
          onClick={onDeleteItem} />
      </Stack>
      <CvDetailsList
        columns={columns}
        items={experiences}
        instanceContext={experienceContext}
        setKey={entityName}
        onExposeSelectionRef={onExposeSelectionRef}
        onItemInvoked={onEditItem} />
      <ExperienceEdit
        instanceContext={experienceContext}/>
    </Stack>
  );
};

ExperienceList.propTypes = {
  locale: PropTypes.string.isRequired,
  selectedCvId: PropTypes.string,
  experienceEntity: PropTypes.object,
  replaceExperience: PropTypes.func.isRequired,
  selectedExperienceId: PropTypes.string,
  setSelectedExperienceId: PropTypes.func.isRequired,
  dialogConfig: PropTypes.object.isRequired,
  setDialogConfig: PropTypes.func.isRequired
};

const select = (state) => ({
  locale: state.ui.locale,
  selectedCvId: state.ui.selectedId["cv"],
  experienceEntity: state.safe[entityName],
  selectedExperienceId: state.ui.selectedId[entityName],
  dialogConfig: state.ui.dialogConfig[entityName] || {}
});

const mapDispatchToProps = (dispatch) => ({
  replaceExperience: (id, instance) => dispatch(replaceSafeInstance(entityName, id, instance)),
  setSelectedExperienceId: (experienceId) => dispatch(setSelectedId(entityName, experienceId)),
  setDialogConfig: (isOpen) => dispatch(setDialogConfig(entityName, {isOpen}))
});

export default connect(select, mapDispatchToProps)(ExperienceList);