import React from "react"
import {connect} from "react-redux"
import {AuthenticationStates} from "../redux/authentication"
import {Fabric, Text} from "office-ui-fabric-react"
import ErrorBoundary from "./ErrorBoundary"
import LoginPage from "./LoginPage"
import EditorPage from "./EditorPage"
import MenuBar from "./MenuBar"
import PulseMonitor from "./PulseMonitor"

const Main = (props) => {
    const renderChildren = () => {
      switch (props.loginState) {
            case AuthenticationStates.LOGGED_OUT:
                return (<LoginPage/>);
            case AuthenticationStates.LOGGING_IN:
                return (<Text>logging in...</Text>);
            case AuthenticationStates.LOGGED_IN:
                return (<EditorPage/>);
            case AuthenticationStates.LOGGING_OUT:
                return (<Text>logging out...</Text>);
            default:
              throw Error("Unknown authentication", props.authentication)
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
  loginState: state.authentication.loginState
});

export default connect(select)(Main)