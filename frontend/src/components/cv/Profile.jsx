import React from "react";
import {TextField} from "office-ui-fabric-react";
import {connect} from "react-redux";
import {mapHelpers, setSafeInstance} from "../../redux/ducks/safe";

const Profile = (props) => {

    const {instance, getValue, getValueLocale, onChange, onChangeLocale} = mapHelpers(props.entity, props.entityId, props.onChange, props.locale);

    return (
        <div>
            <TextField
                label="Rol"
                multiline
                autoAdjustHeight
                value={getValueLocale('role')}
                disabled={!instance}
                onChange={onChangeLocale('role')}/>
            <TextField
                label="Profielschets"
                multiline
                autoAdjustHeight
                value={getValueLocale('profile')}
                disabled={!instance}
                onChange={onChangeLocale('profile')}/>
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
                value={getValue('workingSince')}
                disabled={!instance}
                onChange={onChange('workingSince')}/>
            <TextField
                label="IT ervaring sinds"
                styles={{fieldGroup: {width: 100}}}
                placeholder='yyyy'
                value={getValue('inItSince')}
                disabled={!instance}
                onChange={onChange('inItSince')}/>
        </div>
    )
};

const select = (state) => ({
    locale: state.ui.locale,
    entity: state.safe.cv
});

const mapDispatchToProps = (dispatch) => ({
    onChange: (instance, id) => dispatch(setSafeInstance('cv', id, instance))
});

export default connect(select, mapDispatchToProps)(Profile)