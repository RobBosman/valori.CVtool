import React from "react";
import { connect } from "react-redux";
import { Stack } from "@fluentui/react";
import { replaceSafeInstance } from "../../services/safe/safe-actions";
import { EducationTypes, EducationResultTypes } from "./Enums";
import CvTextField from "../widgets/CvTextField";
import CvChoiceGroup from "../widgets/CvChoiceGroup";
import CvDropdown from "../widgets/CvDropdown";

const select = (state) => ({
  locale: state.ui.locale,
  educationId: state.ui.selected.educationId,
  educationEntity: state.safe.education
});

const mapDispatchToProps = (dispatch) => ({
  onChange: (id, instance) => dispatch(replaceSafeInstance('education', id, instance))
});

const EducationEdit = (props) => {
  const educationContext = {
    entity: props.educationEntity,
    entityId: props.educationId,
    locale: props.locale,
    replaceInstance: props.onChange
  };

  return (
    <Stack >
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
  )
};

export default connect(select, mapDispatchToProps)(EducationEdit)