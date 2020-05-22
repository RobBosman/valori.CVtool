import React from "react"
import { connect } from "react-redux"
import { LoginStates } from "../services/authentication/authentication-actions"
import { EventBusConnectionStates, updateEventBusConnectionState } from "../services/eventBus/eventBus-actions"
import { eventBusClient } from "../services/eventBus/eventBus-services"

const select = (state) => ({
  isEnabled: (state.authentication.loginState === LoginStates.LOGGING_IN
    || state.authentication.loginState === LoginStates.LOGGED_IN),
  connectionState: state.eventBus.connectionState
});

const mapDispatchToProps = (dispatch) => ({
  setConnectionState: (state) => dispatch(updateEventBusConnectionState(state))
});

const EventBroker = (props) => {

  React.useEffect(() => {
    if (props.isEnabled && props.connectionState === EventBusConnectionStates.DISABLED) {
      eventBusClient.connectEventBus();
      props.setConnectionState(EventBusConnectionStates.CONNECTING)
    } else if (props.isEnabled && props.connectionState === EventBusConnectionStates.CONNECTED) {
      eventBusClient.refreshHandlerRegistrations()
    } else if (!props.isEnabled && props.connectionState !== EventBusConnectionStates.DISABLED && props.connectionState !== EventBusConnectionStates.CLOSING) {
      eventBusClient.disconnectEventBus();
      props.setConnectionState(EventBusConnectionStates.CLOSING)
    }
  }, [props.isEnabled, props.connectionState]);

  return props.children
};

export default connect(select, mapDispatchToProps)(EventBroker)