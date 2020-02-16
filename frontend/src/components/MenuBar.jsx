import React from "react"
import {connect} from "react-redux"
import {requestLogin, requestLogout} from "../redux/ducks/AppState"
import {CommandBar, loadTheme} from "office-ui-fabric-react"
import {DarkOrange} from "../themes/dark-orange";
import {LightBlue} from "../themes/light-blue";
import {LightGreen} from "../themes/light-green";
import {DarkYellow} from "../themes/dark-yellow";

const defaultTheme = LightBlue;
const applyTheme = (theme) => {
    loadTheme(theme);
    document.documentElement.style.background = theme.palette.white;
};
applyTheme(defaultTheme);

const MenuBar = (props) => {
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
                        key: 'darkOrangeTheme',
                        text: 'Donker - Oranje',
                        onMouseOver: () => applyTheme(DarkOrange),
                        onMouseOut: () => applyTheme(theme),
                        onMenuClick: () => setTheme(DarkOrange)
                    },
                    {
                        key: 'darkYellowTheme',
                        text: 'Donker - Geel',
                        onMouseOver: () => applyTheme(DarkYellow),
                        onMouseOut: () => applyTheme(theme),
                        onMenuClick: () => setTheme(DarkYellow)
                    },
                    {
                        key: 'lightBlueTheme',
                        text: 'Licht - Blauw',
                        onMouseOver: () => applyTheme(LightBlue),
                        onMouseOut: () => applyTheme(theme),
                        onMenuClick: () => setTheme(LightBlue)
                    },
                    {
                        key: 'lightGreenTheme',
                        text: 'Licht - Groen',
                        onMouseOver: () => applyTheme(LightGreen),
                        onMouseOut: () => applyTheme(theme),
                        onMenuClick: () => setTheme(LightGreen)
                    }
                ]
            }
        },
        {
            key: 'login',
            text: 'Aanmelden',
            onClick: props.requestLogin
        },
        {
            key: 'logout',
            text: 'Afmelden',
            onClick: props.requestLogout
        }
    ];

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