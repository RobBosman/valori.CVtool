import "./Main.scss"
import React from "react"
import {connect} from "react-redux"
import ErrorPage from "./ErrorPage"
import LoginPage from "./LoginPage"
import AdminPage from "./AdminPage"
import {AppStates} from "../redux/ducks/AppState"
import {loadTheme} from "office-ui-fabric-react"
import {dark} from "../themes/dark"
import {light} from "../themes/light"
import {custom} from "../themes/custom"

loadTheme(light);
loadTheme(dark);
loadTheme(custom);

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
                <span>logging in...</span>
            );
        case AppStates.LOGGED_IN:
            return (
                <div>
                    <AdminPage/>
                    {/*
                    <AutoLogout delayMillis="10000"/>
                    */}
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

const mapStateToProps = (state) => ({
    appState: state.appState
});

export default connect(mapStateToProps)(Main)