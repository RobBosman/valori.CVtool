import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Dialog, DialogFooter, DefaultButton } from "@fluentui/react";
import { LoginStates, requestLogin } from "../services/authentication/authentication-actions";

const LoginDialog = (props) => {
  
  return (
    <Dialog
      title="Bezig met inloggen"
      subText={<span>Dit duurt langer dan verwacht.<br/>Klik <strong>Cancel</strong> om af te breken.</span>}
      hidden={props.loginState !== LoginStates.LOGGING_IN}>
      <DialogFooter>
        <DefaultButton
          text="Cancel"
          onClick={props.requestToLogout} />
      </DialogFooter>
    </Dialog>
  );
};

LoginDialog.propTypes = {
  loginState: PropTypes.string.isRequired,
  requestToLogout: PropTypes.func.isRequired
};

const select = (state) => ({
  loginState: state.authentication.loginState
});

const mapDispatchToProps = (dispatch) => ({
  requestToLogout: () => dispatch(requestLogin(false))
});

export default connect(select, mapDispatchToProps)(LoginDialog);