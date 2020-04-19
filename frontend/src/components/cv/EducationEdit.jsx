import React from "react";
import { ChoiceGroup, Dropdown, TextField, Stack } from "@fluentui/react";
import { connect } from "react-redux";
import { mapHelpers, replaceSafeInstance } from "../../redux/safe";
import { EducationTypes, EducationResultTypes } from "./Enums";

const EducationEdit = (props) => {

  const { instance: education, getValue, getValueLocale, onChange, onChangeLocale } = mapHelpers(props.educationEntity, props.educationId, props.locale, props.onChange);

  return (
    <Stack >
      <ChoiceGroup
        label="Soort opleiding"
        options={EducationTypes}
        disabled={!education}
        selectedKey={getValue('type')}
        onChange={onChange('type', (event, option) => option.key)} />
      <TextField
        label="Opleiding"
        disabled={!education}
        value={getValueLocale('name')}
        onChange={onChangeLocale('name')} />
      <TextField
        label="Opleidingsinstituut"
        disabled={!education}
        value={getValue('institution')}
        onChange={onChange('institution')} />
      <Dropdown
        label='Resultaat:'
        styles={{ dropdown: { width: 100 } }}
        options={EducationResultTypes}
        disabled={!education}
        selectedKey={getValue('result')}
        onChange={onChange('result', (event, option) => option.key)} />
      <TextField
        label="Jaar"
        styles={{ fieldGroup: { width: 100 } }}
        placeholder='yyyy'
        disabled={!education}
        value={getValue('year')}
        onChange={onChange('year')} />
    </Stack>
  )
};

const select = (state) => ({
  locale: state.ui.locale,
  educationId: state.ui.selected.educationId,
  educationEntity: state.safe.education
});

const mapDispatchToProps = (dispatch) => ({
  onChange: (id, instance) => dispatch(replaceSafeInstance('education', id, instance))
});

export default connect(select, mapDispatchToProps)(EducationEdit)