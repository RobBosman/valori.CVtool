import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, IconButton } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedPublicationId, setDialogConfig } from "../../services/ui/ui-actions";
import { replaceSafeInstance } from "../../services/safe/safe-actions";
import { createId } from "../../services/safe/safe-services";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import PublicationEdit from "./PublicationEdit";

const entityName = "publication";

const PublicationList = (props) => {

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

  // Find all {publications} of the selected {cv}.
  const publications = props.publicationEntity
    && props.selectedCvId
    && Object.values(props.publicationEntity).filter((instance) => instance.cvId === props.selectedCvId)
    || [];

  const publicationContext = {
    locale: props.locale,
    entity: props.publicationEntity,
    entityId: props.selectedPublicationId,
    setSelectedInstance: props.setSelectedPublicationId
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
    props.replacePublication(id, {
      _id: id,
      cvId: props.selectedCvId
    });
    props.setSelectedPublicationId(id);
    props.setDialogConfig(true);

    setTimeout(() => { // TODO: fix this
      selection.setAllSelected(false);
      selection.setKeySelected(id, true, false);
    }, 10);
  };

  const onEditItem = () => props.setDialogConfig(!props.dialogConfig?.isOpen);

  const onDeleteItem = () => {
    if (props.selectedPublicationId) {
      props.replacePublication(props.selectedPublicationId, {});
      props.setSelectedPublicationId(undefined);
      props.setDialogConfig(false);
    }
  };

  return (
    <Stack styles={viewStyles}>
      <Stack horizontal>
        <Text variant="xxLarge">Publicaties</Text>
        <IconButton
          iconProps={{ iconName: "Add" }}
          onClick={onAddItem} />
        <IconButton
          iconProps={{ iconName: "Edit" }}
          disabled={!props.selectedPublicationId}
          onClick={onEditItem} />
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
        onExposeSelectionRef={onExposeSelectionRef}
        onItemInvoked={onEditItem} />
      <PublicationEdit
        instanceContext={publicationContext}/>
    </Stack>
  );
};

PublicationList.propTypes = {
  locale: PropTypes.string.isRequired,
  selectedCvId: PropTypes.string,
  publicationEntity: PropTypes.object,
  replacePublication: PropTypes.func.isRequired,
  selectedPublicationId: PropTypes.string,
  setSelectedPublicationId: PropTypes.func.isRequired,
  dialogConfig: PropTypes.object.isRequired,
  setDialogConfig: PropTypes.func.isRequired
};

const select = (state) => ({
  locale: state.ui.locale,
  selectedCvId: state.ui.selectedCvId,
  publicationEntity: state.safe[entityName],
  selectedPublicationId: state.ui.selectedPublicationId,
  dialogConfig: state.ui.dialogConfig[entityName] || {}
});

const mapDispatchToProps = (dispatch) => ({
  replacePublication: (id, instance) => dispatch(replaceSafeInstance(entityName, id, instance)),
  setSelectedPublicationId: (publicationId) => dispatch(setSelectedPublicationId(publicationId)),
  setDialogConfig: (isOpen) => dispatch(setDialogConfig(entityName, {isOpen}))
});

export default connect(select, mapDispatchToProps)(PublicationList);