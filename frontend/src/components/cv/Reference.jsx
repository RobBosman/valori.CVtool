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

  const cv = props.cvEntity && props.cvEntity[props.selectedCvId];
  const isEditable = commonUtils.isAccountEditable(cv?.accountId, props.authInfo);

  const referenceContext = {
    entity: props.referenceEntity,
    instanceId: props.selectedReferenceId,
    setSelectedInstanceId: props.setSelectedReferenceId,
    replaceInstance: props.replaceReference,
    readOnly: !isEditable
  };
  
  // Find all {references} of the selected {cv}.
  const references = React.useMemo(() =>
    props.selectedCvId && Object.values(props.referenceEntity || {})
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
      maxWidth: 300
    },
    {
      key: "referentFunction",
      fieldName: `referentFunction.${props.locale}`,
      name: "Functie",
      isResizable: true,
      minWidth: 190,
      maxWidth: 400
    },
    {
      key: "includeInCv",
      fieldName: "includeInCv",
      name: "In cv",
      onRender: renderInCvCheckbox,
      isResizable: false,
      minWidth: 50,
      maxWidth: 50,
      data: "boolean"
    }
  ];

  const {viewPaneBackground, editPaneBackground} = useTheme();
  const viewStyles = {
    root: {
      background: viewPaneBackground,
      padding: 20,
      minWidth: 350,
      height: "calc(100vh - 170px)"
    }
  };
  const editStyles = {
    root: {
      background: editPaneBackground,
      padding: 20,
      height: "calc(100vh - 170px)"
    }
  };
  const tdStyle = {
    width: "calc(50vw - 98px)"
  };

  const [isConfirmDialogVisible, setConfirmDialogVisible] = React.useState(false);
  const selectedItemFields = React.useCallback(() => {
    const selectedReference = references.find(reference => reference._id === props.selectedReferenceId);
    return selectedReference && {
      Naam: selectedReference.referentName,
      Functie: commonUtils.getValueOrFallback(selectedReference, "referentFunction", props.locale)
    };
  },
  [references, props.selectedReferenceId, props.locale]);

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
    setConfirmDialogVisible(false);
    if (props.selectedReferenceId) {
      props.replaceReference(props.selectedReferenceId, {});
      props.setSelectedReferenceId(undefined);
    }
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
                {isEditable
                  && <Stack horizontal
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
                      selectedItemFields={selectedItemFields}
                      isVisible={isConfirmDialogVisible}
                      onProceed={onDeleteConfirmed}
                      onCancel={onDeleteCancelled}
                    />
                  </Stack>
                }
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
                placeholder={commonUtils.getPlaceholder(references, props.selectedReferenceId, "referentFunction", props.locale)}
              />
              <CvTextField
                label="Omschrijving"
                field={`description.${props.locale}`}
                instanceContext={referenceContext}
                multiline
                autoAdjustHeight
                validateInput={commonUtils.isValidText(250)}
              />
            </Stack>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

Reference.propTypes = {
  authInfo: PropTypes.object,
  locale: PropTypes.string.isRequired,
  cvEntity: PropTypes.object,
  selectedCvId: PropTypes.string,
  referenceEntity: PropTypes.object,
  replaceReference: PropTypes.func.isRequired,
  selectedReferenceId: PropTypes.string,
  setSelectedReferenceId: PropTypes.func.isRequired
};

const select = (store) => ({
  authInfo: store.auth.authInfo,
  locale: store.ui.userPrefs.locale,
  cvEntity: store.safe.content.cv,
  selectedCvId: store.ui.selectedId.cv,
  referenceEntity: store.safe.content[entityName],
  selectedReferenceId: store.ui.selectedId[entityName]
});

const mapDispatchToProps = (dispatch) => ({
  replaceReference: (id, instance) => dispatch(changeInstance(entityName, id, instance)),
  setSelectedReferenceId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Reference);