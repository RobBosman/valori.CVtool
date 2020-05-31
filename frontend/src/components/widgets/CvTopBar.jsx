import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { fetchAll, saveAll } from "../../services/safe/safe-actions";
import { CommandBar, getTheme, loadTheme, ContextualMenuItemType, Stack } from "@fluentui/react";
import { LoginStates, requestLogin, requestLogout } from "../../services/authentication/authentication-actions";
import { setThemeName } from "../../services/ui/ui-actions";
import { EventBusConnectionStates } from "../../services/eventBus/eventBus-actions";
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
      // onClick: link
    },
    {
      key: "appPermissions",
      text: "Apps",
      // onClick: link
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
            // onClick: mail-link
          }
        ]
      }
    }
  ];
  const farItems = [
    props.loginState === LoginStates.LOGGED_OUT && {
      key: "login",
      text: "Aanmelden",
      iconProps: { iconName: "Signin" },
      onClick: props.requestLogin
    },
    props.loginState !== LoginStates.LOGGED_OUT && {
      key: "globalNav",
      text: props.account && props.account.name || "",
      iconProps: { iconName: "GlobalNavButton" },
      iconOnly: false,
      disabled: props.loginState !== LoginStates.LOGGED_IN,
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
            key: "fetchAll",
            text: "Ophalen",
            iconProps: { iconName: "CloudDownload" },
            disabled: !props.isConnected,
            onClick: props.fetchAll
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
            onClick: props.requestLogout
          }
        ].filter(Boolean)
      }
    }
  ].filter(Boolean);

  return (
    <Stack horizontal
      verticalAlign="center"
      tokens={{ childrenGap: 50 }}>
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
  setThemeName: PropTypes.func.isRequired,
  requestLogin: PropTypes.func.isRequired,
  requestLogout: PropTypes.func.isRequired,
  fetchAll: PropTypes.func.isRequired,
  saveAll: PropTypes.func.isRequired
};

const select = (state) => ({
  account: state.authentication.account,
  loginState: state.authentication.loginState,
  isConnected: state.eventBus.connectionState === EventBusConnectionStates.CONNECTED,
  hasSafeData: Object.keys(state.safe).length > 0
});

const mapDispatchToProps = (dispatch) => ({
  setThemeName: (themeName) => dispatch(setThemeName(themeName)),
  requestLogin: () => dispatch(requestLogin()),
  requestLogout: () => dispatch(requestLogout()),
  fetchAll: () => dispatch(fetchAll()),
  saveAll: () => dispatch(saveAll())
});

export default connect(select, mapDispatchToProps)(CvTopBar);