import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { CommandBar, getTheme, loadTheme, ContextualMenuItemType, Stack, Toggle } from "@fluentui/react";
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

  const items = [
    {
      key: "cvDatabank",
      text: "CV Databank",
      // TODO: onClick: link
    },
    {
      key: "download",
      text: "Download",
      disabled: props.loginState !== authenticationActions.LoginStates.LOGGED_IN,
      // TODO: onClick: download
    },
    {
      key: "help",
      text: "Help",
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
    }
  ];

  const autoSaveToggle = <Toggle
    label="AutoSave" inlineLabel
    onText="on" offText="off"
    defaultChecked={props.autoSaveEnabled}
    onChange={(_, checked) => props.setAutoSaveEnabled(checked)}
    styles={{
      root: [
        {
          margin: "auto"
        }
      ]
    }} />;
  const farItems = [
    props.loginState === authenticationActions.LoginStates.LOGGED_IN && {
      key: "toggleAutoSave",
      onRender: () => autoSaveToggle
    },
    props.loginState === authenticationActions.LoginStates.LOGGED_IN && {
      key: "save",
      text: "Opslaan",
      iconProps: { iconName: "CloudUpload" },
      disabled: !(props.isConnected && props.hasSafeData),
      onClick: props.saveAll
    },

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
            key: "fetchCv",
            text: "Ophalen",
            iconProps: { iconName: "CloudDownload" },
            disabled: !props.isConnected,
            onClick: () => props.fetchCv(props.account._id)
          },
          {
            key: "saveAll",
            text: "Opslaan",
            iconProps: { iconName: "CloudUpload" },
            disabled: !(props.isConnected && props.hasSafeData),
            onClick: props.saveAll
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
          farItems={farItems} />
      </Stack.Item>
    </Stack>
  );
};

CvTopBar.propTypes = {
  account: PropTypes.object,
  loginState: PropTypes.string.isRequired,
  isConnected: PropTypes.bool.isRequired,
  hasSafeData: PropTypes.bool.isRequired,
  autoSaveEnabled: PropTypes.bool.isRequired,
  setAutoSaveEnabled: PropTypes.func.isRequired,
  setThemeName: PropTypes.func.isRequired,
  requestToLogin: PropTypes.func.isRequired,
  requestToLogout: PropTypes.func.isRequired,
  fetchCv: PropTypes.func.isRequired,
  saveAll: PropTypes.func.isRequired
};

const select = (state) => ({
  account: state.authentication.accountInfo,
  loginState: state.authentication.loginState,
  isConnected: state.eventBus.connectionState === ConnectionStates.CONNECTED,
  hasSafeData: Object.keys(state.safe).length > 0,
  autoSaveEnabled: state.ui.autoSaveEnabled,
});

const mapDispatchToProps = (dispatch) => ({
  setAutoSaveEnabled: (autoSaveEnabled) => {
    if (autoSaveEnabled) {
      dispatch(safeActions.saveAll());
    }
    dispatch(uiActions.setAutoSaveEnabled(autoSaveEnabled));
  },
  setThemeName: (themeName) => dispatch(uiActions.setThemeName(themeName)),
  requestToLogin: () => dispatch(authenticationActions.requestLogin()),
  requestToLogout: () => dispatch(authenticationActions.requestLogout()),
  fetchCv: (accountId) => dispatch(safeActions.fetchCvByAccountId(accountId)),
  saveAll: () => dispatch(safeActions.saveAll())
});

export default connect(select, mapDispatchToProps)(CvTopBar);