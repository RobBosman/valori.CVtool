import React from "react"
import {connect} from "react-redux"
import ErrorBoundary from "./ErrorBoundary"
import ErrorPage from "./ErrorPage"
import LoginPage from "./LoginPage"
import EditorPage from "./EditorPage"
import {AppStates} from "../redux/ducks/AppState"
import {Fabric, initializeIcons, registerOnThemeChangeCallback, Text} from "office-ui-fabric-react"
import MenuBar from "./MenuBar"
import PulseMonitor from "./PulseMonitor";

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
        <Fabric>
            <ErrorBoundary>
                <MenuBar/>
                <hr/>
                {renderChildren(props)}
                {/*
                <Heartbeat period={2000}/>
                */}
                <PulseMonitor/>
            </ErrorBoundary>
        </Fabric>
    );
};

const select = (state) => ({
    appState: state.appState,
    theme: state.theme
});

export default connect(select)(Main)