import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Dialog, DialogFooter, DefaultButton, DialogType } from "@fluentui/react";
import { requestLogin } from "../services/authentication/authentication-actions";

const LoginDialog = (props) => {

  const [allowCancel, setAllowCancel] = React.useState(false);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => setAllowCancel(true), 3000);
    return () => clearTimeout(timeoutId);
  }, []);

  const dialogContentProps = {
    type: DialogType.normal,
    title: "Bezig met inloggen...",
    subText: allowCancel
      ? <span>Dit duurt langer dan verwacht.<br/>Klik <strong>Cancel</strong> om af te breken.</span>
      : undefined
  };
  
  return (
    <Dialog
      dialogContentProps={dialogContentProps}
      hidden={false}>
      {allowCancel ?
        <DialogFooter>
          <DefaultButton
            text="Cancel"
            onClick={props.requestToLogout} />
        </DialogFooter>
        : undefined}
    </Dialog>
  );
};

LoginDialog.propTypes = {
  requestToLogout: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => ({
  requestToLogout: () => dispatch(requestLogin(false))
});

export default connect(null, mapDispatchToProps)(LoginDialog);