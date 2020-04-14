import React from "react"
import { connect } from "react-redux"
import { Fabric, Text } from "@fluentui/react"
import { LoginStates } from "../redux/authentication"
import ErrorBoundary from "./ErrorBoundary"
import LoginPage from "./LoginPage"
import EditorPage from "./cv/EditorPage"
import MenuBar from "./MenuBar"
import PulseMonitor from "./PulseMonitor"

const Main = (props) => {

  const renderContent = {
    [LoginStates.LOGGED_OUT]: <LoginPage />,
    [LoginStates.LOGGING_IN]: <Text>logging in...</Text>,
    [LoginStates.LOGGED_IN]: <EditorPage />,
    [LoginStates.LOGGING_OUT]: <Text>logging out...</Text>
  }[props.loginState]
    || <ErrorPage message={`Unknown AuthenticationState '${props.loginState}'`} />;

  return (
    <Fabric>
      <ErrorBoundary>
        <MenuBar />
        {renderContent}
        {/* <AutoLogout delayMillis={10000}/> */}
        <PulseMonitor />
      </ErrorBoundary>
    </Fabric>
  );
};

const select = (state) => ({
  loginState: state.authentication.loginState
});

export default connect(select)(Main)