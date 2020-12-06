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

  const renderField = (key, label, value) =>
    <tr key={key}>
      <td><strong>{label || ""}</strong></td><td>&nbsp;</td><td>{value || ""}</td>
    </tr>;

  return (
    <Dialog
      dialogContentProps={dialogContentProps}
      modalProps={modalProps}
      hidden={!props.isVisible}
      onDismiss={props.onCancel}>
      <table>
        <tbody>
          {props.selectedItemFields && props.selectedItemFields() && Object.entries(props.selectedItemFields())
            .map(([label, value], index) => renderField(index, label, value))
          }
        </tbody>
      </table>
      <DialogFooter>
        <PrimaryButton
          text={props.primaryButtonText}
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
  title: PropTypes.string.isRequired,
  primaryButtonText: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  selectedItemFields: PropTypes.func,
  onProceed: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default ConfirmDialog;