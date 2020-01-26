import React from "react"
import {connect} from "react-redux";
import ErrorPage from "./ErrorPage"
import LoginPage from "./LoginPage"
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
                <span>logged in</span>
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