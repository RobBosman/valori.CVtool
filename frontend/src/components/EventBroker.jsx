import React from "react"
import { connect } from "react-redux"
import { LoginStates } from "../services/authentication/authentication-actions"
import { EventBusStates, updateEventBusState } from "../services/eventBus/eventBus-actions"
import { connectEventBus, disconnectEventBus, refreshHandlerRegistrations } from "../services/eventBus/eventBus-services"

const select = (state) => ({
  isEnabled: (state.authentication.loginState === LoginStates.LOGGING_IN
    || state.authentication.loginState === LoginStates.LOGGED_IN),
  eventBus: state.eventBus
});

const mapDispatchToProps = (dispatch) => ({
  updateEventBusState: (state) => dispatch(updateEventBusState(state))
});

const EventBroker = (props) => {

  React.useEffect(() => {
    if (props.isEnabled && props.eventBus === EventBusStates.DISABLED) {
      connectEventBus();
      props.updateEventBusState(EventBusStates.CONNECTING)
    } else if (props.isEnabled && props.eventBus === EventBusStates.CONNECTED) {
      refreshHandlerRegistrations()
    } else if (!props.isEnabled && props.eventBus !== EventBusStates.DISABLED && props.eventBus !== EventBusStates.CLOSING) {
      disconnectEventBus();
      props.updateEventBusState(EventBusStates.CLOSING)
    }
  }, [props.isEnabled, props.eventBus]);

  return props.children
};

export default connect(select, mapDispatchToProps)(EventBroker)