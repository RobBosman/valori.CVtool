import React from "react"
import { connect } from "react-redux"
import { LoginStates, requestLogin, requestLogout } from "../redux/authentication"
import { CommandBar, getTheme, loadTheme } from "@fluentui/react"
import darkOrange from "../themes/darkOrange"
import lightBlue from "../themes/lightBlue"
import lightGreen from "../themes/lightGreen"
import darkYellow from "../themes/darkYellow"
import { fetchAll, saveAll } from "../redux/safe"
import { setThemeName } from "../redux/ui";
import { EventBusStates } from "../redux/eventBus";

const MenuBar = (props) => {

  const currentTheme = getTheme();

  const items = [
    props.loginState === LoginStates.LOGGED_IN && {
      key: 'fetch',
      text: 'Ophalen',
      iconProps: { iconName: 'CloudDownload' },
      iconOnly: false,
      disabled: !props.isConnected,
      onClick: props.fetch
    },
    props.loginState === LoginStates.LOGGED_IN && {
      key: 'save',
      text: 'Opslaan',
      iconProps: { iconName: 'CloudUpload' },
      iconOnly: false,
      disabled: !(props.isConnected && props.hasSafeData),
      onClick: props.save
    }
  ].filter(Boolean);

  const farItems = [
    {
      key: 'themeSelection',
      text: 'Theme',
      iconProps: { iconName: 'Brightness' },
      iconOnly: false,
      subMenuProps: {
        items: [
          {
            key: 'darkOrange',
            text: 'Donker - Oranje',
            onMouseOver: () => loadTheme(darkOrange),
            onMouseOut: () => loadTheme(currentTheme),
            onClick: () => props.setThemeName('darkOrange')
          },
          {
            key: 'darkYellow',
            text: 'Donker - Geel',
            onMouseOver: () => loadTheme(darkYellow),
            onMouseOut: () => loadTheme(currentTheme),
            onClick: () => props.setThemeName('darkYellow')
          },
          {
            key: 'lightBlue',
            text: 'Licht - Blauw',
            onMouseOver: () => loadTheme(lightBlue),
            onMouseOut: () => loadTheme(currentTheme),
            onClick: () => props.setThemeName('lightBlue')
          },
          {
            key: 'lightGreen',
            text: 'Licht - Groen',
            onMouseOver: () => loadTheme(lightGreen),
            onMouseOut: () => loadTheme(currentTheme),
            onClick: () => props.setThemeName('lightGreen')
          }
        ]
      }
    },
    (props.loginState === LoginStates.LOGGED_OUT || props.loginState === LoginStates.LOGGING_OUT) && {
      key: 'login',
      text: 'Aanmelden',
      disabled: props.authentication === LoginStates.LOGGING_OUT,
      onClick: props.requestLogin
    },
    (props.loginState === LoginStates.LOGGED_IN || props.loginState === LoginStates.LOGGING_IN) && {
      key: 'logout',
      text: 'Afmelden',
      disabled: props.loginState === LoginStates.LOGGING_IN,
      onClick: props.requestLogout
    }
  ].filter(Boolean);

  return (
    <CommandBar items={items} farItems={farItems} />
  );
};

const select = (state) => ({
  loginState: state.authentication.loginState,
  isConnected: state.eventBus === EventBusStates.CONNECTED,
  hasSafeData: Object.keys(state.safe).length > 0
});

const mapDispatchToProps = (dispatch) => ({
  setThemeName: (themeName) => dispatch(setThemeName(themeName)),
  requestLogin: () => dispatch(requestLogin()),
  requestLogout: () => dispatch(requestLogout()),
  fetch: () => dispatch(fetchAll()),
  save: () => dispatch(saveAll())
});

export default connect(select, mapDispatchToProps)(MenuBar)