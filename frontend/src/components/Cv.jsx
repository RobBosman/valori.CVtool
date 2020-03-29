import React from "react"
import {TextField} from "office-ui-fabric-react"
import {connect} from "react-redux"
import {setCvFunction, setCvInterests, setCvPersonality} from "../redux/ducks/Cv"

const locale = 'nl_NL';
const id = 'uuid-cv-1';

const Cv = (props) => {
    const cv = props.cv[id];
    const _function = (cv) ? cv.function : "";
    const personality = (cv) ? cv.personality[locale] : "";
    const interests = (cv) ? cv.interests[locale] : "";
    return (
        <div>
            <TextField
                label="Functie"
                multiline
                autoAdjustHeight
                value={_function}
                disabled={!cv}
                onChange={props.onChangeFunction}/>
            <TextField
                label="Profielschets"
                multiline
                autoAdjustHeight
                value={personality}
                disabled={!cv}
                onChange={props.onChangePersonality}/>
            <TextField
                label="Interesses"
                multiline
                autoAdjustHeight
                value={interests}
                disabled={!cv}
                onChange={props.onChangeInterests}/>
        </div>
    )
};

const select = (state) => ({
    cv: state.persistent.cv
});

const mapDispatchToProps = (dispatch) => ({
    onChangeFunction: (event) => dispatch(setCvFunction(id, event.target.value)),
    onChangePersonality: (event) => dispatch(setCvPersonality(id, locale, event.target.value)),
    onChangeInterests: (event) => dispatch(setCvInterests(id, locale, event.target.value))
});

export default connect(select, mapDispatchToProps)(Cv)