import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Fabric, Text, Separator } from "@fluentui/react";
import { LoginStates } from "../services/authentication/authentication-actions";
import LoginPage from "./LoginPage";
import ContentPage from "./ContentPage";
import CvTopBar from "./widgets/CvTopBar";
import PulseMonitor from "../utils/PulseMonitor";
import ErrorPage from "./ErrorPage";

const RENDER_MAP = {
  [LoginStates.LOGGED_OUT]: <LoginPage />,
  [LoginStates.LOGGING_IN]: <Text>logging in...</Text>,
  [LoginStates.LOGGED_IN]: <ContentPage />,
  [LoginStates.LOGGING_OUT]: <Text>logging out...</Text>
};

const Main = (props) => {
  const renderContent = RENDER_MAP[props.loginState]
    || <ErrorPage message={`Unknown LoginState '${props.loginState}'`} />;

  return (
    <Fabric>
      <CvTopBar />
      <Separator />
      {renderContent}
      {/* <AutoLogout delayMillis={10000}/> */}
      <PulseMonitor />
    </Fabric>
  );
};

Main.propTypes = {
  loginState: PropTypes.string.isRequired
};

const select = (state) => ({
  loginState: state.authentication.loginState
});

export default connect(select)(Main);