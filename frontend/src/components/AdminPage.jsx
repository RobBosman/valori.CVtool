import "./AdminPage.scss"
import React from "react"
import {Label, Pivot, PivotItem, PivotLinkSize, PrimaryButton, Text} from "office-ui-fabric-react"
import {connect} from "react-redux"
import {requestLogout} from "../redux/ducks/AppState"
import ReactRTE from "./ReactRTE"

const AdminPage = (props) => (
    <div className="AdminPage">
        <Text variant="xxLarge">Welkom admin</Text>

        <Pivot
            aria-label="OnChange Pivot Example"
            linkSize={PivotLinkSize.large}>
            <PivotItem itemIcon="Emoji" headerText="Foo" itemCount={42}>
                <ReactRTE/>
            </PivotItem>
            <PivotItem itemIcon="Emoji2" headerText="Bar">
                <ReactRTE/>
            </PivotItem>
            <PivotItem headerText="Bas">
                <Label>Pivot #3</Label>
            </PivotItem>
            <PivotItem headerText="Biz">
                <Label>Pivot #4</Label>
            </PivotItem>
        </Pivot>

        <PrimaryButton text="Afmelden" onClick={props.requestLogout}/>
    </div>
);

const mapDispatchToProps = (dispatch) => ({
    requestLogout: () => dispatch(requestLogout())
});

export default connect(null, mapDispatchToProps)(AdminPage)