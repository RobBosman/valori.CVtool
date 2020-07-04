import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Stack } from "@fluentui/react";
import { replaceSafeInstance } from "../../services/safe/safe-actions";
import { EducationTypes, EducationResultTypes } from "./Enums";
import { CvTextField } from "../widgets/CvTextField";
import { CvChoiceGroup } from "../widgets/CvChoiceGroup";
import { CvDropdown } from "../widgets/CvDropdown";
import { CvModal } from "../widgets/CvModal";
import { setDialogConfig } from "../../services/ui/ui-actions";

const entityName = "education";

const EducationEdit = (props) => {

  const educationContext = {
    ...props.instanceContext,
    replaceInstance: props.onChangeEducation
  };

  return (
    <CvModal
      title="Edit"
      isOpen={props.dialogConfig.isOpen || false}
      onDismiss={() => props.setDialogConfig(false)}>
      <Stack>
        <CvChoiceGroup
          label="Soort opleiding"
          field="type"
          instanceContext={educationContext}
          options={EducationTypes} />
        <CvTextField
          label="Opleiding"
          localeField="name"
          instanceContext={educationContext} />
        <CvTextField
          label="Opleidingsinstituut"
          field="institution"
          instanceContext={educationContext} />
        <Stack horizontal>
          <CvDropdown
            label='Resultaat'
            field="result"
            instanceContext={educationContext}
            options={EducationResultTypes}
            styles={{ dropdown: { width: 100 } }} />
          <CvTextField
            label="Jaar"
            field="year"
            instanceContext={educationContext}
            placeholder='yyyy'
            styles={{ fieldGroup: { width: 100 } }} />
        </Stack>
      </Stack>
    </CvModal>
  );
};

EducationEdit.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  onChangeEducation: PropTypes.func.isRequired,
  dialogConfig: PropTypes.object.isRequired,
  setDialogConfig: PropTypes.func.isRequired
};

const select = (state) => ({
  dialogConfig: state.ui.dialogConfig[entityName] || {}
});

const mapDispatchToProps = (dispatch) => ({
  onChangeEducation: (id, instance) => dispatch(replaceSafeInstance(entityName, id, instance)),
  setDialogConfig: (isOpen) => dispatch(setDialogConfig(entityName, {isOpen}))
});

export default connect(select, mapDispatchToProps)(EducationEdit);