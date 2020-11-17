import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Fabric, loadTheme } from "@fluentui/react";
import { LoginStates } from "../services/authentication/authentication-actions";
import LoginPage from "./LoginPage";
import ContentPage from "./ContentPage";
import ErrorDialog from "./ErrorDialog";
import valoriBlueTheme from "../static/themes/valoriBlue.json";
// import "./ThemeExposer";

const Main = (props) => {
  loadTheme(valoriBlueTheme);

  return (
    <Fabric>
      <ErrorDialog />
      {props.isLoggedIn ? <ContentPage /> : <LoginPage />}
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