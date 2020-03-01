import React from "react"
import {AppStates, requestLogout} from "../redux/ducks/AppState"
import {connect} from "react-redux";

const AutoLogout = (props) => {
    React.useEffect(() => {
        if (props.appState === AppStates.LOGGED_IN && props.delayMillis > 0) {
            const timeoutID = setTimeout(props.requestLogout, props.delayMillis);
            console.log(`set logout timeout[${timeoutID}]`);

            // clean-up
            return () => {
                clearTimeout(timeoutID);
                console.log(`cleared logout timeout[${timeoutID}]`);
            }
        }
    }, [props.appState, props.delayMillis]);

    return null // render nothing
};

const select = (state) => ({
    appState: state.appState
});

const mapDispatchToProps = (dispatch) => ({
    requestLogout: () => dispatch(requestLogout())
});

export default connect(select, mapDispatchToProps)(AutoLogout)