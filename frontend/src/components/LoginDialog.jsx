import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Dialog, DialogFooter, DefaultButton, DialogType, Icon, Label, Spinner } from "@fluentui/react";
import { requestLogout, LoginStates } from "../services/auth/auth-actions";

const LoginDialog = (props) => {

  const dialogContentProps = {
    type: DialogType.normal,
    title: "Bezig met inloggen..."
  };
  
  return (
    <Dialog
      dialogContentProps={dialogContentProps}
      hidden={!(props.isLoggingInOpenId || props.isLoggingInBackend)}>
      <table>
        <tbody>
          <tr>
            <td>{props.isLoggingInOpenId ? <Spinner /> : <Icon iconName="Accept" />}</td>
            <td>&nbsp;</td>
            <td><Label>Inloggen met Valori account</Label></td>
          </tr>
          <tr>
            <td>{props.isLoggingInBackend ? <Spinner /> : undefined}</td>
            <td>&nbsp;</td>
            <td><Label
              disabled={!props.isLoggingInBackend}
            >Verbinden met backend server</Label></td>
          </tr>
        </tbody>
      </table>
      <DialogFooter>
        <DefaultButton
          text="Cancel"
          onClick={props.requestToLogout} />
      </DialogFooter>
    </Dialog>
  );
};

LoginDialog.propTypes = {
  isLoggingInOpenId: PropTypes.bool.isRequired,
  isLoggingInBackend: PropTypes.bool.isRequired,
  requestToLogout: PropTypes.func.isRequired
};

const select = (state) => ({
  isLoggingInOpenId: state.auth.loginState === LoginStates.LOGGING_IN_OPENID,
  isLoggingInBackend: state.auth.loginState === LoginStates.LOGGING_IN_BACKEND
});

const mapDispatchToProps = (dispatch) => ({
  requestToLogout: () => dispatch(requestLogout())
});

export default connect(select, mapDispatchToProps)(LoginDialog);