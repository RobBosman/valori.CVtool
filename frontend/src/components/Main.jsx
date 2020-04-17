import React from "react"
import { connect } from "react-redux"
import { Fabric, Text } from "@fluentui/react"
import { LoginStates } from "../redux/authentication"
import ErrorBoundary from "./ErrorBoundary"
import LoginPage from "./LoginPage"
import ContentPage from "./ContentPage"
import TopBar from "./TopBar"
import TitleBar from "./TitleBar"
import PulseMonitor from "./PulseMonitor"

const renderMap = {
  [LoginStates.LOGGED_OUT]: <LoginPage />,
  [LoginStates.LOGGING_IN]: <Text>logging in...</Text>,
  [LoginStates.LOGGED_IN]: <ContentPage />,
  [LoginStates.LOGGING_OUT]: <Text>logging out...</Text>
};

const Main = (props) => {

  const renderContent = renderMap[props.loginState] || <ErrorPage message={`Unknown LoginState '${props.loginState}'`} />;

  return (
    <Fabric>
      <ErrorBoundary>
        <TopBar />
        <TitleBar />
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