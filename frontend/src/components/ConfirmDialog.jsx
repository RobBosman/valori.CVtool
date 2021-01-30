import PropTypes from "prop-types";
import React from "react";
import { Dialog, DialogFooter, DefaultButton, DialogType, ContextualMenu, PrimaryButton } from "@fluentui/react";
import * as uiServives from "../services/ui/ui-services";

const ConfirmDialog = (props) => {

  const {semanticColors} = uiServives.useTheme();

  const dialogContentProps = {
    type: DialogType.normal,
    title: props.title
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
      ...props.styles,
      main: {
        ...props.styles?.main,
        borderTopWidth: 5,
        borderTopStyle: "solid",
        borderColor: semanticColors.primaryButtonBackground
      }
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
          {Object.entries(props.selectedItemFields && props.selectedItemFields() || {})
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
  onCancel: PropTypes.func.isRequired,
  styles: PropTypes.object
};

export default ConfirmDialog;