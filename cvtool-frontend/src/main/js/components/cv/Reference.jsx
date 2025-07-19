import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, DefaultButton, PrimaryButton, StackItem } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId } from "../../services/ui/ui-actions";
import { changeInstance } from "../../services/safe/safe-actions";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvTextField } from "../widgets/CvTextField";
import { CvCheckbox } from "../widgets/CvCheckbox";
import * as commonUtils from "../../utils/CommonUtils";
import ConfirmDialog from "../ConfirmDialog";
import { createHelpIcon } from "../widgets/CvHelpIcon";
import { CvFormattedText } from "../widgets/CvFormattedText";
import Preview, * as preview from "./Preview";

const entityName = "reference";

const Reference = (props) => {

  const isEditable = commonUtils.isEditAccountAllowed(props.selectedAccountId, props.authInfo);
  const hasCharacteristics = commonUtils.hasInstances(props.characteristicsEntity, props.selectedAccountId);

  const referenceContext = {
    entity: props.referenceEntity,
    instanceId: props.selectedReferenceId,
    setSelectedInstanceId: props.setSelectedReferenceId,
    replaceInstance: props.replaceReference,
    readOnly: !isEditable
  };
  
  // Find all {references} of the selected {account}.
  const references = React.useMemo(() =>
    props.selectedAccountId && Object.values(props.referenceEntity || {})
      .filter(instance => instance.accountId === props.selectedAccountId)
      .sort((l, r) => commonUtils.comparePrimitives(l.referentName, r.referentName))
      || [],
  [props.referenceEntity, props.selectedAccountId]);

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
      maxWidth: 280
    },
    {
      key: "year",
      fieldName: "year",
      name: "Jaar",
      isResizable: false,
      minWidth: 40,
      maxWidth: 40
    },
    {
      key: "referentFunction",
      fieldName: `referentFunction.${props.locale}`,
      name: "Functie",
      onRender: (item) => commonUtils.getValueOrFallback(item, "referentFunction", props.locale),
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
      minWidth: 40,
      maxWidth: 40,
      data: "boolean"
    }
  ];

  const {viewPaneBackground, editPaneBackground, valoriBlue, valoriYellow} = useTheme();
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

  const [confirmDialogVisible, setConfirmDialogVisible] = React.useState(false);
  const [previewVisible, setPreviewVisible] = React.useState(false);

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
        _id: commonUtils.createUuid(),
        accountId: props.selectedAccountId,
        includeInCv: false
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

  const renderPreviewReference = (reference) =>
    <Stack>
      <Text
        style={{
          ...preview.cvTextStyle,
          backgroundColor: "white",
          color: valoriYellow,
          fontWeight: "bold"
        }}>
        {`${reference.referentName} \u2500 ${commonUtils.getValueOrFallback(reference, "referentFunction", props.locale)}`}
      </Text>
      <CvFormattedText
        field={`description.${props.locale}`}
        instanceContext={{ ...referenceContext, instanceId: reference._id }}
        markDown={true}
        textComponentStyle={{
          backgroundColor: "white",
          color: valoriBlue,
          padding: 0
        }}
      />
    </Stack>;

  const renderPreview = React.useCallback(() =>
    <Stack tokens={{ childrenGap: "5px"}}>
      {
        references
          .filter(isFilledReference)
          .filter(reference => commonUtils.isFilledLocaleField(reference.description))
          .filter(reference => reference.includeInCv)
          .map(renderPreviewReference)
      }
    </Stack>,
  [references, props.locale]);

  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <th valign="top" style={tdStyle}>
            <Stack styles={viewStyles}>
              <Stack horizontal horizontalAlign="space-between"
                tokens={{ childrenGap: "l1" }}>
                <Text variant="xxLarge">Referenties</Text>
                {isEditable
                  && <StackItem>
                    <Stack horizontal tokens={{ childrenGap: "l1" }}>
                      <DefaultButton
                        text="Toevoegen"
                        iconProps={{ iconName: "Add" }}
                        disabled={!hasCharacteristics}
                        onClick={onAddItem}
                      />
                      <DefaultButton
                        text="Verwijderen"
                        iconProps={{ iconName: "Delete" }}
                        disabled={!props.selectedReferenceId}
                        onClick={onDeleteItem}
                      />
                      <ConfirmDialog
                        title="Referentie definitief verwijderen?"
                        primaryButtonText="Verwijderen"
                        selectedItemFields={selectedItemFields}
                        isVisible={confirmDialogVisible}
                        onProceed={onDeleteConfirmed}
                        onCancel={onDeleteCancelled}
                      />
                    </Stack>
                  </StackItem>
                }
              </Stack>
              <CvDetailsList
                columns={columns}
                items={references}
                instanceContext={referenceContext}
                setKey={entityName}
              />
            </Stack>
          </th>

          <td valign="top" style={tdStyle}>
            <Stack styles={editStyles}>
              <Stack horizontal horizontalAlign="space-between"
                tokens={{ childrenGap: "l1" }}>
                <StackItem grow>
                  <CvTextField
                    label={createHelpIcon({
                      label: "Naam",
                      content:
                        <Text>
                          Referenties mogen alleen op verzoek van een klant
                          <br/>en/of in overleg met Sales worden getoond in het CV.
                        </Text>
                    })}
                    field="referentName"
                    instanceContext={referenceContext}
                  />
                </StackItem>
                <Preview
                  isVisible={previewVisible}
                  rootStyles={{
                    width: 614, // = 9213/1440 inch
                    height: 350
                  }}
                  renderContent={renderPreview}
                  onDismiss={() => setPreviewVisible(false)}
                />
                <StackItem>
                  <PrimaryButton
                    text="Preview"
                    iconProps={{ iconName: "EntryView" }}
                    onClick={() => setPreviewVisible(!previewVisible)}
                    style={{ top: "28px" }}
                  />
                </StackItem>
              </Stack>
              <CvTextField
                label="Jaar"
                field="year"
                instanceContext={referenceContext}
                validateInput={commonUtils.isValidYear}
                placeholder='yyyy'
                styles={{ fieldGroup: { width: 80 } }}
              />
              <CvTextField
                label="Functie"
                field={`referentFunction.${props.locale}`}
                instanceContext={referenceContext}
                placeholder={commonUtils.getPlaceholder(references, props.selectedReferenceId, "referentFunction", props.locale)}
              />
              <CvTextField
                label="Opdrachtgever"
                field="client"
                instanceContext={referenceContext}
              />
              <CvTextField
                label="Omschrijving"
                field={`description.${props.locale}`}
                instanceContext={referenceContext}
                multiline
                autoAdjustHeight
                validateInput={commonUtils.isValidText(1200)}
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
  selectedAccountId: PropTypes.string,
  characteristicsEntity: PropTypes.object,
  referenceEntity: PropTypes.object,
  replaceReference: PropTypes.func.isRequired,
  selectedReferenceId: PropTypes.string,
  setSelectedReferenceId: PropTypes.func.isRequired
};

const select = (store) => ({
  authInfo: store.auth.authInfo,
  locale: store.ui.userPrefs.locale,
  selectedAccountId: store.ui.selectedId.account,
  characteristicsEntity: store.safe.content.characteristics,
  referenceEntity: store.safe.content[entityName],
  selectedReferenceId: store.ui.selectedId[entityName]
});

const mapDispatchToProps = (dispatch) => ({
  replaceReference: (id, instance) => dispatch(changeInstance(entityName, id, instance)),
  setSelectedReferenceId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Reference);