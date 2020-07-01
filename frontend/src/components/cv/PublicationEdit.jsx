import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Stack } from "@fluentui/react";
import { setDialogConfig } from "../../services/ui/ui-actions";
import { replaceSafeInstance } from "../../services/safe/safe-actions";
import { CvTextField } from "../widgets/CvTextField";
import { CvModal } from "../widgets/CvModal";

const entityName = "publication";

const PublicationEdit = (props) => {

  const publicationContext = {
    ...props.instanceContext,
    replaceInstance: props.onChangePublication
  };

  return (
    <CvModal
      title="Edit"
      isOpen={props.dialogConfig.isOpen || false}
      onDismiss={() => props.setDialogConfig(false)}>
      <Stack horizontal>
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
          styles={{ dropdown: { width: 100 } }} />
        <CvTextField
          label="Titel"
          localeField="title"
          instanceContext={publicationContext}
          styles={{ dropdown: { width: 100 } }} />
        <CvTextField
          label="Omschrijving"
          localeField="description"
          instanceContext={publicationContext}
          styles={{ dropdown: { width: 400 } }} />
      </Stack>
    </CvModal>
  );
};

PublicationEdit.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  onChangePublication: PropTypes.func.isRequired,
  dialogConfig: PropTypes.object.isRequired,
  setDialogConfig: PropTypes.func.isRequired
};

const select = (state) => ({
  dialogConfig: state.ui.dialogConfig[entityName] || {}
});

const mapDispatchToProps = (dispatch) => ({
  onChangePublication: (id, instance) => dispatch(replaceSafeInstance(entityName, id, instance)),
  setDialogConfig: (isOpen) => dispatch(setDialogConfig(entityName, {isOpen}))
});

export default connect(select, mapDispatchToProps)(PublicationEdit);