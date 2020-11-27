import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Dialog, DialogFooter, DefaultButton, DialogType, ContextualMenu } from "@fluentui/react";

const ErrorDialog = (props) => {

  const [showDialog, setShowDialog] = React.useState(false);

  React.useEffect(() => {
    if (props.lastError)
      setShowDialog(true);
  }, [props.lastError]);

  const dialogContentProps = {
    type: DialogType.normal,
    title: "Error",
    subText: <span>{props.lastError?.message}</span>
  };
  const modalProps = {
    isBlocking: true,
    dragOptions: {
      moveMenuItemText: "Move",
      closeMenuItemText: "Close",
      menu: ContextualMenu
    }
  };
  
  const dismissDialog = () =>
    setShowDialog(false);
  
  return (
    <Dialog
      dialogContentProps={dialogContentProps}
      modalProps={modalProps}
      hidden={!showDialog}
      onDismiss={dismissDialog}>
      <DialogFooter>
        <DefaultButton
          text="Sluiten"
          onClick={dismissDialog}
        />
      </DialogFooter>
    </Dialog>
  );
};

ErrorDialog.propTypes = {
  lastError: PropTypes.object
};

const select = (state) => ({
  lastError: state.error.lastError
});

export default connect(select)(ErrorDialog);