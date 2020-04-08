import React from "react"
import { ChoiceGroup, TextField, Toggle } from "office-ui-fabric-react"
import { connect } from "react-redux"
import { mapHelpers, replaceSafeInstance } from "../../redux/ducks/safe";

const educationTypes = [
  { key: "EDUCATION", text: 'Opleiding', iconProps: { iconName: 'PublishCourse' } },
  { key: "TRAINING", text: 'Training', iconProps: { iconName: 'UserEvent' } }
];

const Education = (props) => {

  const { instance, getValue, getValueLocale, onChange, onChangeLocale } = mapHelpers(props.entity, props.entityId, props.onChange, props.locale);

  return (
    <div>
      <ChoiceGroup
        label="Soort opleiding"
        options={educationTypes}
        selectedKey={getValue('type', "EDUCATION")}
        disabled={!instance}
        onChange={onChange('type', (event, option) => option.key)} />
      <TextField
        label="Opleiding"
        value={getValueLocale('name')}
        disabled={!instance}
        onChange={onChangeLocale('name')} />
      <TextField
        label="Opleidingsinstituut"
        value={getValue('institution')}
        disabled={!instance}
        onChange={onChange('institution')} />
      <TextField
        label="Jaar diploma"
        styles={{ fieldGroup: { width: 100 } }}
        placeholder='yyyy'
        value={getValue('yearDiploma')}
        disabled={!instance}
        onChange={onChange('yearDiploma')} />
      <Toggle
        label="Diploma"
        checked={getValue('diploma', false)}
        disabled={!instance}
        onChange={onChange('diploma', (event, checked) => checked)} />
    </div>
  )
};

const select = (state) => ({
  locale: state.ui.locale,
  entity: state.safe.education
});

const mapDispatchToProps = (dispatch) => ({
  onChange: (id, instance) => dispatch(replaceSafeInstance('education', id, instance))
});

export default connect(select, mapDispatchToProps)(Education)