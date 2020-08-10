import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, IconButton } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId, setDialogConfig } from "../../services/ui/ui-actions";
import { replaceSafeInstance } from "../../services/safe/safe-actions";
import { createUuid } from "../../services/safe/safe-services";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvTextField } from "../widgets/CvTextField";
import { CvCheckbox } from "../widgets/CvCheckbox";

const entityName = "reference";

const Reference = (props) => {

  const columns = [
    {
      key: "referentName",
      fieldName: "referentName",
      name: "Naam",
      isResizable: false,
      minWidth: 150,
      data: "string"
    },
    {
      key: "referentFunction",
      localeFieldName: "referentFunction",
      name: "Functie",
      isResizable: true,
      minWidth: 150,
      data: "string"
    },
    {
      key: "description",
      localeFieldName: "description",
      name: "Omschrijving",
      isResizable: true,
      minWidth: 150,
      data: "string"
    },
    {
      key: "includeInCv",
      fieldName: "includeInCv",
      name: "In cv",
      isResizable: false,
      minWidth: 40,
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

  const onRenderItem = (item, number, column) => {
    switch (column.fieldName) {
    case "includeInCv":
      return <CvCheckbox
        field="includeInCv"
        instanceContext={{
          ...referenceContext,
          entityId: item._id
        }} />;
    default:
      return item[column.fieldName];
    }
  };

  const onAddItem = () => {
    const id = createUuid();
    props.replaceReference(id, {
      _id: id,
      cvId: props.selectedCvId
    });
    props.setSelectedReferenceId(id);
    props.setDialogConfig(true);

    setTimeout(() => { // TODO: fix this
      selection.setAllSelected(false);
      selection.setKeySelected(id, true, false);
    }, 10);
  };

  const onDeleteItem = () => {
    if (props.selectedReferenceId) {
      props.replaceReference(props.selectedReferenceId, {});
      props.setSelectedReferenceId(undefined);
      props.setDialogConfig(false);
    }
  };

  return (
    <table width="100%">
      <tr>
        <td width="40%" valign="top">
          <Stack styles={viewStyles}>
            <Stack horizontal>
              <Text variant="xxLarge">Referenties</Text>
              <IconButton
                iconProps={{ iconName: "Add" }}
                onClick={onAddItem} />
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
              onRenderItemColumn={onRenderItem}
              onExposeSelectionRef={onExposeSelectionRef} />
          </Stack>
        </td>

        <td width="60%" valign="top">
          <Stack>
            <CvTextField
              label="Naam"
              field="referentName"
              instanceContext={referenceContext} />
            <CvTextField
              label="Functie"
              localeField="referentFunction"
              instanceContext={referenceContext} />
            <CvTextField
              label="Omschrijving"
              localeField="description"
              instanceContext={referenceContext} />
          </Stack>
        </td>
      </tr> 
    </table>
  );
};

Reference.propTypes = {
  locale: PropTypes.string.isRequired,
  selectedCvId: PropTypes.string,
  referenceEntity: PropTypes.object,
  replaceReference: PropTypes.func.isRequired,
  selectedReferenceId: PropTypes.string,
  setSelectedReferenceId: PropTypes.func.isRequired,
  dialogConfig: PropTypes.object.isRequired,
  setDialogConfig: PropTypes.func.isRequired
};

const select = (state) => ({
  locale: state.ui.locale,
  selectedCvId: state.ui.selectedId["cv"],
  referenceEntity: state.safe[entityName],
  selectedReferenceId: state.ui.selectedId[entityName],
  dialogConfig: state.ui.dialogConfig[entityName] || {}
});

const mapDispatchToProps = (dispatch) => ({
  replaceReference: (id, instance) => dispatch(replaceSafeInstance(entityName, id, instance)),
  setSelectedReferenceId: (referenceId) => dispatch(setSelectedId(entityName, referenceId)),
  setDialogConfig: (isOpen) => dispatch(setDialogConfig(entityName, {isOpen}))
});

export default connect(select, mapDispatchToProps)(Reference);