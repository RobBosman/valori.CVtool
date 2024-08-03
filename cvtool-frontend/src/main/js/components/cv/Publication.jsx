import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, DefaultButton, StackItem, PrimaryButton } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId } from "../../services/ui/ui-actions";
import { changeInstance } from "../../services/safe/safe-actions";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvTextField } from "../widgets/CvTextField";
import { CvCheckbox } from "../widgets/CvCheckbox";
import ConfirmDialog from "../ConfirmDialog";
import * as commonUtils from "../../utils/CommonUtils";
import { createHelpIcon } from "../widgets/CvHelpIcon";
import Preview, * as preview from "./Preview";

const entityName = "publication";

const Publication = (props) => {

  const isEditable = commonUtils.isEditAccountAllowed(props.selectedAccountId, props.authInfo);
  const hasCharacteristics = commonUtils.hasInstances(props.characteristicsEntity, props.selectedAccountId);

  const publicationContext = {
    entity: props.publicationEntity,
    instanceId: props.selectedPublicationId,
    setSelectedInstanceId: props.setSelectedPublicationId,
    replaceInstance: props.replacePublication,
    readOnly: !isEditable
  };
  
  // Find all {Publication} of the selected {account}.
  const publications = React.useMemo(() =>
    props.selectedAccountId && Object.values(props.publicationEntity || {})
      .filter(instance => instance.accountId === props.selectedAccountId)
      .sort((l, r) => r.year - l.year)
      || [],
  [props.publicationEntity, props.selectedAccountId]);

  const renderInCvCheckbox = (item) =>
    <CvCheckbox
      field="includeInCv"
      instanceContext={{ ...publicationContext, instanceId: item._id }}
    />;

  const columns = [
    {
      key: "title",
      fieldName: `title.${props.locale}`,
      name: "Titel",
      onRender: (item) => commonUtils.getValueOrFallback(item, "title", props.locale),
      isResizable: true,
      minWidth: 150,
      maxWidth: 300
    },
    {
      key: "media",
      fieldName: "media",
      name: "Media",
      isResizable: true,
      minWidth: 140,
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

  const {viewPaneBackground, editPaneBackground, valoriYellow, valoriBlue} = useTheme();
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
    const selectedPublication = publications.find(publication => publication._id === props.selectedPublicationId);
    return selectedPublication && {
      Titel: commonUtils.getValueOrFallback(selectedPublication, "title", props.locale),
      Media: selectedPublication.media
    };
  },
  [publications, props.selectedPublicationId, props.locale]);

  const isFilledPublication = (publication) =>
    publication.media || commonUtils.isFilledLocaleField(publication.title);

  const onAddItem = () => {
    let newPublication = publications.find(publication => !isFilledPublication(publication));
    if (!newPublication) {
      newPublication = {
        _id: commonUtils.createUuid(),
        accountId: props.selectedAccountId,
        includeInCv: true
      };
      props.replacePublication(newPublication._id, newPublication);
    }
    props.setSelectedPublicationId(newPublication._id);
  };

  const onDeleteItem = () => {
    if (props.selectedPublicationId) {
      setConfirmDialogVisible(true);
    }
  };
  const onDeleteConfirmed = () => {
    setConfirmDialogVisible(false);
    if (props.selectedPublicationId) {
      props.replacePublication(props.selectedPublicationId, {});
      props.setSelectedPublicationId(undefined);
    }
  };
  const onDeleteCancelled = () =>
    setConfirmDialogVisible(false);

  const renderPreviewPublcation = (publication) => {
    return (
      <tr style={{ color: valoriBlue }}>
        <td>{commonUtils.getValueOrFallback(publication, "title", props.locale)}</td>
        <td>{publication.media}</td>
        <td>{publication.year}</td>
        <td>{commonUtils.getValueOrFallback(publication, "description", props.locale)}</td>
      </tr>
    );
  };

  const renderPreview = React.useCallback(() => {
    const publicationsToDisplay = publications
      .filter(isFilledPublication)
      .filter(education => education.includeInCv)
      .sort((l, r) => commonUtils.comparePrimitives(r.year, l.year));
    return publicationsToDisplay.length === 0
      ? null
      : <table style={{ ...preview.cvTextStyle }}>
        <tbody>
          <tr
            style={{
              color: valoriYellow,
              fontWeight: "bold"
            }}>
            <th style={{
              width: 205 // = 3071/1440 inch
            }}>Titel</th>
            <th style={{
              width: 157 // = 2363/1440 inch
            }}>Media</th>
            <th style={{
              width: 47 // = 708/1440 inch
            }}>Jaar</th>
            <th style={{
              width: 205 // = 3071/1440 inch
            }}>Omschrijving</th>
          </tr>
          {
            publicationsToDisplay
              .map(renderPreviewPublcation)
          }
        </tbody>
      </table>;
  },
  [publications, props.locale]);

  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <th valign="top" style={tdStyle}>
            <Stack styles={viewStyles}>
              <Stack horizontal horizontalAlign="space-between"
                tokens={{ childrenGap: "l1" }}>
                <Text variant="xxLarge">Publicaties</Text>
                {isEditable
                  && <Stack horizontal
                    tokens={{ childrenGap: "l1" }}>
                    <DefaultButton
                      text="Toevoegen"
                      iconProps={{ iconName: "Add" }}
                      disabled={!hasCharacteristics}
                      onClick={onAddItem}
                    />
                    <DefaultButton
                      text="Verwijderen"
                      iconProps={{ iconName: "Delete" }}
                      disabled={!props.selectedPublicationId}
                      onClick={onDeleteItem}
                    />
                    <ConfirmDialog
                      title="Publicatie definitief verwijderen?"
                      primaryButtonText="Verwijderen"
                      selectedItemFields={selectedItemFields}
                      isVisible={confirmDialogVisible}
                      onProceed={onDeleteConfirmed}
                      onCancel={onDeleteCancelled}
                    />
                  </Stack>
                }
              </Stack>
              <CvDetailsList
                columns={columns}
                items={publications}
                instanceContext={publicationContext}
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
                      label: "Titel",
                      content:
                        <Text>
                          Indien relevant, neemt je hier de publicaties op
                          <br/>die in het (recente) verleden hebt geplaatst.
                        </Text>
                    })}
                    field={`title.${props.locale}`}
                    instanceContext={publicationContext}
                    placeholder={commonUtils.getPlaceholder(publications, props.selectedPublicationId, "title", props.locale)}
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
                <PrimaryButton
                  text="Preview"
                  iconProps={{ iconName: "EntryView" }}
                  onClick={() => setPreviewVisible(!previewVisible)}
                  style={{ top: "28px" }}
                />
              </Stack>
              <CvTextField
                label="Media"
                field="media"
                instanceContext={publicationContext}
              />
              <CvTextField
                label="Jaar"
                field="year"
                instanceContext={publicationContext}
                validateInput={commonUtils.isValidYear}
                placeholder='yyyy'
                styles={{ fieldGroup: { width: 80 } }}
              />
              <CvTextField
                label={createHelpIcon({
                  label: "Omschrijving",
                  content:
                    <Text>
                      Je vermeldt hier korte omschrijving. Eventueel kan je een link opnemen
                      <br/>naar de locatie waar de publicatie te vinden is.
                    </Text>
                })}
                field={`description.${props.locale}`}
                instanceContext={publicationContext}
                validateInput={commonUtils.isValidText(120)}
              />
            </Stack>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

Publication.propTypes = {
  authInfo: PropTypes.object,
  locale: PropTypes.string.isRequired,
  selectedAccountId: PropTypes.string,
  characteristicsEntity: PropTypes.object,
  publicationEntity: PropTypes.object,
  replacePublication: PropTypes.func.isRequired,
  selectedPublicationId: PropTypes.string,
  setSelectedPublicationId: PropTypes.func.isRequired
};

const select = (store) => ({
  authInfo: store.auth.authInfo,
  locale: store.ui.userPrefs.locale,
  selectedAccountId: store.ui.selectedId.account,
  characteristicsEntity: store.safe.content.characteristics,
  publicationEntity: store.safe.content[entityName],
  selectedPublicationId: store.ui.selectedId[entityName]
});

const mapDispatchToProps = (dispatch) => ({
  replacePublication: (id, instance) => dispatch(changeInstance(entityName, id, instance)),
  setSelectedPublicationId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Publication);