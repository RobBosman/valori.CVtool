import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { DefaultButton, Link, PrimaryButton, Stack, Text } from "@fluentui/react";
import CvLogo from "./widgets/CvLogo";
import LoginDialog from "./LoginDialog";
import * as authActions from "../services/auth/auth-actions";

const LoginPage = (props) => {

  const stackTokens = {
    childrenGap: "l1",
    padding: "l1"
  };
  const styles = {
    textAlign: "center"
  };

  const onOpenAppsPage = () =>
    window.open("https://myapplications.microsoft.com/", "blank");

  return (
    <Stack>
      <CvLogo/>
      <Stack tokens={stackTokens} style={styles}>
        <Text variant="xxLarge">Welkom bij de <span style={{ color: "#999999" }}><b>CVtool</b></span></Text>
        <Text>
          <p>Om de CVtool te gebruiken moet je je aanmelden met je <b>Valori</b> account.
            <br/>Tijdens het inlogproces controleert de CVtool je account, je moet daar eenmalig een machtiging voor geven.
            <br/>
            <br/>Je kunt die machtiging te allen tijde weer intrekken via <em>Apps beheren</em>.
            <br/>Als je de machtiging voor de <em>Valori CVtool</em> intrekt blijven je cv-gegevens bewaard.
            <br/>Na opnieuw inloggen (en toestemming verlenen) kun je daar weer bij.
          </p>
        </Text>
        <Stack.Item align="center">
          <Stack horizontal
            tokens={{ childrenGap: "l1" }}>
            <PrimaryButton
              text="Inloggen"
              iconProps={{ iconName: "Signin" }}
              onClick={props.requestToLogin}
            />
            <DefaultButton
              text="Apps beheren"
              iconProps={{ iconName: "AllApps" }}
              onClick={onOpenAppsPage}/>
          </Stack>
        </Stack.Item>
        <Text>
          <p>Problemen? <Link href="mailto:RobBosman@valori.nl?subject=CVtool" target="blank"><span style={{textDecoration: "underline"}}>Mail</span></Link> even!</p>
        </Text>
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
  isLoggingIn: state.auth.loginState === authActions.LoginStates.LOGGING_IN_OPENID
      || state.auth.loginState === authActions.LoginStates.LOGGING_IN_BACKEND
});

const mapDispatchToProps = (dispatch) => ({
  requestToLogin: () => dispatch(authActions.requestLogin())
});

export default connect(select, mapDispatchToProps)(LoginPage);