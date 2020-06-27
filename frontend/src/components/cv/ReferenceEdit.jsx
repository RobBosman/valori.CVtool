import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Stack } from "@fluentui/react";
import { setDialogConfig } from "../../services/ui/ui-actions";
import { replaceSafeInstance } from "../../services/safe/safe-actions";
import { CvCheckbox } from "../widgets/CvCheckbox";
import { CvTextField } from "../widgets/CvTextField";
import { CvModal } from "../widgets/CvModal";

const entityName = "reference";

const ReferenceEdit = (props) => {

  const referenceContext = {
    ...props.instanceContext,
    replaceInstance: props.onChangeReference
  };

  return (
    <CvModal
      title="Edit"
      isOpen={props.dialogConfig.isOpen || false}
      dismiss={() => props.setDialogConfig(false)}>
      <Stack horizontal>
        <CvTextField
          label="Naam"
          field="referentName"
          instanceContext={referenceContext}
          styles={{ fieldGroup: { width: 150 } }} />
        <CvTextField
          label="Functie"
          localeField="referentFunction"
          instanceContext={referenceContext}
          styles={{ dropdown: { width: 100 } }} />
        <CvTextField
          label="Omschrijving"
          localeField="description"
          instanceContext={referenceContext}
          styles={{ dropdown: { width: 400 } }} />
        <CvCheckbox
          label="In cv"
          field="includeInCv"
          instanceContext={referenceContext}
          styles={{ dropdown: { width: 70 } }} />
      </Stack>
    </CvModal>
  );
};

ReferenceEdit.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  onChangeReference: PropTypes.func.isRequired,
  dialogConfig: PropTypes.object.isRequired,
  setDialogConfig: PropTypes.func.isRequired
};

const select = (state) => ({
  dialogConfig: state.ui.dialogConfig[entityName] || {}
});

const mapDispatchToProps = (dispatch) => ({
  onChangeReference: (id, instance) => dispatch(replaceSafeInstance(entityName, id, instance)),
  setDialogConfig: (isOpen) => dispatch(setDialogConfig(entityName, {isOpen}))
});

export default connect(select, mapDispatchToProps)(ReferenceEdit);