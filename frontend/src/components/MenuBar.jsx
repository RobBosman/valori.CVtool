import React from "react"
import {connect} from "react-redux"
import {AppStates, requestLogin, requestLogout} from "../redux/ducks/AppState"
import {CommandBar, getTheme, loadTheme} from "office-ui-fabric-react"
import {DarkOrange} from "../themes/dark-orange"
import {LightBlue} from "../themes/light-blue"
import {LightGreen} from "../themes/light-green"
import {DarkYellow} from "../themes/dark-yellow"
import {fetch, save} from "../redux/ducks/Safe"

const MenuBar = (props) => {
    const [theme, setTheme] = React.useState(getTheme());

    const items = [
        props.appState === AppStates.LOGGED_IN && {
            key: 'fetch',
            text: 'Ophalen',
            iconProps: {iconName: 'DownloadDocument'},
            iconOnly: false,
            onClick: props.fetch
        },
        props.appState === AppStates.LOGGED_IN && {
            key: 'save',
            text: 'Opslaan',
            iconProps: {iconName: 'Save'},
            iconOnly: false,
            onClick: props.save
        }
    ].filter(Boolean);

    const farItems = [
        {
            key: 'themeSelection',
            text: 'Theme',
            iconProps: {iconName: 'Brightness'},
            iconOnly: false,
            subMenuProps: {
                items: [
                    {
                        key: 'darkOrangeTheme',
                        text: 'Donker - Oranje',
                        onMouseOver: () => loadTheme(DarkOrange),
                        onMouseOut: () => loadTheme(theme),
                        onClick: () => setTheme(DarkOrange)
                    },
                    {
                        key: 'darkYellowTheme',
                        text: 'Donker - Geel',
                        onMouseOver: () => loadTheme(DarkYellow),
                        onMouseOut: () => loadTheme(theme),
                        onClick: () => setTheme(DarkYellow)
                    },
                    {
                        key: 'lightBlueTheme',
                        text: 'Licht - Blauw',
                        onMouseOver: () => loadTheme(LightBlue),
                        onMouseOut: () => loadTheme(theme),
                        onClick: () => setTheme(LightBlue)
                    },
                    {
                        key: 'lightGreenTheme',
                        text: 'Licht - Groen',
                        onMouseOver: () => loadTheme(LightGreen),
                        onMouseOut: () => loadTheme(theme),
                        onClick: () => setTheme(LightGreen)
                    }
                ]
            }
        },
        (props.appState === AppStates.LOGGED_OUT || props.appState === AppStates.LOGGING_IN) && {
            key: 'login',
            text: 'Aanmelden',
            onClick: props.requestLogin,
            disabled: props.appState !== AppStates.LOGGED_OUT
        },
        (props.appState === AppStates.LOGGED_IN || props.appState === AppStates.LOGGING_OUT) && {
            key: 'logout',
            text: 'Afmelden',
            onClick: props.requestLogout,
            disabled: props.appState !== AppStates.LOGGED_IN
        }
    ].filter(Boolean);

    return (
        <CommandBar items={items} farItems={farItems}/>
    );
};

const select = (state) => ({
    appState: state.appState
});

const mapDispatchToProps = (dispatch) => ({
    requestLogin: () => dispatch(requestLogin()),
    requestLogout: () => dispatch(requestLogout()),
    fetch: () => dispatch(fetch()),
    save: () => dispatch(save())
});

export default connect(select, mapDispatchToProps)(MenuBar)