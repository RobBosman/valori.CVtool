import React from "react";
import {TextField} from "office-ui-fabric-react";
import {connect} from "react-redux";
import {mapHelpers} from "../../redux/utils";
import {setEntity} from "../../redux/ducks/safe";

const Profile = (props) => {

    const {instance, getValue, getValueLocale, onChange, onChangeLocale} = mapHelpers(props.entities, props.entityId, props.onChange, props.locale);

    return (
        <div>
            <TextField
                label="Functie"
                multiline
                autoAdjustHeight
                value={getValueLocale('function')}
                disabled={!instance}
                onChange={onChangeLocale('function')}/>
            <TextField
                label="Profielschets"
                multiline
                autoAdjustHeight
                value={getValueLocale('personality')}
                disabled={!instance}
                onChange={onChangeLocale('personality')}/>
            <TextField
                label="Interesses"
                multiline
                autoAdjustHeight
                value={getValueLocale('interests')}
                disabled={!instance}
                onChange={onChangeLocale('interests')}/>
            <TextField
                label="Werkervaring sinds"
                placeholder='yyyy'
                styles={{fieldGroup: {width: 100}}}
                value={getValue('workingExperienceSince')}
                disabled={!instance}
                onChange={onChange('workingExperienceSince')}/>
            <TextField
                label="IT ervaring sinds"
                styles={{fieldGroup: {width: 100}}}
                placeholder='yyyy'
                value={getValue('itExperienceSince')}
                disabled={!instance}
                onChange={onChange('itExperienceSince')}/>
        </div>
    )
};

const select = (state) => ({
    locale: state.ui.locale,
    entities: state.safe.cv
});

const mapDispatchToProps = (dispatch) => ({
    onChange: (instance, id) => dispatch(setEntity('cv', id, instance))
});

export default connect(select, mapDispatchToProps)(Profile)