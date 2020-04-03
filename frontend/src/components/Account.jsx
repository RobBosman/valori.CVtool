import React from "react";
import {getId, TextField} from "office-ui-fabric-react";
import {connect} from "react-redux";
import {mapHelpers} from "../redux/utils";
import {setEntity} from "../redux/ducks/safe";

const Account = (props) => {

    const {instance, getValue, onChange} = mapHelpers(props.entities, props.entityId, props.onChange);

    return (
        <TextField
            id={getId('name')}
            label='Naam'
            value={getValue('name')}
            disabled={!instance}
            onChange={onChange('name')}
            styles={{fieldGroup: {width: 400}}}/>
    )
};

const select = (state) => ({
    entities: state.safe.account
});

const mapDispatchToProps = (dispatch) => ({
    onChange: (instance, id) => dispatch(setEntity('account', id, instance))
});

export default connect(select, mapDispatchToProps)(Account)