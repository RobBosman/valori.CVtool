import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Dialog, DialogFooter, DefaultButton, DialogType, ContextualMenu } from "@fluentui/react";
import * as uiServices from "../services/ui/ui-services";

const ErrorDialog = (props) => {

  const {semanticColors} = uiServices.useTheme();

  const [showDialog, setShowDialog] = React.useState(false);

  React.useLayoutEffect(() => {
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
    },
    styles: {
      main: {
        borderTopWidth: 5,
        borderTopStyle: "solid",
        borderColor: semanticColors.severeWarningIcon
      }
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