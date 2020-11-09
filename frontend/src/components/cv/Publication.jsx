import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, ActionButton } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId } from "../../services/ui/ui-actions";
import { replaceContentInstance } from "../../services/safe/safe-actions";
import { createUuid } from "../../services/safe/safe-services";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvTextField } from "../widgets/CvTextField";

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
    }
  ];

  const { viewPaneColor, editPaneColor } = useTheme();
  const viewStyles = {
    root: [
      {
        background: viewPaneColor,
        padding: 20
      }
    ]
  };
  const editStyles = {
    root: [
      {
        background: editPaneColor,
        padding: 20
      }
    ]
  };
  const tdStyle = {
    minWidth: 250,
    width: "calc(50vw - 98px)"
  };

  let selection;
  const onExposeSelectionRef = (selectionRef) => {
    selection = selectionRef;
  };

  const onAddItem = () => {
    const id = createUuid();
    props.replacePublication(id, {
      _id: id,
      cvId: props.selectedCvId,
      includeInCv: true
    });
    props.setSelectedPublicationId(id);

    setTimeout(() => { // TODO: fix this?
      selection.setAllSelected(false);
      selection.setKeySelected(id, true, false);
    }, 1);
  };

  const onDeleteItem = () => {
    if (props.selectedPublicationId) {
      props.replacePublication(props.selectedPublicationId, {});
      props.setSelectedPublicationId(undefined);
    }
  };

  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <td valign="top" style={tdStyle}>
            <Stack styles={viewStyles}>
              <Stack horizontal horizontalAlign="space-between">
                <Text variant="xxLarge">Publicaties</Text>
                <div>
                  <ActionButton
                    text="Toevoegen"
                    iconProps={{ iconName: "Add" }}
                    onClick={onAddItem}
                  />
                  <ActionButton
                    text="Verwijderen"
                    iconProps={{ iconName: "Delete" }}
                    disabled={!props.selectedPublicationId}
                    onClick={onDeleteItem}
                  />
                </div>
              </Stack>
              <CvDetailsList
                columns={columns}
                items={publications}
                instanceContext={publicationContext}
                setKey={entityName}
                onExposeSelectionRef={onExposeSelectionRef}
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
                placeholder='yyyy'
                styles={{ fieldGroup: { width: 80 } }}
              />
              <CvTextField
                label="Omschrijving"
                localeField="description"
                instanceContext={publicationContext}
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
  replacePublication: (id, instance) => dispatch(replaceContentInstance(entityName, id, instance)),
  setSelectedPublicationId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Publication);