import "./AdminPage.scss"
import React from "react"
import {Pivot, PivotItem, PivotLinkSize, PrimaryButton, Text} from "office-ui-fabric-react"
import {connect} from "react-redux"
import {requestLogout} from "../redux/ducks/AppState"
import ReactRTE from "./ReactRTE"
import TrumbowygRTE from "./TrumbowygRTE"

const AdminPage = (props) => (
    <div className="AdminPage">
        <Text variant="xxLarge">Welkom admin</Text>

        <Pivot
            aria-label="OnChange Pivot Example"
            linkSize={PivotLinkSize.large}>
            <PivotItem itemIcon="Emoji" headerText="Trumbowyg" itemCount={42}>
                <TrumbowygRTE placeholder="just type something"/>
            </PivotItem>
            <PivotItem itemIcon="Emoji2" headerText="Trumbowyg">
                <TrumbowygRTE placeholder="typen maar"/>
            </PivotItem>
            <PivotItem headerText="RTE">
                <ReactRTE placeholder="blabla" readOnly={false}/>
            </PivotItem>
            <PivotItem headerText="RTE">
                <ReactRTE placeholder="hiep hiep hoera!" readOnly={true}/>
            </PivotItem>
        </Pivot>

        <PrimaryButton text="Afmelden" onClick={props.requestLogout}/>
    </div>
);

const mapDispatchToProps = (dispatch) => ({
    requestLogout: () => dispatch(requestLogout())
});

export default connect(null, mapDispatchToProps)(AdminPage)