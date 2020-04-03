import React from "react"
import {connect} from "react-redux"
import {AuthenticationStates} from "../redux/ducks/authentication"
import {Fabric, initializeIcons, registerOnThemeChangeCallback, Text} from "office-ui-fabric-react"
import ErrorBoundary from "./ErrorBoundary"
import ErrorPage from "./ErrorPage"
import LoginPage from "./LoginPage"
import EditorPage from "./EditorPage"
import MenuBar from "./MenuBar"
import PulseMonitor from "./PulseMonitor"

initializeIcons();

registerOnThemeChangeCallback((theme) => {
    document.documentElement.style.background = theme.semanticColors.bodyBackground
});

const Main = (props) => {
    const renderChildren = () => {
        switch (props.authentication) {
            case AuthenticationStates.LOGGED_OUT:
                return (<LoginPage/>);
            case AuthenticationStates.LOGGING_IN:
                return (<Text>logging in...</Text>);
            case AuthenticationStates.LOGGED_IN:
                return (<EditorPage/>);
            case AuthenticationStates.LOGGING_OUT:
                return (<Text>logging out...</Text>);
            default:
                return (<ErrorPage/>);
        }
    };

    return (
        <Fabric>
            <ErrorBoundary>
                <MenuBar/>
                <hr/>
                {renderChildren()}
                {/*
                <Heartbeat period={2000}/>
                <AutoLogout delayMillis={10000}/>
                */}
                <PulseMonitor/>
            </ErrorBoundary>
        </Fabric>
    );
};

const select = (state) => ({
    authentication: state.authentication,
    theme: state.theme
});

export default connect(select)(Main)