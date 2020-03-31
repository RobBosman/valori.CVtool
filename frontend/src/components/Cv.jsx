import React from "react"
import {TextField} from "office-ui-fabric-react"
import {connect} from "react-redux"
import {setFunction, setInterests, setPersonality} from "../redux/ducks/Cv"

const Cv = (props) => {

    const [locale, setLocale] = React.useState('nl_NL');
    const [id, setId] = React.useState('uuid-cv-1');
    const wrap = (func) => (event) => func(id, locale, event);

    const cv = props.cv[id];
    const _function = (cv && cv.function) ? cv.function[locale] : "";
    const personality = (cv && cv.personality) ? cv.personality[locale] : "";
    const interests = (cv && cv.interests) ? cv.interests[locale] : "";
    return (
        <div>
            <TextField
                label="Functie"
                multiline
                autoAdjustHeight
                value={_function}
                disabled={!cv}
                onChange={wrap(props.onChangeFunction)}/>
            <TextField
                label="Profielschets"
                multiline
                autoAdjustHeight
                value={personality}
                disabled={!cv}
                onChange={wrap(props.onChangePersonality)}/>
            <TextField
                label="Interesses"
                multiline
                autoAdjustHeight
                value={interests}
                disabled={!cv}
                onChange={wrap(props.onChangeInterests)}/>
            <TextField
                label="Werkervaring sinds"
                placeholder='yyyy'
                disabled={!cv}
                styles={{fieldGroup: {width: 100}}}/>
            <TextField
                label="IT ervaring sinds"
                placeholder='yyyy'
                disabled={!cv}
                styles={{fieldGroup: {width: 100}}}/>
        </div>
    )
};

const select = (state) => ({
    cv: state.safe.cv
});

const mapDispatchToProps = (dispatch) => ({
    onChangeFunction: (id, locale, event) => dispatch(setFunction(id, locale, event.target.value)),
    onChangePersonality: (id, locale, event) => dispatch(setPersonality(id, locale, event.target.value)),
    onChangeInterests: (id, locale, event) => dispatch(setInterests(id, locale, event.target.value))
});

export default connect(select, mapDispatchToProps)(Cv)