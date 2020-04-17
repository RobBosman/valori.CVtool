import React from "react"
import { connect } from "react-redux"
import { LoginStates, requestLogin, requestLogout } from "../redux/authentication"
import { CommandBar, getTheme, loadTheme, ContextualMenuItemType, Stack, Link } from "@fluentui/react"
import darkOrange from "../themes/darkOrange"
import lightBlue from "../themes/lightBlue"
import lightGreen from "../themes/lightGreen"
import darkYellow from "../themes/darkYellow"
import { setThemeName } from "../redux/ui";
import { EventBusStates } from "../redux/eventBus";
import { fetchAll, saveAll } from "../redux/safe";
import valoriNameImg from '../static/valori-name.png'

const TopBar = (props) => {

  const currentTheme = getTheme();

  const items = [
    {
      key: 'cvDatabank',
      text: 'CV Databank',
      // onClick: props.fetch
    },
    {
      key: 'appPermissions',
      text: 'Apps',
      // onClick: props.save
    },
    {
      key: 'support',
      text: 'Support',
      // onClick: props.save
    }
  ];

  const farItems = [
    props.loginState === LoginStates.LOGGED_OUT && {
      key: 'login',
      text: 'Aanmelden',
      iconProps: { iconName: 'Signin' },
      onClick: props.requestLogin
    },
    props.loginState !== LoginStates.LOGGED_OUT && {
      key: 'globalNav',
      text: props.account && props.account.name || '',
      iconProps: { iconName: 'GlobalNavButton' },
      iconOnly: false,
      disabled: props.loginState !== LoginStates.LOGGED_IN,
      subMenuProps: {
        items: [
          {
            key: 'theme',
            text: 'Theme',
            iconProps: { iconName: 'Brightness' },
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
          {
            key: 'fetchAll',
            text: 'Ophalen',
            iconProps: { iconName: 'CloudDownload' },
            disabled: !props.isConnected,
            onClick: props.fetchAll
          },
          {
            key: 'saveAll',
            text: 'Opslaan',
            iconProps: { iconName: 'CloudUpload' },
            disabled: !(props.isConnected && props.hasSafeData),
            onClick: props.saveAll
          },
          {
            key: 'loginDivider',
            itemType: ContextualMenuItemType.Divider
          },
          {
            key: 'logout',
            text: 'Afmelden',
            iconProps: { iconName: 'SignOut' },
            onClick: props.requestLogout
          }
        ].filter(Boolean)
      }
    }
  ].filter(Boolean);

  return (
    <Stack horizontal verticalAlign="center">
      <img src={valoriNameImg} alt="Valori" height="20em" />
      <Stack.Item grow>
        <CommandBar items={items} farItems={farItems} />
      </Stack.Item>
    </Stack>
  );
};

const select = (state) => ({
  account: state.authentication.account,
  loginState: state.authentication.loginState,
  isConnected: state.eventBus === EventBusStates.CONNECTED,
  hasSafeData: Object.keys(state.safe).length > 0
});

const mapDispatchToProps = (dispatch) => ({
  setThemeName: (themeName) => dispatch(setThemeName(themeName)),
  requestLogin: () => dispatch(requestLogin()),
  requestLogout: () => dispatch(requestLogout()),
  fetchAll: () => dispatch(fetchAll()),
  saveAll: () => dispatch(saveAll())
});

export default connect(select, mapDispatchToProps)(TopBar)