import React from "react"
import { LoginStates, requestLogout } from "../redux/authentication"
import { connect } from "react-redux";

const select = (state) => ({
  loginState: state.authentication.loginState
});

const mapDispatchToProps = (dispatch) => ({
  requestLogout: () => dispatch(requestLogout())
});

export default connect(select, mapDispatchToProps)(
  (props) => {
    React.useEffect(() => {
      if (props.loginState === LoginStates.LOGGED_IN && props.delayMillis > 0) {
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
  })