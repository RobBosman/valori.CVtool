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

const entityName = "publication";

const Publication = (props) => {

  // Find all {Publication} of the selected {cv}.
  const publications = props.publicationEntity
    && props.selectedCvId
    && Object.values(props.publicationEntity).filter((instance) => instance.cvId === props.selectedCvId)
      .sort((l, r) => r.year - l.year)
    || [];

  const publicationContext = {
    locale: props.locale,
    entity: props.publicationEntity,
    instanceId: props.selectedPublicationId,
    setSelectedInstance: props.setSelectedPublicationId,
    replaceInstance: props.replacePublication
  };

  const isValidText = (value) =>
    value.length > 120 ? "Maximaal 120 tekens" : "";
  const isValidYear = (value) =>
    isNaN(value) ? "Voer een jaartal in" : value.length > 4 ? "Maximaal vier cijfers" : "";

  const renderInCvCheckbox = (item) =>
    <CvCheckbox
      field="includeInCv"
      instanceContext={{ ...publicationContext, instanceId: item._id }}
    />;

  const columns = [
    {
      key: "title",
      localeFieldName: "title",
      name: "Titel",
      isResizable: true,
      data: "string"
    },
    {
      key: "media",
      fieldName: "media",
      name: "Media",
      isResizable: true,
      data: "string"
    },
    {
      key: "year",
      fieldName: "year",
      name: "Jaar",
      isResizable: false,
      minWidth: 30,
      maxWidth: 30,
      data: "number"
    },
    {
      key: "description",
      localeFieldName: "description",
      name: "Omschrijving",
      isResizable: true,
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
  const selectedPublication = publications.find(experience => experience._id === props.selectedPublicationId);
  const renderSelectedItem = selectedPublication &&
    <table>
      <tbody>
        <tr>
          <td><em>Titel</em>:</td><td>{selectedPublication.title && selectedPublication.title[props.locale] || ""}</td>
        </tr>
        <tr>
          <td><em>Media</em>:</td><td>{selectedPublication.media || ""}</td>
        </tr>
      </tbody>
    </table>;

  const onAddItem = () => {
    const id = createUuid();
    props.replacePublication(id, {
      _id: id,
      cvId: props.selectedCvId,
      includeInCv: true
    });
    props.setSelectedPublicationId(id);
  };

  const onDeleteItem = () => {
    if (props.selectedPublicationId) {
      setConfirmDialogVisible(true);
    }
  };
  const onDeleteConfirmed = () => {
    if (props.selectedPublicationId) {
      props.replacePublication(props.selectedPublicationId, {});
      props.setSelectedPublicationId(undefined);
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
                <Text variant="xxLarge">Publicaties</Text>
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
                    disabled={!props.selectedPublicationId}
                    onClick={onDeleteItem}
                  />
                  <ConfirmDialog
                    title="Definitief verwijderen?"
                    itemFields={renderSelectedItem}
                    isVisible={isConfirmDialogVisible}
                    onProceed={onDeleteConfirmed}
                    onCancel={onDeleteCancelled}
                  />
                </Stack>
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
                localeField="title"
                instanceContext={publicationContext}
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
                validateInput={isValidYear}
                placeholder='yyyy'
                styles={{ fieldGroup: { width: 80 } }}
              />
              <CvTextField
                label="Omschrijving"
                localeField="description"
                instanceContext={publicationContext}
                validateInput={isValidText}
              />
            </Stack>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

Publication.propTypes = {
  locale: PropTypes.string.isRequired,
  selectedCvId: PropTypes.string,
  publicationEntity: PropTypes.object,
  replacePublication: PropTypes.func.isRequired,
  selectedPublicationId: PropTypes.string,
  setSelectedPublicationId: PropTypes.func.isRequired
};

const select = (state) => ({
  locale: state.ui.locale,
  selectedCvId: state.ui.selectedId["cv"],
  publicationEntity: state.safe.content[entityName],
  selectedPublicationId: state.ui.selectedId[entityName]
});

const mapDispatchToProps = (dispatch) => ({
  replacePublication: (id, instance) => dispatch(changeInstance(entityName, id, instance)),
  setSelectedPublicationId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Publication);