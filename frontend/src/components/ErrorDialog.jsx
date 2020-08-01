import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Dialog, DialogFooter, DefaultButton, DialogType } from "@fluentui/react";

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
  
  return (
    <Dialog
      dialogContentProps={dialogContentProps}
      hidden={!showDialog}>
      <DialogFooter>
        <DefaultButton
          text="Close"
          onClick={() => setShowDialog(false)} />
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