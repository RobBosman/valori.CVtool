import React from "react"
import {Pivot, PivotItem, PivotLinkSize, PrimaryButton, Stack, Text, TextField} from "office-ui-fabric-react"
import {connect} from "react-redux"
import {requestLogout} from "../redux/ducks/AppState"
import {
    setCvInteresses,
    setCvPersoonlijkeEigenschappen,
    setCvProfielschets,
    setCvReactRTE
} from "../redux/ducks/CvContent"
import Personalia from "./Personalia"
import Title from "./Title"
import TrumbowygRTE from "./TrumbowygRTE"
import ReactRTE from "./ReactRTE";

const EditorPage = (props) => (
    <Stack>
        <Text variant="xxLarge">Welkom bij de <Title height="24em"/></Text>
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
            <PivotItem headerText="Trumbowyg">
                <TrumbowygRTE placeholder="typen maar!"/>
            </PivotItem>
            <PivotItem headerText="ReactRTE">
                <ReactRTE value={props.reactRTE}
                          onChange={props.onChangeReactRTE}
                          placeholder="go type something!"/>
            </PivotItem>
        </Pivot>
        <Stack.Item align="center">
            <PrimaryButton text="Afmelden" onClick={props.requestLogout}/>
        </Stack.Item>
    </Stack>
);

const select = (state) => ({
    profielschets: state.cvContent.profielschets,
    persoonlijkeEigenschappen: state.cvContent.persoonlijkeEigenschappen,
    interesses: state.cvContent.interesses,
    reactRTE: state.cvContent.reactRTE
});

const mapDispatchToProps = (dispatch) => ({
    onChangeProfielschets: (event) => dispatch(setCvProfielschets(event.target.value)),
    onChangePersoonlijkeEigenschappen: (event) => dispatch(setCvPersoonlijkeEigenschappen(event.target.value)),
    onChangeInteresses: (event) => dispatch(setCvInteresses(event.target.value)),
    onChangeReactRTE: (value) => dispatch(setCvReactRTE(value)),
    requestLogout: () => dispatch(requestLogout())
});

export default connect(select, mapDispatchToProps)(EditorPage)