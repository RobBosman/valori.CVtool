import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { CommandBar, CommandBarButton, getTheme, loadTheme, ContextualMenuItemType, Stack, TooltipHost } from "@fluentui/react";
import * as safeActions from "../../services/safe/safe-actions";
import * as authenticationActions from "../../services/authentication/authentication-actions";
import * as uiActions from "../../services/ui/ui-actions";
import { ConnectionStates } from "../../services/eventBus/eventBus-services";
import valoriNameImg from "../../static/valori-name.png";
import darkOrange from "../../themes/darkOrange";
import lightBlue from "../../themes/lightBlue";
import lightGreen from "../../themes/lightGreen";
import darkYellow from "../../themes/darkYellow";

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

  const items = props.loginState === authenticationActions.LoginStates.LOGGED_IN
    ? [
      {
        key: "save",
        text: props.lastSavedTimestamp?.toLocaleTimeString() || "???",
        iconProps: { iconName: "CloudUpload" },
        disabled: !isDirty,
        onClick: props.saveContent,
        commandBarButtonAs: WrappedButton,
        style: { background: isDirty ? currentTheme.semanticColors.warningBackground : "initial" },
        tooltipText: isDirty ? "Bezig met opslaan..." : "Alle wijzigingen zijn opgeslagen"
      },
      {
        key: "download",
        text: "Download",
        iconProps: { iconName: "DownloadDocument" },
        // TODO: onClick: download
        commandBarButtonAs: WrappedButton,
        tooltipText: "Download CV als MS-Word document"
      }
    ]
    : [];

  const farItems = [
    props.loginState === authenticationActions.LoginStates.LOGGED_OUT && {
      key: "login",
      text: "Aanmelden",
      iconProps: { iconName: "Signin" },
      onClick: props.requestToLogin
    },
    props.loginState !== authenticationActions.LoginStates.LOGGED_OUT && {
      key: "globalNav",
      text: props.account?.name || "",
      iconProps: { iconName: "GlobalNavButton" },
      iconOnly: false,
      disabled: props.loginState !== authenticationActions.LoginStates.LOGGED_IN,
      subMenuProps: {
        items: [
          {
            key: "fetchCv",
            text: "Ophalen",
            iconProps: { iconName: "CloudDownload" },
            disabled: !props.isConnected,
            onClick: () => props.fetchCv(props.account._id)
          },
          {
            key: "saveContent",
            text: "Opslaan",
            iconProps: { iconName: "CloudUpload" },
            disabled: !(props.isConnected && props.hasSafeData),
            onClick: props.saveContent
          },
          {
            key: "theme",
            text: "Theme",
            iconProps: { iconName: "Brightness" },
            subMenuProps: {
              items: [
                createThemeItem("lightBlue", lightBlue, "Licht - Blauw"),
                createThemeItem("lightGreen", lightGreen, "Licht - Groen"),
                createThemeItem("darkOrange", darkOrange, "Donker - Oranje"),
                createThemeItem("darkYellow", darkYellow, "Donker - Geel")
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
            text: "Afmelden",
            iconProps: { iconName: "SignOut" },
            onClick: props.requestToLogout
          }
        ].filter(Boolean)
      }
    }
  ].filter(Boolean);

  return (
    <Stack horizontal
      verticalAlign="center"
      tokens={{ childrenGap: 90}}>
      <img src={valoriNameImg} alt="Valori" height="20em" />
      <Stack.Item grow>
        <CommandBar
          items={items}
          farItems={farItems}
        />
      </Stack.Item>
    </Stack>
  );
};

CvTopBar.propTypes = {
  account: PropTypes.object,
  loginState: PropTypes.string.isRequired,
  isConnected: PropTypes.bool.isRequired,
  hasSafeData: PropTypes.bool.isRequired,
  lastEditedTimestamp: PropTypes.object,
  lastSavedTimestamp: PropTypes.object,
  setThemeName: PropTypes.func.isRequired,
  requestToLogin: PropTypes.func.isRequired,
  requestToLogout: PropTypes.func.isRequired,
  fetchCv: PropTypes.func.isRequired,
  saveContent: PropTypes.func.isRequired
};

const select = (state) => ({
  account: state.authentication.accountInfo,
  loginState: state.authentication.loginState,
  isConnected: state.eventBus.connectionState === ConnectionStates.CONNECTED,
  hasSafeData: Object.keys(state.safe.content).length > 0,
  lastEditedTimestamp: state.safe.lastEditedTimestamp,
  lastSavedTimestamp: state.safe.lastSavedTimestamp
});

const mapDispatchToProps = (dispatch) => ({
  setThemeName: (themeName) => dispatch(uiActions.setThemeName(themeName)),
  requestToLogin: () => dispatch(authenticationActions.requestLogin()),
  requestToLogout: () => dispatch(authenticationActions.requestLogout()),
  fetchCv: (accountId) => dispatch(safeActions.fetchCvByAccountId(accountId)),
  saveContent: () => dispatch(safeActions.saveContent())
});

export default connect(select, mapDispatchToProps)(CvTopBar);