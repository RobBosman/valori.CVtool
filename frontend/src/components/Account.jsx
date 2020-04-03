import React from "react"
import {getId, TextField} from "office-ui-fabric-react"
import {connect} from "react-redux"
import {setAccountName} from "../redux/ducks/accountDuck"

const Account = (props) => {

    const account = props.account[props.id];
    const name = (account) ? account.name : "";

    const wrapId = (func) => (event) => func(event, props.id);

    return (
        <TextField
            id={getId('name')}
            label='Naam'
            value={name}
            disabled={!account}
            onChange={wrapId(props.onChangeName)}
            styles={{fieldGroup: {width: 400}}}/>
    )
};

const select = (state) => ({
    account: state.safe.account,
    id: state.ui.accountId
});

const mapDispatchToProps = (dispatch) => ({
    onChangeName: (event, id) => dispatch(setAccountName(event.target.value, id))
});

export default connect(select, mapDispatchToProps)(Account)