import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { CommandBar, CommandBarButton, getTheme, loadTheme, ContextualMenuItemType, TooltipHost } from "@fluentui/react";
import * as safeActions from "../../services/safe/safe-actions";
import * as authenticationActions from "../../services/authentication/authentication-actions";
import * as uiActions from "../../services/ui/ui-actions";
import { ConnectionStates } from "../../services/eventBus/eventBus-services";
import lightBlueTheme from "../../static/themes/lightBlue.json";
import lightGreenTheme from "../../static/themes/lightGreen.json";
import darkOrangeTheme from "../../static/themes/darkOrange.json";
import darkYellowTheme from "../../static/themes/darkYellow.json";

const CvTopBar = (props) => {
  
  const currentTheme = getTheme();

  const createThemeItem = (themeName, theme, label) => ({
    key: themeName,
    text: label,
    onMouseOver: () => loadTheme(theme),
    onMouseOut: () => loadTheme(currentTheme),
    onClick: () => props.setThemeName(themeName)
  });

  const WrappedButton = (p) => (
    <TooltipHost content={p.tooltipText}>
      <CommandBarButton {...p}/>
    </TooltipHost>
  );
  
  const isDirty = props.isConnected && props.hasSafeData
    && props.lastEditedTimestamp
    && !props.lastSavedTimestamp || props.lastEditedTimestamp > props.lastSavedTimestamp;

  const items = [
    {
      key: "connected",
      iconProps: { iconName: props.isConnected ? "PlugConnected" : "PlugDisconnected" },
      commandBarButtonAs: WrappedButton,
      style: { background: props.isConnected ? "initial" : currentTheme.semanticColors.warningBackground },
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
                createThemeItem("lightBlue", lightBlueTheme, "Licht - Blauw"),
                createThemeItem("lightGreen", lightGreenTheme, "Licht - Groen"),
                createThemeItem("darkOrange", darkOrangeTheme, "Donker - Oranje"),
                createThemeItem("darkYellow", darkYellowTheme, "Donker - Geel")
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
                  // TODO: onClick: mail-link
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

  return (
    <CommandBar
      items={items}
      farItems={farItems}
      styles={{ root: { paddingLeft: 0 } }}
    />
  );
};

CvTopBar.propTypes = {
  account: PropTypes.object,
  isConnected: PropTypes.bool.isRequired,
  hasSafeData: PropTypes.bool.isRequired,
  lastEditedTimestamp: PropTypes.object,
  lastSavedTimestamp: PropTypes.object,
  setThemeName: PropTypes.func.isRequired,
  requestToLogout: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired
};

const select = (state) => ({
  account: state.authentication.accountInfo,
  isConnected: state.eventBus.connectionState === ConnectionStates.CONNECTED,
  hasSafeData: Object.keys(state.safe.content).length > 0,
  lastEditedTimestamp: state.safe.lastEditedTimestamp,
  lastSavedTimestamp: state.safe.lastSavedTimestamp
});

const mapDispatchToProps = (dispatch) => ({
  setThemeName: (themeName) => dispatch(uiActions.setThemeName(themeName)),
  requestToLogout: () => dispatch(authenticationActions.requestLogout()),
  save: () => dispatch(safeActions.save(true))
});

export default connect(select, mapDispatchToProps)(CvTopBar);