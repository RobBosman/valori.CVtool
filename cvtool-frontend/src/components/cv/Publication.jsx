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
import ConfirmDialog from "../ConfirmDialog";
import * as commonUtils from "../../utils/CommonUtils";

const entityName = "publication";

const Publication = (props) => {

  const cv = props.cvEntity && props.cvEntity[props.selectedCvId];
  const isEditable = commonUtils.isAccountEditable(cv?.accountId, props.authInfo);

  const publicationContext = {
    entity: props.publicationEntity,
    instanceId: props.selectedPublicationId,
    setSelectedInstanceId: props.setSelectedPublicationId,
    replaceInstance: props.replacePublication,
    readOnly: !isEditable
  };
  
  // Find all {Publication} of the selected {cv}.
  const publications = React.useMemo(() =>
    props.selectedCvId && Object.values(props.publicationEntity || {})
      .filter(instance => instance.cvId === props.selectedCvId)
      .sort((l, r) => r.year - l.year)
      || [],
  [props.publicationEntity, props.selectedCvId]);

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
      isResizable: true,
      minWidth: 150,
      maxWidth: 400
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
        _id: createUuid(),
        cvId: props.selectedCvId,
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

  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <td valign="top" style={tdStyle}>
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
                      disabled={!props.selectedCvId}
                      onClick={onAddItem}
                    />
                    <DefaultButton
                      text="Verwijderen"
                      iconProps={{ iconName: "Delete" }}
                      disabled={!props.selectedPublicationId}
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
                items={publications}
                instanceContext={publicationContext}
                setKey={entityName}
              />
            </Stack>
          </td>

          <td valign="top" style={tdStyle}>
            <Stack styles={editStyles}>
              <CvTextField
                label="Titel"
                field={`title.${props.locale}`}
                instanceContext={publicationContext}
                placeholder={commonUtils.getPlaceholder(publications, props.selectedPublicationId, "title", props.locale)}
              />
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
                label="Omschrijving"
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
  cvEntity: PropTypes.object,
  selectedCvId: PropTypes.string,
  publicationEntity: PropTypes.object,
  replacePublication: PropTypes.func.isRequired,
  selectedPublicationId: PropTypes.string,
  setSelectedPublicationId: PropTypes.func.isRequired
};

const select = (store) => ({
  authInfo: store.auth.authInfo,
  locale: store.ui.userPrefs.locale,
  cvEntity: store.safe.content.cv,
  selectedCvId: store.ui.selectedId.cv,
  publicationEntity: store.safe.content[entityName],
  selectedPublicationId: store.ui.selectedId[entityName]
});

const mapDispatchToProps = (dispatch) => ({
  replacePublication: (id, instance) => dispatch(changeInstance(entityName, id, instance)),
  setSelectedPublicationId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Publication);