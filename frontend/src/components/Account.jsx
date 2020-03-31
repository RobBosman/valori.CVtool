import React from "react"
import {getId, TextField} from "office-ui-fabric-react"
import {connect} from "react-redux"
import {setAccountName} from "../redux/ducks/Account"

const Account = (props) => {

    const [id, setId] = React.useState('uuid-account-1');
    const wrap = (func) => (event) => func(id, event);

    const account = props.account[id];
    const name = (account) ? account.name : "";
    return (
        <TextField
            id={getId('name')}
            label='Naam'
            value={name}
            disabled={!account}
            onChange={wrap(props.onChangeName)}
            styles={{fieldGroup: {width: 400}}}/>
    )
};

const select = (state) => ({
    account: state.safe.account
});

const mapDispatchToProps = (dispatch) => ({
    onChangeName: (id, event) => dispatch(setAccountName(id, event.target.value))
});

export default connect(select, mapDispatchToProps)(Account)