import React from "react"
import {connect} from "react-redux"
import ErrorPage from "./ErrorPage"
import LoginPage from "./LoginPage"
import AdminPage from "./AdminPage"
import {AppStates} from "../redux/ducks/AppState"
import {CommandBar, initializeIcons, loadTheme, Text} from "office-ui-fabric-react"
import {ValoriDark, ValoriLight} from "../themes/valori-themes"

initializeIcons();

const defaultTheme = ValoriLight;
const applyTheme = (theme) => {
    loadTheme(theme);
    document.documentElement.style.background = theme.palette.white;
};
applyTheme(defaultTheme);

const Main = (props) => {
    const [theme, setTheme] = React.useState(defaultTheme);

    const farItems = [
        {
            key: 'themeSelection',
            text: 'Thema',
            iconProps: {iconName: 'Brightness'},
            iconOnly: false,
            subMenuProps: {
                items: [
                    {
                        key: 'darkTheme',
                        text: 'Donker',
                        onMouseOver: () => applyTheme(ValoriDark),
                        onMouseOut: () => applyTheme(theme),
                        onMenuClick: () => setTheme(ValoriDark)
                    },
                    {
                        key: 'lightTheme',
                        text: 'Licht',
                        onMouseOver: () => applyTheme(ValoriLight),
                        onMouseOut: () => applyTheme(theme),
                        onMenuClick: () => setTheme(ValoriLight)
                    }
                ]
            }
        }
    ];

    const renderChildren = (props) => {
        switch (props.appState) {
            case AppStates.LOGGED_OUT:
                return (
                    <LoginPage/>
                );
            case AppStates.LOGGING_IN:
                return (
                    <Text>logging in...</Text>
                );
            case AppStates.LOGGED_IN:
                return (
                    <div>
                        <AdminPage/>
                        {/* TODO
                        <AutoLogout delayMillis="10000"/>
                        */}
                    </div>
                );
            case AppStates.LOGGING_OUT:
                return (
                    <Text>logging out...</Text>
                );
            default:
                return (
                    <ErrorPage/>
                );
        }
    };

    return (
        <div>
            <CommandBar farItems={farItems}/>
            {renderChildren(props)}
        </div>
    );
};

const mapStateToProps = (state) => ({
    appState: state.appState
});

export default connect(mapStateToProps)(Main)