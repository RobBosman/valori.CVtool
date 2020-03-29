import React from "react"
import {getId, Label, TextField} from "office-ui-fabric-react"
import {connect} from "react-redux"
import {setAccountName} from "../redux/ducks/Account"

const id = 'uuid-account-1';

const Account = (props) => {
    const account = props.account[id];
    const name = (account) ? account.name : "";
    return (
        <table className="ms-Table">
            <tbody>
            <tr className="ms-Table-row">
                <td className="ms-Table-cell">
                    <Label htmlFor={getId('name')}>Naam</Label>
                </td>
                <td className="ms-Table-cell">
                    <TextField
                        id={getId('name')}
                        label='Naam'
                        value={name}
                        disabled={!account}
                        onChange={props.onChangeName}/>
                </td>
            </tr>
            </tbody>
        </table>
    )
};

const select = (state) => ({
    account: state.persistent.account
});

const mapDispatchToProps = (dispatch) => ({
    onChangeName: (event) => dispatch(setAccountName(id, event.target.value))
});

export default connect(select, mapDispatchToProps)(Account)