import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { ThemeProvider } from "@fluentui/react";
import { LoginStates } from "../services/auth/auth-actions";
import LoginPage from "./LoginPage";
import ContentPage from "./ContentPage";
import ErrorDialog from "./ErrorDialog";
// import "./ThemeExposer";

const Main = (props) => {

  return (
    <ThemeProvider>
      <ErrorDialog />
      {props.isLoggedIn ? <ContentPage /> : <LoginPage />}
    </ThemeProvider>
  );
};

Main.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired
};

const select = (state) => ({
  isLoggedIn: state.auth.loginState === LoginStates.LOGGED_IN
});

export default connect(select)(Main);