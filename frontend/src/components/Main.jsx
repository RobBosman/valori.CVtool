import React from "react"
import {connect} from "react-redux"
import ErrorPage from "./ErrorPage"
import LoginPage from "./LoginPage"
import EditorPage from "./EditorPage"
import {AppStates} from "../redux/ducks/AppState"
import {initializeIcons, Text} from "office-ui-fabric-react"
import MenuBar from "./MenuBar";

initializeIcons();

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
        <div>
            <MenuBar/>
            <hr/>
            {renderChildren(props)}
        </div>
    );
};

const mapStateToProps = (state) => ({
    appState: state.appState
});

export default connect(mapStateToProps)(Main)