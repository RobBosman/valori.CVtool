import React from "react"
import { ChoiceGroup, TextField, Toggle } from "office-ui-fabric-react"
import { connect } from "react-redux"
import { mapHelpers, replaceSafeInstance } from "../../redux/safe";

const educationTypes = [
  { key: "EDUCATION", text: 'Opleiding', iconProps: { iconName: 'PublishCourse' } },
  { key: "TRAINING", text: 'Training', iconProps: { iconName: 'UserEvent' } }
];

const Education = (props) => {

  const { instance: education, getValue, getValueLocale, onChange, onChangeLocale } = mapHelpers(props.educationEntity, props.educationId, props.onChange, props.locale);

  return (
    <div>
      <ChoiceGroup
        label="Soort opleiding"
        options={educationTypes}
        selectedKey={getValue('type', "EDUCATION")}
        disabled={!education}
        onChange={onChange('type', (event, option) => option.key)} />
      <TextField
        label="Opleiding"
        value={getValueLocale('name')}
        disabled={!education}
        onChange={onChangeLocale('name')} />
      <TextField
        label="Opleidingsinstituut"
        value={getValue('institution')}
        disabled={!education}
        onChange={onChange('institution')} />
      <TextField
        label="Jaar diploma"
        styles={{ fieldGroup: { width: 100 } }}
        placeholder='yyyy'
        value={getValue('yearDiploma')}
        disabled={!education}
        onChange={onChange('yearDiploma')} />
      <Toggle
        label="Diploma"
        checked={getValue('diploma', false)}
        disabled={!education}
        onChange={onChange('diploma', (event, checked) => checked)} />
    </div>
  )
};

const select = (state) => ({
  locale: state.ui.locale,
  educationEntity: state.safe.education
});

const mapDispatchToProps = (dispatch) => ({
  onChange: (id, instance) => dispatch(replaceSafeInstance('education', id, instance))
});

export default connect(select, mapDispatchToProps)(Education)