import React from "react"
import {connect} from "react-redux"
import ErrorBoundary from "./ErrorBoundary"
import ErrorPage from "./ErrorPage"
import LoginPage from "./LoginPage"
import EditorPage from "./EditorPage"
import {AppStates} from "../redux/ducks/AppState"
import {initializeIcons, registerOnThemeChangeCallback, Text} from "office-ui-fabric-react"
import MenuBar from "./MenuBar"

initializeIcons();

registerOnThemeChangeCallback((theme) => {
    document.documentElement.style.background = theme.semanticColors.bodyBackground
});

const Main = (props) => {
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
                        <EditorPage/>
                        {/* <AutoLogout delayMillis={10000}/> */}
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

    return (
        <ErrorBoundary>
            <MenuBar/>
            <hr/>
            {renderChildren(props)}
            {/*
            <EventBridge/>
            */}
        </ErrorBoundary>
    );
};

const mapStateToProps = (state) => ({
    appState: state.appState,
    theme: state.theme
});

export default connect(mapStateToProps)(Main)