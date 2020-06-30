import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, IconButton } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedReferenceId, setDialogConfig } from "../../services/ui/ui-actions";
import { replaceSafeInstance } from "../../services/safe/safe-actions";
import { createId } from "../../services/safe/safe-services";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import ReferenceEdit from "./ReferenceEdit";

const entityName = "reference";

const ReferenceList = (props) => {

  const columns = [
    {
      key: "referentName",
      fieldName: "referentName",
      name: "Naam",
      isResizable: false,
      minWidth: 150,
      maxWidth: 150,
      data: "string"
    },
    {
      key: "referentFunction",
      fieldName: "referentFunction",
      onRender: (reference) => reference.referentFunction[props.locale],
      name: "Functie",
      isResizable: true,
      minWidth: 150,
      isSorted: false,
      isSortedDescending: false,
      data: "string"
    },
    {
      key: "description",
      fieldName: "description",
      onRender: (reference) => reference.description[props.locale],
      name: "Omschrijving",
      isResizable: true,
      minWidth: 150,
      isSorted: false,
      isSortedDescending: false,
      data: "string"
    },
    {
      key: "includeInCv",
      fieldName: "includeInCv",
      name: "In cv",
      isResizable: true,
      minWidth: 80,
      isSorted: false,
      isSortedDescending: false,
      data: "bool"
    }
  ];

  // Find all {references} of the selected {cv}.
  const references = props.referenceEntity
    && props.selectedCvId
    && Object.values(props.referenceEntity).filter((instance) => instance.cvId === props.selectedCvId)
    || [];

  const referenceContext = {
    locale: props.locale,
    entity: props.referenceEntity,
    entityId: props.selectedReferenceId,
    setSelectedInstance: props.setSelectedReferenceId
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
    props.replaceReference(id, {
      _id: id,
      cvId: props.selectedCvId,
      name: {}
    });
    props.setSelectedReferenceId(id);
    props.setDialogConfig(true);

    setTimeout(() => { // TODO: fix this
      selection.setAllSelected(false);
      selection.setKeySelected(id, true, false);
    }, 10);
  };

  const onEditItem = () => props.setDialogConfig(true);

  const onDeleteItem = () => {
    if (props.selectedReferenceId) {
      props.replaceReference(props.selectedReferenceId, {});
      props.setSelectedReferenceId(undefined);
    }
  };

  return (
    <Stack styles={viewStyles}>
      <Stack horizontal>
        <Text variant="xxLarge">Referenties</Text>
        <IconButton
          iconProps={{ iconName: "Add" }}
          onClick={onAddItem} />
        <IconButton
          iconProps={{ iconName: "Edit" }}
          disabled={!props.selectedReferenceId}
          onClick={onEditItem} />
        <IconButton
          iconProps={{ iconName: "Delete" }}
          disabled={!props.selectedReferenceId}
          onClick={onDeleteItem} />
      </Stack>
      <CvDetailsList
        columns={columns}
        items={references}
        instanceContext={referenceContext}
        setKey={entityName}
        onExposeSelectionRef={onExposeSelectionRef}
        onItemInvoked={onEditItem} />
      <ReferenceEdit
        instanceContext={referenceContext}/>
    </Stack>
  );
};

ReferenceList.propTypes = {
  locale: PropTypes.string.isRequired,
  selectedCvId: PropTypes.string,
  referenceEntity: PropTypes.object,
  replaceReference: PropTypes.func.isRequired,
  selectedReferenceId: PropTypes.string,
  setSelectedReferenceId: PropTypes.func.isRequired,
  setDialogConfig: PropTypes.func.isRequired
};

const select = (state) => ({
  locale: state.ui.locale,
  selectedCvId: state.ui.selectedCvId,
  referenceEntity: state.safe[entityName],
  selectedReferenceId: state.ui.selectedReferenceId
});

const mapDispatchToProps = (dispatch) => ({
  replaceReference: (id, instance) => dispatch(replaceSafeInstance(entityName, id, instance)),
  setSelectedReferenceId: (referenceId) => dispatch(setSelectedReferenceId(referenceId)),
  setDialogConfig: (isOpen) => dispatch(setDialogConfig(entityName, {isOpen}))
});

export default connect(select, mapDispatchToProps)(ReferenceList);