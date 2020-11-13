import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Link, PrimaryButton, Stack, Text } from "@fluentui/react";
import CvLogo from "./widgets/CvLogo";
import LoginDialog from "./LoginDialog";
import * as authenticationActions from "../services/authentication/authentication-actions";

const LoginPage = (props) => {

  const stackTokens = {
    childrenGap: "l1",
    padding: "l1"
  };
  const styles = {
    textAlign: "center"
  };

  return (
    <Stack>
      <CvLogo/>
      <Stack tokens={stackTokens} style={styles}>
        <Text variant="xxLarge">Welkom bij de <span style={{ color: "#999999" }}><b>CVtool</b></span></Text>
        <Text>
          <p>Om de CVtool te gebruiken moet je je aanmelden met je <b>Valori</b> account.
            <br/>Tijdens het inlogproces controleert de CVtool je account, je moet daar eenmalig toestemming voor geven.
            <br/>
            <br/><Link href="https://account.activedirectory.windowsazure.com/r/#/applications"
              target="blank">Hier</Link> kun je die toestemming bekijken en eventueel weer intrekken.
            <br/>Als je de machtigingen voor de <em>Valori CVtool</em> intrekt blijven je cv-gegevens bewaard.
            <br/>Na opnieuw inloggen (en toestemming verlenen) kun je daar weer bij.
            <br/>
            <br/>Problemen? <Link href="mailto:RobBosman@valori.nl" target="blank">Mail</Link> even!
          </p>
        </Text>
        <Stack.Item align="center">
          <PrimaryButton
            text="Inloggen"
            iconProps={{ iconName: "Signin" }}
            onClick={props.requestToLogin}
          />
        </Stack.Item>
      </Stack>
      {props.isLoggingIn
        ? <LoginDialog />
        : undefined }
    </Stack>
  );
};

LoginPage.propTypes = {
  isLoggingIn: PropTypes.bool.isRequired,
  requestToLogin: PropTypes.func.isRequired,
};

const select = (state) => ({
  isLoggingIn: state.authentication.loginState === authenticationActions.LoginStates.LOGGING_IN_OPENID
      || state.authentication.loginState === authenticationActions.LoginStates.LOGGING_IN_BACKEND
});

const mapDispatchToProps = (dispatch) => ({
  requestToLogin: () => dispatch(authenticationActions.requestLogin())
});

export default connect(select, mapDispatchToProps)(LoginPage);