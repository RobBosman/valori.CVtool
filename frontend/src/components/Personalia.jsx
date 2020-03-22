import React from "react"
import {getId, Label, TextField} from "office-ui-fabric-react"
import {connect} from "react-redux"
import {setCvAchternaam, setCvVoornaam} from "../redux/ducks/CvContent"

const Personalia = (props) => (
    <table className="ms-Table">
        <tbody>
        <tr className="ms-Table-row">
            <td className="ms-Table-cell">
                <Label htmlFor={getId('voornaam')}>Voornaam</Label>
            </td>
            <td className="ms-Table-cell">
                <TextField id={getId('voornaam')}
                           value={props.voornaam}
                           onChange={props.onChangeVoornaam}/>
            </td>
        </tr>
        <tr className="ms-Table-row">
            <td className="ms-Table-cell">
                <Label htmlFor={getId('achternaam')}>Achternaam</Label>
            </td>
            <td className="ms-Table-cell">
                <TextField id={getId('achternaam')}
                           value={props.achternaam}
                           onChange={props.onChangeAchternaam}/>
            </td>
        </tr>
        </tbody>
    </table>
);

const select = (state) => ({
    voornaam: state.cvContent.voornaam,
    achternaam: state.cvContent.achternaam
});

const mapDispatchToProps = (dispatch) => ({
    onChangeVoornaam: (event) => dispatch(setCvVoornaam(event.target.value)),
    onChangeAchternaam: (event) => dispatch(setCvAchternaam(event.target.value))
});

export default connect(select, mapDispatchToProps)(Personalia)