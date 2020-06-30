import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Stack } from "@fluentui/react";
import { setDialogConfig } from "../../services/ui/ui-actions";
import { replaceSafeInstance } from "../../services/safe/safe-actions";
import { CvCheckbox } from "../widgets/CvCheckbox";
import { CvDatePicker } from "../widgets/CvDatePicker";
import { CvTextField } from "../widgets/CvTextField";
import { CvModal } from "../widgets/CvModal";
import { CvSpinButton } from "../widgets/CvSpinButton";

const entityName = "experience";

const ExperienceEdit = (props) => {

  const experienceContext = {
    ...props.instanceContext,
    replaceInstance: props.onChangeExperience
  };

  return (
    <CvModal
      title="Edit"
      isOpen={props.dialogConfig.isOpen || false}
      dismiss={() => props.setDialogConfig(false)}>
      <Stack>
        <CvDatePicker
          label="Van"
          field="periodBegin"
          instanceContext={experienceContext}
          styles={{ root: { width: 140 } }} />
        <CvDatePicker
          label="t/m"
          field="periodEnd"
          instanceContext={experienceContext}
          styles={{ root: { width: 140 } }} />
        <CvTextField
          label="Werkgever"
          field="employer"
          instanceContext={experienceContext}
          styles={{ dropdown: { width: 400 } }} />
        <CvTextField
          label="Opdrachtgever"
          field="client"
          instanceContext={experienceContext}
          styles={{ dropdown: { width: 400 } }} />
        <CvTextField
          label="Rol"
          localeField="role"
          instanceContext={experienceContext}
          styles={{ dropdown: { width: 400 } }} />
        <CvTextField
          label="Opdracht"
          localeField="assignment"
          instanceContext={experienceContext}
          styles={{ dropdown: { width: 400 } }} />
        <CvTextField
          label="Activiteiten"
          localeField="activities"
          instanceContext={experienceContext}
          styles={{ dropdown: { width: 400 } }} />
        <CvTextField
          label="Resultaten"
          localeField="results"
          instanceContext={experienceContext}
          styles={{ dropdown: { width: 400 } }} />
        <CvTextField
          label="Keywords"
          localeField="keywords"
          instanceContext={experienceContext}
          styles={{ dropdown: { width: 400 } }} />
        <CvSpinButton
          label="Sorteer index"
          field="sortIndex"
          instanceContext={experienceContext}
          styles={{ dropdown: { width: 100 } }} />
        <CvCheckbox
          label="In cv"
          field="includeInCv"
          instanceContext={experienceContext}
          styles={{ dropdown: { width: 70 } }} />
      </Stack>
    </CvModal>
  );
};

ExperienceEdit.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  onChangeExperience: PropTypes.func.isRequired,
  dialogConfig: PropTypes.object.isRequired,
  setDialogConfig: PropTypes.func.isRequired
};

const select = (state) => ({
  dialogConfig: state.ui.dialogConfig[entityName] || {}
});

const mapDispatchToProps = (dispatch) => ({
  onChangeExperience: (id, instance) => dispatch(replaceSafeInstance(entityName, id, instance)),
  setDialogConfig: (isOpen) => dispatch(setDialogConfig(entityName, {isOpen}))
});

export default connect(select, mapDispatchToProps)(ExperienceEdit);