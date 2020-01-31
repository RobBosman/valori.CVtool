import React, {useEffect} from "react"
import {AppStates, requestLogout} from "../redux/ducks/AppState"
import {connect} from "react-redux";

const mapStateToProps = (state) => ({
    appState: state.appState
});

const mapDispatchToProps = (dispatch) => ({
    requestLogout: () => dispatch(requestLogout())
});

const AutoLogout = (props) => {

    useEffect(() => {
        if (props.appState === AppStates.LOGGED_IN
            && props.delayMillis > 0) {
            const timeoutID = setTimeout(props.requestLogout, props.delayMillis);
            console.log(`set logout timeout[${timeoutID}]`);

            // clean-up
            return () => {
                clearTimeout(timeoutID);
                console.log(`cleared logout timeout[${timeoutID}]`);
            }
        }
    }, []);

    return null; // render nothing
};

export default connect(mapStateToProps, mapDispatchToProps)(AutoLogout)