import "./AdminPage.scss"
import React from "react"
import {initializeIcons, Label, Pivot, PivotItem, PivotLinkSize, PrimaryButton} from "office-ui-fabric-react"
import {connect} from "react-redux"
import {requestLogout} from "../redux/ducks/AppState"

initializeIcons();

const AdminPage = (props) => (
    <div className="AdminPage">
        <h2>Welkom admin</h2>

        <Pivot
            aria-label="OnChange Pivot Example"
            linkSize={PivotLinkSize.large}>
            <PivotItem itemIcon="Emoji" headerText="Foo" itemCount={42}>
                <Label>Pivot #1</Label>
            </PivotItem>
            <PivotItem itemIcon="Emoji2" headerText="Bar">
                <Label>Pivot #2</Label>
            </PivotItem>
            <PivotItem headerText="Bas">
                <Label>Pivot #3</Label>
            </PivotItem>
            <PivotItem headerText="Biz">
                <Label>Pivot #4</Label>
            </PivotItem>
        </Pivot>

        <PrimaryButton text="Logout" onClick={props.requestLogout}/>
    </div>
);

const mapDispatchToProps = (dispatch) => ({
    requestLogout: () => dispatch(requestLogout())
});

export default connect(null, mapDispatchToProps)(AdminPage)