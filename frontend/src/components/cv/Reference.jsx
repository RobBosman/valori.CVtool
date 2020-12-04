import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, DefaultButton } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId } from "../../services/ui/ui-actions";
import { changeInstance } from "../../services/safe/safe-actions";
import { createUuid } from "../../services/safe/safe-services";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvTextField } from "../widgets/CvTextField";
import { CvCheckbox } from "../widgets/CvCheckbox";
import * as commonUtils from "../../utils/CommonUtils";
import ConfirmDialog from "../ConfirmDialog";

const entityName = "reference";

const Reference = (props) => {

  const referenceContext = {
    entity: props.referenceEntity,
    instanceId: props.selectedReferenceId,
    setSelectedInstance: props.setSelectedReferenceId,
    replaceInstance: props.replaceReference
  };
  
  // Find all {references} of the selected {cv}.
  const references = React.useCallback(
    props.referenceEntity && props.selectedCvId && Object.values(props.referenceEntity)
      .filter(instance => instance.cvId === props.selectedCvId)
      .sort((l, r) => commonUtils.compareStrings(l.referentName, r.referentName))
      || [],
    [props.referenceEntity, props.selectedCvId]);

  const renderInCvCheckbox = (item) =>
    <CvCheckbox
      field="includeInCv"
      instanceContext={{ ...referenceContext, instanceId: item._id }}
    />;

  const columns = [
    {
      key: "referentName",
      fieldName: "referentName",
      name: "Naam",
      isResizable: true,
      minWidth: 100,
      maxWidth: 300,
      data: "string"
    },
    {
      key: "referentFunction",
      fieldName: `referentFunction.${props.locale}`,
      name: "Functie",
      isResizable: true,
      minWidth: 200,
      maxWidth: 400,
      data: "string"
    },
    {
      key: "includeInCv",
      fieldName: "includeInCv",
      name: "In cv",
      onRender: renderInCvCheckbox,
      isResizable: false,
      minWidth: 40,
      maxWidth: 40
    }
  ];

  const { viewPaneColor, editPaneColor } = useTheme();
  const viewStyles = {
    root: [
      {
        background: viewPaneColor,
        padding: 20,
        minWidth: 350,
        height: "calc(100vh - 170px)"
      }
    ]
  };
  const editStyles = {
    root: [
      {
        background: editPaneColor,
        padding: 20,
        height: "calc(100vh - 170px)"
      }
    ]
  };
  const tdStyle = {
    width: "calc(50vw - 98px)"
  };

  const [isConfirmDialogVisible, setConfirmDialogVisible] = React.useState(false);
  const selectedReference = references.find(experience => experience._id === props.selectedReferenceId);
  const selectedItemFields = selectedReference && {
    Naam: selectedReference.referentName,
    Functie: selectedReference.referentFunction && selectedReference.referentFunction[props.locale]
  };

  const isFilledReference = (reference) =>
    reference.referentName || commonUtils.isFilledLocaleField(reference.referentFunction);

  const onAddItem = () => {
    let newReference = references.find(publication => !isFilledReference(publication));
    if (!newReference) {
      newReference = {
        _id: createUuid(),
        cvId: props.selectedCvId,
        includeInCv: true
      };
      props.replaceReference(newReference._id, newReference);
    }
    props.setSelectedReferenceId(newReference._id);
  };

  const onDeleteItem = () => {
    if (props.selectedReferenceId) {
      setConfirmDialogVisible(true);
    }
  };
  const onDeleteConfirmed = () => {
    if (props.selectedReferenceId) {
      props.replaceReference(props.selectedReferenceId, {});
      props.setSelectedReferenceId(undefined);
    }
    setConfirmDialogVisible(false);
  };
  const onDeleteCancelled = () =>
    setConfirmDialogVisible(false);

  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <td valign="top" style={tdStyle}>
            <Stack styles={viewStyles}>
              <Stack horizontal horizontalAlign="space-between"
                tokens={{ childrenGap: "l1" }}>
                <Text variant="xxLarge">Referenties</Text>
                <Stack horizontal
                  tokens={{ childrenGap: "l1" }}>
                  <DefaultButton
                    text="Toevoegen"
                    iconProps={{ iconName: "Add" }}
                    disabled={!props.selectedCvId}
                    onClick={onAddItem}
                  />
                  <DefaultButton
                    text="Verwijderen"
                    iconProps={{ iconName: "Delete" }}
                    disabled={!props.selectedReferenceId}
                    onClick={onDeleteItem}
                  />
                  <ConfirmDialog
                    title="Definitief verwijderen?"
                    primaryButtonText="Verwijderen"
                    itemFields={selectedItemFields}
                    isVisible={isConfirmDialogVisible}
                    onProceed={onDeleteConfirmed}
                    onCancel={onDeleteCancelled}
                  />
                </Stack>
              </Stack>
              <CvDetailsList
                columns={columns}
                items={references}
                instanceContext={referenceContext}
                setKey={entityName}
              />
            </Stack>
          </td>

          <td valign="top" style={tdStyle}>
            <Stack styles={editStyles}>
              <CvTextField
                label="Naam"
                field="referentName"
                instanceContext={referenceContext}
              />
              <CvTextField
                label="Functie"
                field={`referentFunction.${props.locale}`}
                instanceContext={referenceContext}
              />
              <CvTextField
                label="Omschrijving"
                field={`description.${props.locale}`}
                instanceContext={referenceContext}
                multiline
                autoAdjustHeight
                validateInput={commonUtils.isValidText(120)}
              />
            </Stack>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

Reference.propTypes = {
  locale: PropTypes.string.isRequired,
  selectedCvId: PropTypes.string,
  referenceEntity: PropTypes.object,
  replaceReference: PropTypes.func.isRequired,
  selectedReferenceId: PropTypes.string,
  setSelectedReferenceId: PropTypes.func.isRequired
};

const select = (state) => ({
  locale: state.ui.userPrefs.locale,
  selectedCvId: state.ui.selectedId.cv,
  referenceEntity: state.safe.content[entityName],
  selectedReferenceId: state.ui.selectedId[entityName]
});

const mapDispatchToProps = (dispatch) => ({
  replaceReference: (id, instance) => dispatch(changeInstance(entityName, id, instance)),
  setSelectedReferenceId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Reference);