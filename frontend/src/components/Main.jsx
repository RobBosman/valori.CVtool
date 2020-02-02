import "./Main.scss"
import React from "react"
import {connect} from "react-redux"
import ErrorPage from "./ErrorPage"
import LoginPage from "./LoginPage"
import AdminPage from "./AdminPage"
import {AppStates} from "../redux/ducks/AppState"
import {Text} from "office-ui-fabric-react"

const Main = (props) => (
    <div className="Main">
        {renderChildren(props)}
    </div>
);

const renderChildren = (props) => {
    switch (props.appState) {
        case AppStates.LOGGED_OUT:
            return (
                <LoginPage/>
            );
        case AppStates.LOGGING_IN:
            return (
                <Text>logging in...</Text>
            );
        case AppStates.LOGGED_IN:
            return (
                <div>
                    <AdminPage/>
                    {/* TODO
                    <AutoLogout delayMillis="10000"/>
                    */}
                </div>
            );
        case AppStates.LOGGING_OUT:
            return (
                <Text>logging out...</Text>
            );
        default:
            return (
                <ErrorPage/>
            );
    }
};

const mapStateToProps = (state) => ({
    appState: state.appState
});

export default connect(mapStateToProps)(Main)