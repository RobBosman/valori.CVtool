import React from "react"
import { connect } from "react-redux"
import { LoginStates, requestLogin, requestLogout } from "../redux/authentication"
import { CommandBar, getTheme, loadTheme, ContextualMenuItemType, Stack } from "@fluentui/react"
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
      // onClick: link
    },
    {
      key: 'appPermissions',
      text: 'Apps',
      // onClick: link
    },
    {
      key: 'help',
      text: 'Help',
      subMenuProps: {
        items: [
          {
            key: 'emailMe',
            text: 'Problemen? Mail even!',
            iconProps: { iconName: 'NewMail' },
            // onClick: mail-link
          }
        ]
      }
    }
  ];

  const createThemeItem = (themeName, theme, label) => ({
    key: themeName,
    text: label,
    onMouseOver: () => loadTheme(theme),
    onMouseOut: () => loadTheme(currentTheme),
    onClick: () => props.setThemeName(themeName)
  });

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
                createThemeItem('lightBlue', lightBlue, 'Licht - Blauw'),
                createThemeItem('lightGreen', lightGreen, 'Licht - Groen'),
                createThemeItem('darkOrange', darkOrange, 'Donker - Oranje'),
                createThemeItem('darkYellow', darkYellow, 'Donker - Geel')
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