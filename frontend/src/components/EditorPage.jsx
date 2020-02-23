import React from "react"
import {Label, Pivot, PivotItem, PivotLinkSize, PrimaryButton, Stack, Text, TextField} from "office-ui-fabric-react"
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
import ReactRTE from "./ReactRTE"
import SunEditorRTE from "./SunEditorRTE"
import ReactPageRTE from "./ReactPageRTE"
import JoditRTE from "./JoditRTE"
import TrumbowygRTE from "./TrumbowygRTE"

const EditorPage = (props) => (
    <Stack>
        <Text variant="xxLarge">Welkom bij de <Title height="24em"/></Text>
        <Pivot linkSize={PivotLinkSize.large}>
            <PivotItem itemIcon="Emoji" headerText="Personalia" itemCount={42}>
                <Personalia/>
            </PivotItem>
            <PivotItem itemIcon="Emoji2" headerText="Profiel">
                <TextField
                    label="Profielschets"
                    multiline
                    autoAdjustHeight
                    value={props.profielschets}
                    onChange={props.onChangeProfielschets}/>
                <TextField
                    label="Persoonlijke eigenschappen"
                    multiline
                    autoAdjustHeight
                    value={props.persoonlijkeEigenschappen}
                    onChange={props.onChangePersoonlijkeEigenschappen}/>
                <TextField
                    label="Interesses"
                    multiline
                    autoAdjustHeight
                    value={props.interesses}
                    onChange={props.onChangeInteresses}/>
            </PivotItem>
            <PivotItem headerText="Trumbowyg">
                <Label>Interesses</Label>
                <TrumbowygRTE
                    data={props.interesses}
                    onChange={props.onChangeInteressesRTE}
                    placeholder="typen maar!"/>
                <TextField
                    label="Interesses"
                    multiline
                    autoAdjustHeight
                    value={props.interesses}
                    onChange={props.onChangeInteresses}/>
            </PivotItem>
            <PivotItem headerText="ReactRTE">
                <Label>Interesses</Label>
                <ReactRTE
                    value={props.reactRTE}
                    onChange={props.onChangeReactRTE}
                    placeholder="go type something!"/>
                <TextField
                    label="Interesses"
                    multiline
                    autoAdjustHeight
                    value={props.interesses}
                    onChange={props.onChangeInteresses}/>
            </PivotItem>
            <PivotItem headerText="SunEditorRTE">
                <Label>Interesses</Label>
                <SunEditorRTE
                    value={props.interesses}
                    onChange={props.onChangeInteressesRTE}/>
                <TextField
                    label="Interesses"
                    multiline
                    autoAdjustHeight
                    value={props.interesses}
                    onChange={props.onChangeInteresses}/>
            </PivotItem>
            <PivotItem headerText="ReactPageRTE">
                <Label>Interesses</Label>
                <ReactPageRTE
                    value={props.interesses}
                    onChange={props.onChangeInteressesRTE}/>
                <TextField
                    label="Interesses"
                    multiline
                    autoAdjustHeight
                    value={props.interesses}
                    onChange={props.onChangeInteresses}/>
            </PivotItem>
            <PivotItem headerText="JoditRTE">
                <Label>Interesses</Label>
                <JoditRTE
                    value={props.interesses}
                    onChange={props.onChangeInteressesRTE}
                    placeholder="go type something!"/>
                <TextField
                    label="Interesses"
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
    onChangeInteressesRTE: (value) => dispatch(setCvInteresses(value)),
    onChangeReactRTE: (value) => dispatch(setCvReactRTE(value)),
    requestLogout: () => dispatch(requestLogout())
});

export default connect(select, mapDispatchToProps)(EditorPage)