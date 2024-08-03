import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Dialog, DialogFooter, DefaultButton, DialogType, Icon, Label, Spinner, SpinnerSize, ContextualMenu } from "@fluentui/react";
import * as authActions from "../services/auth/auth-actions";
import * as uiServives from "../services/ui/ui-services";

const LoginDialog = (props) => {

  const {semanticColors} = uiServives.useTheme();

  const dialogContentProps = {
    type: DialogType.normal,
    title: "Bezig met inloggen..."
  };
  const modalProps = {
    isBlocking: true,
    dragOptions: {
      moveMenuItemText: "Move",
      closeMenuItemText: "Close",
      menu: ContextualMenu,
      keepInBounds: true
    },
    styles: {
      main: {
        borderTopWidth: 5,
        borderTopStyle: "solid",
        borderColor: semanticColors.primaryButtonBackground
      },
      heading: {
        backgroundColor: "red"
      }
    }
  };
  
  return (
    <Dialog
      dialogContentProps={dialogContentProps}
      modalProps={modalProps}
      hidden={!(props.isLoggingInOpenId || props.isLoggingInBackend)}
      onDismiss={props.requestToLogout}>
      <table>
        <tbody>
          <tr>
            <th>{props.isLoggingInOpenId ? <Spinner size={SpinnerSize.small} /> : <Icon iconName="Accept" />}</th>
            <td>&nbsp;</td>
            <td><Label>Inloggen met je Valori account</Label></td>
          </tr>
          <tr>
            <th>{props.isLoggingInBackend ? <Spinner size={SpinnerSize.small} /> : undefined}</th>
            <td>&nbsp;</td>
            <td><Label
              disabled={!props.isLoggingInBackend}
            >Verbinden met de backend server</Label></td>
          </tr>
        </tbody>
      </table>
      <DialogFooter>
        <DefaultButton
          text="Annuleren"
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
  isLoggingInOpenId: state.auth.loginState === authActions.LoginStates.LOGGING_IN_OPENID,
  isLoggingInBackend: state.auth.loginState === authActions.LoginStates.LOGGING_IN_BACKEND
});

const mapDispatchToProps = (dispatch) => ({
  requestToLogout: () => dispatch(authActions.requestLogout())
});

export default connect(select, mapDispatchToProps)(LoginDialog);