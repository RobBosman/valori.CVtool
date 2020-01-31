import React from "react"
import {connect} from "react-redux"
import ErrorPage from "./ErrorPage"
import LoginPage from "./LoginPage"
import AdminPage from "./AdminPage";
import AutoLogout from "./AutoLogout"
import {AppStates} from "../redux/ducks/AppState"
import "./Main.scss"

const mapStateToProps = (state) => ({
    appState: state.appState
});

const Main = (props) => ((
    <div className="Main">
        {renderChildren(props)}
    </div>
));

const renderChildren = (props) => {
    switch (props.appState) {
        case AppStates.LOGGED_OUT:
            return (
                <LoginPage/>
            );
        case AppStates.LOGGING_IN:
            return (
                <span>logging in...</span>
            );
        case AppStates.LOGGED_IN:
            return (
                <div>
                    <AdminPage/>
                    <AutoLogout delayMillis="3000"/>
                </div>
            );
        case AppStates.LOGGING_OUT:
            return (
                <span>logging out...</span>
            );
        default:
            return (
                <ErrorPage/>
            );
    }
};

export default connect(mapStateToProps)(Main)