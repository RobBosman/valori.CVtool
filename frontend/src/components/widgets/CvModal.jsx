import PropTypes from "prop-types";
import React from "react";
import { ContextualMenu, Text, mergeStyleSets, IconButton, FontWeights, Modal } from "@fluentui/react";
import { useTheme } from "../../services/ui/ui-services";

const CvModal = (props) => {

  const { theme } = useTheme();

  const dragOptions = {
    moveMenuItemText: "Move",
    closeMenuItemText: "Close",
    menu: ContextualMenu
  };
  const contentStyles = mergeStyleSets({
    container: {
      display: "flex",
      flexFlow: "column nowrap",
      alignItems: "stretch"
    },
    header: {
      flex: "1 1 auto",
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      background: theme.palette.themeLight,
      color: theme.palette.neutralPrimary,
      display: "flex",
      alignItems: "center",
      fontWeight: FontWeights.semibold,
      padding: "12px 12px 14px 24px"
    },
    body: {
      flex: "4 4 auto",
      padding: "0 24px 24px 24px",
      overflowY: "hidden",
      selectors: {
        p: { margin: "14px 0" },
        "p:first-child": { marginTop: 0 },
        "p:last-child": { marginBottom: 0 }
      }
    }
  });
  const iconButtonStyles = {
    root: {
      color: theme.palette.neutralPrimary,
      marginLeft: "auto",
      marginTop: "4px",
      marginRight: "2px"
    },
    rootHovered: {
      color: theme.palette.neutralDark
    }
  };

  return (
    <Modal
      isOpen={props.isOpen}
      isModeless={props.isModeless}
      dragOptions={dragOptions}
      containerClassName={contentStyles.container}>
      <div className={contentStyles.header}>
        <Text variant="xxLarge">{props.title}</Text>
        <IconButton
          styles={iconButtonStyles}
          iconProps={{ iconName: "Cancel" }}
          onClick={() => props.dismiss()}
        />
      </div>
      <div className={contentStyles.body}>
        {props.children}
      </div>
    </Modal>
  );
};

CvModal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  dismiss: PropTypes.func.isRequired,
  isModeless: PropTypes.bool
};

CvModal.defaultProps = {
  isModeless: true
};

export default CvModal;