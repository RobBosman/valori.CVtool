import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Dialog, DialogFooter, DefaultButton, DialogType, ProgressIndicator, Icon, Stack, Label } from "@fluentui/react";
import { requestLogout, LoginStates } from "../services/authentication/authentication-actions";

const LoginDialog = (props) => {

  const dialogContentProps = {
    type: DialogType.normal,
    title: "Bezig met inloggen..."
  };
  
  return (
    <Dialog
      dialogContentProps={dialogContentProps}
      hidden={!(props.isLoggingInOpenId || props.isLoggingInBackend)}>
      <Stack horizontal tokens={{ childrenGap: "l2" }}>
        <Label>Inloggen met Valori account</Label>
        <Stack.Item align="center">
          {props.isLoggingInOpenId
            ?  undefined
            :  <Icon iconName="Accept" />}
        </Stack.Item>
      </Stack>
      <Stack horizontal tokens={{ childrenGap: "l2" }}>
        <Label
          disabled={!props.isLoggingInBackend}
        >Verbinden met backend server</Label>
      </Stack>
      <ProgressIndicator />
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
  isLoggingInOpenId: state.authentication.loginState === LoginStates.LOGGING_IN_OPENID,
  isLoggingInBackend: state.authentication.loginState === LoginStates.LOGGING_IN_BACKEND
});

const mapDispatchToProps = (dispatch) => ({
  requestToLogout: () => dispatch(requestLogout())
});

export default connect(select, mapDispatchToProps)(LoginDialog);