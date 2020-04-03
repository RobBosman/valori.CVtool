import React from "react"
import {ChoiceGroup, TextField, Toggle} from "office-ui-fabric-react"
import {connect} from "react-redux"
import {
    setDiploma,
    setEducationName,
    setEducationType,
    setInstitution,
    setSyllabus,
    setYearDiploma
} from "../../redux/ducks/educationDuck"

const Education = (props) => {

    const educationId = 'uuid-education-1';
    const education = props.education ? props.education[educationId] : undefined;

    const educationType = (education) ? education.educationType : 0;
    const institution = (education) ? education.institution : "";
    const educationName = (education && education.educationName) ? education.educationName[props.locale] : "";
    const syllabus = (education && education.syllabus) ? education.syllabus[props.locale] : "";
    const yearDiploma = (education) ? education.yearDiploma : '';
    const diploma = (education) ? education.diploma : false;

    const wrapId = (func) => (event) => func(event, educationId);
    const wrapIdLocale = (func) => (event) => func(event, educationId, props.locale);

    const educationTypes = [
        {key: "EDUCATION", text: 'Education', iconProps: {iconName: 'PublishCourse'}},
        {key: "TRAINING", text: 'Training', iconProps: {iconName: 'UserEvent'}}
    ];

    return (
        <div>
            <ChoiceGroup
                label="Soort opleiding"
                value={educationType}
                options={educationTypes}
                disabled={!education}
                onChange={wrapId(props.onChangeEducationType)}/>
            <TextField
                label="Opleidingsinstituut"
                value={institution}
                disabled={!education}
                onChange={wrapId(props.onChangeInstitution)}/>
            <TextField
                label="Opleiding"
                value={educationName}
                disabled={!education}
                onChange={wrapIdLocale(props.onChangeEducationName)}/>
            <TextField
                label="Syllabus"
                value={syllabus}
                disabled={!education}
                onChange={wrapIdLocale(props.onChangeSyllabus)}/>
            <TextField
                label="Jaar diploma"
                styles={{fieldGroup: {width: 100}}}
                placeholder='yyyy'
                value={yearDiploma}
                disabled={!education}
                onChange={wrapId(props.onChangeYearDiploma)}/>
            <Toggle
                label="Diploma"
                value={diploma}
                disabled={!education}
                onChange={wrapId(props.onChangeDiploma)}/>
        </div>
    )
};

const select = (state) => ({
    locale: state.ui.locale,
    education: state.safe.education
});

const mapDispatchToProps = (dispatch) => ({
    onChangeEducationType: (event, id) => dispatch(setEducationType(event.target.value, id)),
    onChangeInstitution: (event, id) => dispatch(setInstitution(event.target.value, id)),
    onChangeEducationName: (event, id, locale) => dispatch(setEducationName(event.target.value, id, locale)),
    onChangeSyllabus: (event, id, locale) => dispatch(setSyllabus(event.target.value, id, locale)),
    onChangeYearDiploma: (event, id) => dispatch(setYearDiploma(event.target.value, id)),
    onChangeDiploma: (event, id) => dispatch(setDiploma(event.target.value === "on", id))
});

export default connect(select, mapDispatchToProps)(Education)