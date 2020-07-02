import React from "react";
import { connect } from "react-redux";
import { LoginStates } from "../services/authentication/authentication-actions";
import { EventBusConnectionStates, updateEventBusConnectionState } from "../services/eventBus/eventBus-actions";
import { eventBusClient } from "../services/eventBus/eventBus-services";

const EventBroker = (props) => {

  React.useEffect(() => {
    if (props.isEnabled && props.connectionState === EventBusConnectionStates.DISABLED) {
      eventBusClient.connectEventBus(props.updateConnectionState);
    } else if (props.isEnabled && props.connectionState === EventBusConnectionStates.CONNECTED) {
      eventBusClient.refreshHandlerRegistrations();
    } else if (!props.isEnabled && props.connectionState !== EventBusConnectionStates.DISABLED && props.connectionState !== EventBusConnectionStates.DISCONNECTING) {
      eventBusClient.disconnectEventBus(props.updateConnectionState);
    }
  }, [props.isEnabled, props.connectionState]);

  return props.children;
};

const select = (state) => ({
  isEnabled: (state.authentication.loginState === LoginStates.REQUESTED_TO_LOGIN
    || state.authentication.loginState === LoginStates.LOGGING_IN
    || state.authentication.loginState === LoginStates.LOGGED_IN),
  connectionState: state.eventBus.connectionState
});

const mapDispatchToProps = (dispatch) => ({
  updateConnectionState: (connectionState) => dispatch(updateEventBusConnectionState(connectionState))
});

export default connect(select, mapDispatchToProps)(EventBroker);