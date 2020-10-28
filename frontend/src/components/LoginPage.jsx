import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Link, PrimaryButton, Stack, Text } from "@fluentui/react";
import Logo from "./widgets/CvLogo";
import LoginDialog from "./LoginDialog";
import * as authenticationActions from "../services/authentication/authentication-actions";

const LoginPage = (props) => {

  const themedLargeStackTokens = {
    childrenGap: "l1",
    padding: "l1"
  };

  return (
    <div>
      <Stack tokens={themedLargeStackTokens} style={{ textAlign: "center" }}>
        <Text variant="xxLarge">Welkom bij de <Logo height="24em" /></Text>
        <Text>
          <p>Om de CVtool te gebruiken moet je je aanmelden met je <b>Valori</b> account.
            <br/>Tijdens het inlogproces controleert de CVtool je account, je moet daar eenmalig toestemming voor geven.
            <br/>
            <br/><Link href="https://account.activedirectory.windowsazure.com/r/#/applications"
              target="blank">Hier</Link> kun je die toestemming bekijken en eventueel weer intrekken.
            <br/>Als je de <em>Valori CVtool</em> app verwijdert blijven je cv-gegevens bewaard.
            <br/>Na opnieuw inloggen (en toestemming verlenen) kun je daar weer bij.
            <br/>
            <br/>Problemen? <Link href="mailto:RobBosman@valori.nl" target="blank">Mail</Link> even!
          </p>
        </Text>
        <Stack.Item align="center">
          <PrimaryButton
            text="Aanmelden"
            iconProps={{ iconName: "Signin" }}
            onClick={props.requestToLogin}
          />
        </Stack.Item>
      </Stack>
      {props.isLoggingIn
        ? <LoginDialog />
        : undefined }
    </div>
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