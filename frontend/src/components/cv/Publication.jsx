import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, IconButton } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId } from "../../services/ui/ui-actions";
import { replaceSafeInstance } from "../../services/safe/safe-actions";
import { createUuid } from "../../services/safe/safe-services";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvTextField } from "../widgets/CvTextField";
import { CvCheckbox } from "../widgets/CvCheckbox";

const entityName = "publication";

const Publication = (props) => {
  const columns = [
    {
      key: "year",
      fieldName: "year",
      name: "Jaar",
      isResizable: false,
      minWidth: 80,
      maxWidth: 80,
      data: "number"
    },
    {
      key: "media",
      fieldName: "media",
      name: "Media",
      isResizable: true,
      minWidth: 150,
      isSorted: false,
      isSortedDescending: false,
      data: "string"
    },
    {
      key: "title",
      localeFieldName: "title",
      name: "Titel",
      isResizable: true,
      minWidth: 150,
      isSorted: false,
      isSortedDescending: false,
      data: "string"
    },
    {
      key: "description",
      localeFieldName: "description",
      name: "Omschrijving",
      isResizable: true,
      minWidth: 150,
      isSorted: false,
      isSortedDescending: false,
      data: "string"
    }
  ];

  // Find all {Publication} of the selected {cv}.
  const publications = props.publicationEntity
    && props.selectedCvId
    && Object.values(props.publicationEntity).filter((instance) => instance.cvId === props.selectedCvId)
    || [];

  const publicationContext = {
    locale: props.locale,
    entity: props.publicationEntity,
    entityId: props.selectedPublicationId,
    setSelectedInstance: props.setSelectedPublicationId,
    replaceInstance: props.replacePublication
  };

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
          ...publicationContext,
          entityId: item._id
        }} />;
    default:
      return item[column.fieldName];
    }
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
    <table width="100%">
      <tbody>
        <tr>
          <td width="40%" valign="top">
            <Stack styles={viewStyles}>
              <Stack horizontal>
                <Text variant="xxLarge">Publicaties</Text>
                <IconButton
                  iconProps={{ iconName: "Add" }}
                  onClick={onAddItem} />
                <IconButton
                  iconProps={{ iconName: "Delete" }}
                  disabled={!props.selectedPublicationId}
                  onClick={onDeleteItem} />
              </Stack>
              <CvDetailsList
                columns={columns}
                items={publications}
                instanceContext={publicationContext}
                setKey={entityName}
                onRenderItemColumn={onRenderItem}
                onExposeSelectionRef={onExposeSelectionRef} />
            </Stack>
          </td>

          <td width="60%" valign="top">
            <Stack styles={editStyles}>
              <CvTextField
                label="Jaar"
                field="year"
                instanceContext={publicationContext}
                placeholder='yyyy'
                styles={{ fieldGroup: { width: 80 } }} />
              <CvTextField
                label="Media"
                field="media"
                instanceContext={publicationContext}
                multiline
                autoAdjustHeight />
              <CvTextField
                label="Titel"
                localeField="title"
                instanceContext={publicationContext}
                multiline
                autoAdjustHeight/>
              <CvTextField
                label="Omschrijving"
                localeField="description"
                instanceContext={publicationContext}
                multiline
                autoAdjustHeight />
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
  publicationEntity: state.safe[entityName],
  selectedPublicationId: state.ui.selectedId[entityName],
  replacePublication: PropTypes.func.isRequired,
});

const mapDispatchToProps = (dispatch) => ({
  replacePublication: (id, instance) => dispatch(replaceSafeInstance(entityName, id, instance)),
  setSelectedPublicationId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Publication);