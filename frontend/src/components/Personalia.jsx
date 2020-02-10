import React from "react"
import {getId, Label, TextField} from "office-ui-fabric-react"
import {connect} from "react-redux"
import {setCvAchternaam, setCvVoornaam} from "../redux/ducks/CvContent"

const AdminPage = (props) => {
    const voornaamId = getId('voornaam');
    const achternaamId = getId('achternaam');

    return (
        <table className="ms-Table">
            <tbody>
            <tr className="ms-Table-row">
                <td className="ms-Table-cell">
                    <Label htmlFor={voornaamId}>Voornaam</Label>
                </td>
                <td className="ms-Table-cell">
                    <TextField id={voornaamId}
                               value={props.voornaam}
                               onChange={props.onChangeVoornaam}/>
                </td>
            </tr>
            <tr className="ms-Table-row">
                <td className="ms-Table-cell">
                    <Label htmlFor={achternaamId}>Achternaam</Label>
                </td>
                <td className="ms-Table-cell">
                    <TextField id={achternaamId}
                               value={props.achternaam}
                               onChange={props.onChangeAchternaam}/>
                </td>
            </tr>
            </tbody>
        </table>
    )
};

const mapStateToProps = (state) => ({
    voornaam: state.cvContent.voornaam,
    achternaam: state.cvContent.achternaam
});

const mapDispatchToProps = (dispatch) => ({
    onChangeVoornaam: (event) => dispatch(setCvVoornaam(event.target.value)),
    onChangeAchternaam: (event) => dispatch(setCvAchternaam(event.target.value))
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage)