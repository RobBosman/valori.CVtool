import "./AdminPage.scss"
import React from "react"
import {getId, Label, Stack, TextField} from "office-ui-fabric-react"
import {connect} from "react-redux"
import {setCvAchternaam, setCvVoornaam} from "../redux/ducks/CvContent"

const AdminPage = (props) => {
    const voornaamId = getId('voornaam');
    const achternaamId = getId('achternaam');
    return (
        <Stack>
            <Stack horizontal>
                <Label htmlFor={voornaamId}>Voornaam</Label>
                <TextField id={voornaamId}
                           value={props.voornaam}
                           onChange={props.onChangeVoornaam}/>
            </Stack>
            <Stack horizontal>
                <Label htmlFor={achternaamId}>Achternaam</Label>
                <TextField id={achternaamId}
                           value={props.achternaam}
                           onChange={props.onChangeAchternaam}/>
            </Stack>
        </Stack>
    );
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