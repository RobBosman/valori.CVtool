import PropTypes from "prop-types";
import React from "react";
import { Dialog, DialogFooter, DefaultButton, DialogType, ContextualMenu, PrimaryButton } from "@fluentui/react";

const ConfirmDialog = (props) => {

  const dialogContentProps = {
    type: DialogType.normal,
    title: props.title
  };
  const modalProps = {
    isBlocking: true,
    dragOptions: {
      moveMenuItemText: "Move",
      closeMenuItemText: "Close",
      menu: ContextualMenu
    }
  };

  return (
    <Dialog
      dialogContentProps={dialogContentProps}
      modalProps={modalProps}
      hidden={!props.isVisible}
      onDismiss={props.onCancel}>
      {props.itemFields}
      <DialogFooter>
        <PrimaryButton
          text="Verwijderen"
          onClick={props.onProceed}
        />
        <DefaultButton
          text="Annuleren"
          onClick={props.onCancel}
        />
      </DialogFooter>
    </Dialog>
  );
};

ConfirmDialog.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  itemFields: PropTypes.object,
  onProceed: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default ConfirmDialog;