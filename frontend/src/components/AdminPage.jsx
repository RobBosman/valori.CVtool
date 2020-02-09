import "./AdminPage.scss"
import React from "react"
import {Pivot, PivotItem, PivotLinkSize, PrimaryButton, Text, TextField} from "office-ui-fabric-react"
import {connect} from "react-redux"
import {requestLogout} from "../redux/ducks/AppState"
import {setCvContent} from "../redux/ducks/CvContent";

const AdminPage = (props) => (
    <div className="AdminPage">
        <Text variant="xxLarge">Welkom admin</Text>

        <Pivot
            aria-label="OnChange Pivot Example"
            linkSize={PivotLinkSize.large}>
            <PivotItem itemIcon="Emoji" headerText="TextField" itemCount={42}>
                <TextField label="Standard"
                           multiline
                           autoAdjustHeight
                           value={props.value}
                           onChange={props.onChange}/>
            </PivotItem>
            <PivotItem itemIcon="Emoji2" headerText="TextField">
                <TextField label="Standard"
                           multiline
                           autoAdjustHeight
                           value={props.value}
                           onChange={props.onChange}/>
            </PivotItem>
        </Pivot>

        <PrimaryButton text="Afmelden" onClick={props.requestLogout}/>
    </div>
);

const mapStateToProps = (state) => ({
    value: state.cvContent
});

const mapDispatchToProps = (dispatch) => ({
    onChange: (event) => dispatch(setCvContent(event.target.value)),
    requestLogout: () => dispatch(requestLogout())
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage)