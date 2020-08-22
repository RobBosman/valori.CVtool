import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Link, Stack, Text } from "@fluentui/react";
import Logo from "./widgets/CvLogo";
import LoginDialog from "./LoginDialog";
import { LoginStates } from "../services/authentication/authentication-actions";

const LoginPage = (props) => {

  const themedLargeStackTokens = {
    childrenGap: "l1",
    padding: "l1"
  };

  return (
    <div>
      <Stack tokens={themedLargeStackTokens} style={{ textAlign: "center" }}>
        <Text variant="xxLarge">Welkom bij <Logo height="24em" /></Text>
        <Text>Om CvCenter te gebruiken moet je je aanmelden met je <b>Valori</b> account.
          <br />Tijdens het inlogproces controleert CvCenter je account, je moet daar eenmalig toestemming voor geven.
          <br />
          <br /><Link href="https://account.activedirectory.windowsazure.com/r/#/applications"
            target="blank">Hier</Link> kun je die toestemming bekijken en eventueel weer intrekken.
          <br />Als je de <em>Valori CvCenter</em> app verwijdert blijven je cv-gegevens bewaard.
          <br />Na opnieuw inloggen (en toestemming verlenen) kun je daar weer bij.
          <br />
          <br />Problemen? <Link href="mailto:RobBosman@valori.nl" target="blank">Mail</Link> even!</Text>
      </Stack>
      {props.isLoggingIn
        ? <LoginDialog />
        : undefined }
    </div>
  );
};

LoginPage.propTypes = {
  isLoggingIn: PropTypes.bool.isRequired
};

const select = (state) => ({
  isLoggingIn: state.authentication.loginState === LoginStates.LOGGING_IN_OPENID
      || state.authentication.loginState === LoginStates.LOGGING_IN_BACKEND
});

export default connect(select)(LoginPage);