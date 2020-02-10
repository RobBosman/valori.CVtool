import React from "react"
import {Pivot, PivotItem, PivotLinkSize, PrimaryButton, Stack, Text, TextField} from "office-ui-fabric-react"
import {connect} from "react-redux"
import {requestLogout} from "../redux/ducks/AppState"
import {setCvInteresses, setCvPersoonlijkeEigenschappen, setCvProfielschets} from "../redux/ducks/CvContent"
import Personalia from "./Personalia"

const AdminPage = (props) => (
    <Stack>
        <Text variant="xxLarge">Welkom admin</Text>
        <Pivot linkSize={PivotLinkSize.large}>
            <PivotItem itemIcon="Emoji" headerText="Personalia" itemCount={42}>
                <Personalia/>
            </PivotItem>
            <PivotItem itemIcon="Emoji2" headerText="Profiel">
                <TextField label="Profielschets"
                           multiline
                           autoAdjustHeight
                           value={props.profielschets}
                           onChange={props.onChangeProfielschets}/>
                <TextField label="Persoonlijke eigenschappen"
                           multiline
                           autoAdjustHeight
                           value={props.persoonlijkeEigenschappen}
                           onChange={props.onChangePersoonlijkeEigenschappen}/>
                <TextField label="Interesses"
                           multiline
                           autoAdjustHeight
                           value={props.interesses}
                           onChange={props.onChangeInteresses}/>
            </PivotItem>
        </Pivot>
        <Stack.Item align="center">
            <PrimaryButton text="Afmelden" onClick={props.requestLogout}/>
        </Stack.Item>
    </Stack>
);

const mapStateToProps = (state) => ({
    profielschets: state.cvContent.profielschets,
    persoonlijkeEigenschappen: state.cvContent.persoonlijkeEigenschappen,
    interesses: state.cvContent.interesses
});

const mapDispatchToProps = (dispatch) => ({
    onChangeProfielschets: (event) => dispatch(setCvProfielschets(event.target.value)),
    onChangePersoonlijkeEigenschappen: (event) => dispatch(setCvPersoonlijkeEigenschappen(event.target.value)),
    onChangeInteresses: (event) => dispatch(setCvInteresses(event.target.value)),
    requestLogout: () => dispatch(requestLogout())
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage)