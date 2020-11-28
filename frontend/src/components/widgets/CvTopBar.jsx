import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { CommandBar, CommandBarButton, getTheme, loadTheme, ContextualMenuItemType, TooltipHost } from "@fluentui/react";
import * as safeActions from "../../services/safe/safe-actions";
import * as authActions from "../../services/auth/auth-actions";
import * as uiActions from "../../services/ui/ui-actions";
import * as uiServices from "../../services/ui/ui-services";
import { ConnectionStates } from "../../services/eventBus/eventBus-services";

const CvTopBar = (props) => {
  
  const currentTheme = getTheme();

  const createThemeItem = (theme, label) => ({
    key: theme,
    text: label,
    onMouseOver: () => uiServices.loadThemeByName(theme),
    onMouseOut: () => loadTheme(currentTheme),
    onClick: () => props.setTheme(theme)
  });

  const WrappedButton = (p) => (
    <TooltipHost content={p.tooltipText}>
      <CommandBarButton {...p}/>
    </TooltipHost>
  );

  const onOpenEmail = () =>
    window.open("mailto:RobBosman@valori.nl?subject=CVtool", "blank");
  
  const isDirty = props.isConnected && props.hasSafeData
    && props.lastEditedTimestamp
    && !props.lastSavedTimestamp || props.lastEditedTimestamp > props.lastSavedTimestamp;

  const items = [
    {
      key: "connected",
      iconProps: { iconName: props.isConnected ? "PlugConnected" : "PlugDisconnected" },
      commandBarButtonAs: WrappedButton,
      style: { background: props.isConnected ? "initial" : currentTheme.semanticColors.severeWarningBackground },
      tooltipText: props.isConnected ? "Verbonden met backend" : "Geen verbinding met backend"
    },
    {
      key: "save",
      text: props.lastSavedTimestamp?.toLocaleTimeString() || "-",
      iconProps: { iconName: "CloudUpload" },
      disabled: !isDirty,
      onClick: props.save,
      commandBarButtonAs: WrappedButton,
      style: { background: isDirty ? currentTheme.semanticColors.warningBackground : "initial" },
      tooltipText: isDirty ? "Bezig met opslaan..." : "Alle wijzigingen zijn opgeslagen"
    }
  ];

  const farItems = [
    {
      key: "globalNav",
      text: props.account?.name || "",
      iconProps: { iconName: "GlobalNavButton" },
      iconOnly: false,
      subMenuProps: {
        items: [
          {
            key: "theme",
            text: "Theme",
            iconProps: { iconName: "Brightness" },
            subMenuProps: {
              items: [
                createThemeItem("default", "Standaard"),
                createThemeItem("valoriBlue", "Valori - Blauw"),
                createThemeItem("valoriOrange", "Valori - Oranje")
              ]
            }
          },
          {
            key: "help",
            text: "Help",
            iconProps: { iconName: "Help" },
            subMenuProps: {
              items: [
                {
                  key: "emailMe",
                  text: "Problemen? Mail even!",
                  iconProps: { iconName: "NewMail" },
                  onClick: onOpenEmail
                }
              ]
            }
          },
          {
            key: "loginDivider",
            itemType: ContextualMenuItemType.Divider
          },
          {
            key: "logout",
            text: "Uitloggen",
            iconProps: { iconName: "SignOut" },
            onClick: props.requestToLogout
          }
        ]
      }
    }
  ];

  const styles = {
    root: {
      paddingLeft: 0,
      borderBottomStyle: "inset",
      borderWidth: "2px"
    }
  };

  return (
    <CommandBar
      items={items}
      farItems={farItems}
      styles={styles}
    />
  );
};

CvTopBar.propTypes = {
  account: PropTypes.object,
  isConnected: PropTypes.bool.isRequired,
  hasSafeData: PropTypes.bool.isRequired,
  lastEditedTimestamp: PropTypes.object,
  lastSavedTimestamp: PropTypes.object,
  setTheme: PropTypes.func.isRequired,
  requestToLogout: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired
};

const select = (state) => ({
  account: state.auth.authInfo,
  isConnected: state.eventBus.connectionState === ConnectionStates.CONNECTED,
  hasSafeData: Object.keys(state.safe.content).length > 0,
  lastEditedTimestamp: state.safe.lastEditedTimestamp,
  lastSavedTimestamp: state.safe.lastSavedTimestamp
});

const mapDispatchToProps = (dispatch) => ({
  setTheme: (theme) => dispatch(uiActions.setTheme(theme)),
  requestToLogout: () => dispatch(authActions.requestLogout()),
  save: () => dispatch(safeActions.save(true))
});

export default connect(select, mapDispatchToProps)(CvTopBar);