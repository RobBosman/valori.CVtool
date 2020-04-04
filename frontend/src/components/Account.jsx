import React from "react";
import {TextField} from "office-ui-fabric-react";
import {connect} from "react-redux";
import {mapHelpers, setSafeInstance} from "../redux/ducks/safe";

const Account = (props) => {

    const {instance, getValue, onChange} = mapHelpers(props.entity, props.entityId, props.onChange);

    return (
        <TextField
            label='Naam'
            value={getValue('name')}
            disabled={!instance}
            onChange={onChange('name')}
            styles={{fieldGroup: {width: 400}}}/>
    )
};

const select = (state) => ({
    entity: state.safe.account
});

const mapDispatchToProps = (dispatch) => ({
    onChange: (instance, id) => dispatch(setSafeInstance('account', id, instance))
});

export default connect(select, mapDispatchToProps)(Account)