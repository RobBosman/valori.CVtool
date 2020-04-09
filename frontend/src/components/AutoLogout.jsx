import React from "react"
import {AuthenticationStates, requestLogout} from "../redux/ducks/authentication"
import {connect} from "react-redux";

const AutoLogout = (props) => {
    React.useEffect(() => {
      if (props.loginState === AuthenticationStates.LOGGED_IN && props.delayMillis > 0) {
            const timeoutID = setTimeout(props.requestLogout, props.delayMillis);
            console.log(`set logout timeout[${timeoutID}]`);

            // clean-up
            return () => {
                clearTimeout(timeoutID);
                console.log(`cleared logout timeout[${timeoutID}]`);
            }
        }
    }, [props.loginState, props.delayMillis]);

    return null // render nothing
};

const select = (state) => ({
  loginState: state.authentication.loginState
});

const mapDispatchToProps = (dispatch) => ({
    requestLogout: () => dispatch(requestLogout())
});

export default connect(select, mapDispatchToProps)(AutoLogout)