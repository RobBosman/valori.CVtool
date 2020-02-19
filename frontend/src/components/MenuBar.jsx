import React from "react"
import {connect} from "react-redux"
import {AppStates, requestLogin, requestLogout} from "../redux/ducks/AppState"
import {CommandBar, getTheme, loadTheme} from "office-ui-fabric-react"
import {DarkOrange} from "../themes/dark-orange"
import {LightBlue} from "../themes/light-blue"
import {LightGreen} from "../themes/light-green"
import {DarkYellow} from "../themes/dark-yellow"

const MenuBar = (props) => {
    const [theme, setTheme] = React.useState(getTheme());

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
                        onMenuClick: () => setTheme(DarkOrange)
                    },
                    {
                        key: 'darkYellowTheme',
                        text: 'Donker - Geel',
                        onMouseOver: () => loadTheme(DarkYellow),
                        onMouseOut: () => loadTheme(theme),
                        onMenuClick: () => setTheme(DarkYellow)
                    },
                    {
                        key: 'lightBlueTheme',
                        text: 'Licht - Blauw',
                        onMouseOver: () => loadTheme(LightBlue),
                        onMouseOut: () => loadTheme(theme),
                        onMenuClick: () => setTheme(LightBlue)
                    },
                    {
                        key: 'lightGreenTheme',
                        text: 'Licht - Groen',
                        onMouseOver: () => loadTheme(LightGreen),
                        onMouseOut: () => loadTheme(theme),
                        onMenuClick: () => setTheme(LightGreen)
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

    // return (
    //     <Customizer settings={{theme: getNeutralVariant(theme)}}>
    //         <CommandBar farItems={farItems}/>
    //     </Customizer>
    // );

    return (
        <CommandBar farItems={farItems}/>
    );
};

const mapStateToProps = (state) => ({
    appState: state.appState
});

const mapDispatchToProps = (dispatch) => ({
    requestLogin: () => dispatch(requestLogin()),
    requestLogout: () => dispatch(requestLogout())
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar)