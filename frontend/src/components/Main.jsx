import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Fabric } from "@fluentui/react";
import { LoginStates } from "../services/authentication/authentication-actions";
import LoginPage from "./LoginPage";
import ContentPage from "./ContentPage";
import CvTopBar from "./widgets/CvTopBar";
// import PulseMonitor from "../utils/PulseMonitor";
import ErrorDialog from "./ErrorDialog";

const Main = (props) => {

  return (
    <Fabric>
      <ErrorDialog />
      <CvTopBar />
      {props.isLoggedIn ? <ContentPage /> : <LoginPage />}
      {
        // <PulseMonitor />
      }
    </Fabric>
  );
};

Main.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired
};

const select = (state) => ({
  isLoggedIn: state.authentication.loginState === LoginStates.LOGGED_IN
});

export default connect(select)(Main);