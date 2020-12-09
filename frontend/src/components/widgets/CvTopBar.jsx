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

  const TooltipButton = (p) => (
    <TooltipHost content={p.tooltipText}>
      <CommandBarButton {...p}/>
    </TooltipHost>
  );

  const selectLocale = (_event, item) =>
    props.setLocale(item?.key);

  const onOpenEmail = () =>
    window.open("mailto:RobBosman@valori.nl?subject=CVtool", "blank");

  const [state, setState] = React.useState({});
  React.useLayoutEffect(() => {
    const isDirty = props.isConnected && props.hasSafeData
        && props.lastEditedTimestamp
        && !props.lastSavedTimestamp || props.lastEditedTimestamp > props.lastSavedTimestamp;
    setState({
      items: [
        {
          key: "connected",
          iconProps: { iconName: props.isConnected ? "PlugConnected" : "PlugDisconnected" },
          commandBarButtonAs: TooltipButton,
          style: { background: props.isConnected ? "initial" : currentTheme.semanticColors.severeWarningBackground },
          tooltipText: props.isConnected ? "Verbonden met backend" : "Geen verbinding met backend"
        },
        {
          key: "save",
          text: props.lastSavedTimestamp?.toLocaleTimeString() || "-",
          iconProps: { iconName: "CloudUpload" },
          disabled: !isDirty,
          onClick: props.save,
          commandBarButtonAs: TooltipButton,
          style: { background: isDirty ? currentTheme.semanticColors.warningBackground : "initial" },
          tooltipText: isDirty ? "Bezig met opslaan..." : "Alle wijzigingen zijn opgeslagen"
        }
      ],
      farItems: [
        {
          key: "locale",
          text: props.locale === "uk_UK" ? "Engels" : "Nederlands",
          iconProps: { iconName: "LocaleLanguage" },
          subMenuProps: {
            items: [
              {
                key: "nl_NL",
                text: "Nederlands",
                onClick: selectLocale
              },
              {
                key: "uk_UK",
                text: "Engels",
                onClick: selectLocale
              }
            ]
          }
        },
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
      ]
    });
  }, [props.isConnected, props.hasSafeData, props.account, props.locale, props.lastEditedTimestamp, props.lastSavedTimestamp, currentTheme]);

  const styles = {
    root: {
      paddingLeft: 0,
      borderBottomStyle: "inset",
      borderWidth: "2px"
    }
  };

  return (
    <CommandBar
      items={state.items}
      farItems={state.farItems}
      styles={styles}
    />
  );
};

CvTopBar.propTypes = {
  locale: PropTypes.string.isRequired,
  account: PropTypes.object,
  isConnected: PropTypes.bool.isRequired,
  hasSafeData: PropTypes.bool.isRequired,
  lastEditedTimestamp: PropTypes.object,
  lastSavedTimestamp: PropTypes.object,
  setLocale: PropTypes.func.isRequired,
  setTheme: PropTypes.func.isRequired,
  requestToLogout: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired
};

const select = (store) => ({
  locale: store.ui.userPrefs.locale,
  account: store.auth.authInfo,
  isConnected: store.eventBus.connectionState === ConnectionStates.CONNECTED,
  hasSafeData: Object.keys(store.safe.content).length > 0,
  lastEditedTimestamp: store.safe.lastEditedTimestamp,
  lastSavedTimestamp: store.safe.lastSavedTimestamp
});

const mapDispatchToProps = (dispatch) => ({
  setLocale: (locale) => dispatch(uiActions.setLocale(locale)),
  setTheme: (theme) => dispatch(uiActions.setTheme(theme)),
  requestToLogout: () => dispatch(authActions.requestLogout()),
  save: () => dispatch(safeActions.save(true))
});

export default connect(select, mapDispatchToProps)(CvTopBar);