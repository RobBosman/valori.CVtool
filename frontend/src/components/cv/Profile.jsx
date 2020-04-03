import React from "react"
import {TextField} from "office-ui-fabric-react"
import {connect} from "react-redux"
import {
    setFunction,
    setInterests,
    setItExperienceSince,
    setPersonality,
    setWorkingExperienceSince
} from "../../redux/ducks/profileDuck"

const Profile = (props) => {

    const account = props.account ? props.account[props.accountId] : undefined;
    const cvId = account ? account.cvIds[0] : undefined;
    const cv = props.cv ? props.cv[cvId] : undefined;

    const functionTitle = (cv && cv.function) ? cv.function[props.locale] : "";
    const personality = (cv && cv.personality) ? cv.personality[props.locale] : "";
    const interests = (cv && cv.interests) ? cv.interests[props.locale] : "";
    let workingExperienceSince = (cv) ? cv.workingExperienceSince : "";
    let itExperienceSince = (cv) ? cv.itExperienceSince : "";

    const wrapId = (func) => (event) => func(event, cvId);
    const wrapIdLocale = (func) => (event) => func(event, cvId, props.locale);

    return (
        <div>
            <TextField
                label="Functie"
                multiline
                autoAdjustHeight
                value={functionTitle}
                disabled={!cv}
                onChange={wrapIdLocale(props.onChangeFunction)}/>
            <TextField
                label="Profielschets"
                multiline
                autoAdjustHeight
                value={personality}
                disabled={!cv}
                onChange={wrapIdLocale(props.onChangePersonality)}/>
            <TextField
                label="Interesses"
                multiline
                autoAdjustHeight
                value={interests}
                disabled={!cv}
                onChange={wrapIdLocale(props.onChangeInterests)}/>
            <TextField
                label="Werkervaring sinds"
                placeholder='yyyy'
                styles={{fieldGroup: {width: 100}}}
                value={workingExperienceSince}
                disabled={!cv}
                onChange={wrapId(props.onChangeWorkingExperienceSince)}/>
            <TextField
                label="IT ervaring sinds"
                styles={{fieldGroup: {width: 100}}}
                placeholder='yyyy'
                value={itExperienceSince}
                disabled={!cv}
                onChange={wrapId(props.onChangeItExperienceSince)}/>
        </div>
    )
};

const select = (state) => ({
    locale: state.ui.locale,
    accountId: state.ui.accountId,
    account: state.safe.account,
    cv: state.safe.cv
});

const mapDispatchToProps = (dispatch) => ({
    onChangeFunction: (event, id, locale) => dispatch(setFunction(event.target.value, id, locale)),
    onChangePersonality: (event, id, locale) => dispatch(setPersonality(event.target.value, id, locale)),
    onChangeInterests: (event, id, locale) => dispatch(setInterests(event.target.value, id, locale)),
    onChangeWorkingExperienceSince: (event, id) => dispatch(setWorkingExperienceSince(event.target.value, id)),
    onChangeItExperienceSince: (event, id) => dispatch(setItExperienceSince(event.target.value, id))
});

export default connect(select, mapDispatchToProps)(Profile)