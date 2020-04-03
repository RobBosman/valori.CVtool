import React from "react"
import {ChoiceGroup, TextField, Toggle} from "office-ui-fabric-react"
import {connect} from "react-redux"
import {mapHelpers} from "../../redux/utils";
import {setEntity} from "../../redux/ducks/safe";

const educationTypes = [
    {key: "EDUCATION", text: 'Education', iconProps: {iconName: 'PublishCourse'}},
    {key: "TRAINING", text: 'Training', iconProps: {iconName: 'UserEvent'}}
];

const Education = (props) => {

    const {instance, getValue, getValueLocale, onChange, onChangeLocale} = mapHelpers(props.entities, props.entityId, props.onChange, props.locale);

    return (
        <div>
            <ChoiceGroup
                label="Soort opleiding"
                options={educationTypes}
                selectedKey={getValue('educationType', "EDUCATION")}
                disabled={!instance}
                onChange={onChange('educationType', (event, option) => option.key)}/>
            <TextField
                label="Opleidingsinstituut"
                value={getValue('institution')}
                disabled={!instance}
                onChange={onChange('institution')}/>
            <TextField
                label="Opleiding"
                value={getValueLocale('educationName')}
                disabled={!instance}
                onChange={onChangeLocale('educationName')}/>
            <TextField
                label="Syllabus"
                value={getValueLocale('syllabus')}
                disabled={!instance}
                onChange={onChangeLocale('syllabus')}/>
            <TextField
                label="Jaar diploma"
                styles={{fieldGroup: {width: 100}}}
                placeholder='yyyy'
                value={getValue('yearDiploma')}
                disabled={!instance}
                onChange={onChange('yearDiploma')}/>
            <Toggle
                label="Diploma"
                checked={getValue('diploma', false)}
                disabled={!instance}
                onChange={onChange('diploma', (event, checked) => checked)}/>
        </div>
    )
};

const select = (state) => ({
    locale: state.ui.locale,
    entities: state.safe.education
});

const mapDispatchToProps = (dispatch) => ({
    onChange: (instance, id) => dispatch(setEntity('education', id, instance))
});

export default connect(select, mapDispatchToProps)(Education)