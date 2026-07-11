import PropTypes from "prop-types";
import React from "react";
import {shallowEqual, useSelector} from "react-redux";
import {getTheme} from "@fluentui/react";
import {LoginStates} from "../services/auth/auth-actions";
import {ConnectionStates, eventBusClient} from "../services/eventBus/eventBus-services";
import "./KeyFrames.css";

const PulseMonitor = prps => {

  const selectors = useSelector(
    state => ({
      shouldBeConnected: state.auth.loginState === LoginStates.LOGGED_IN,
      isConnected: state.eventBus.connectionState === ConnectionStates.CONNECTED,
      isDisconnected: (state.eventBus.connectionState === ConnectionStates.DISCONNECTED)
    }),
    {equalityFn: shallowEqual}
  );
  const props = {...prps, ...selectors};

  const [angle, setAngle] = React.useState(0);
  const [pulse, setPulse] = React.useState(undefined);

  React.useEffect(() => {
    const handler = { address: "server.heartbeat", header: {}, callback: serverHeartbeatHandler };
    eventBusClient.addEventHandler(handler);
    // at the close:
    return () => eventBusClient.removeEventHandler(handler);
  }, []);

  React.useEffect(() => {
    const timeoutID = setTimeout(() =>
      setAngle(prevState => (prevState.angle + 9) % 360),
    25);
    // at the close:
    return () => clearTimeout(timeoutID);
  });

  const serverHeartbeatHandler = () => {
    setPulse(
      <circle cx="100" cy="100" r="25" fill={getTheme().semanticColors.bodySubtext}
        style={{ opacity: 0, animationName: "fadeOutOpacity", animationDuration: "1s" }}
      />);

    const timeoutID = setTimeout(() =>
      setPulse(undefined),
    900);
    // at the close:
    return () => clearTimeout(timeoutID);
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"
      style={{ position: "fixed", width: 200, height: 200, bottom: 0, right: 0 }}>
      <circle cx="100" cy="100" r="80"
        fill="none"
        stroke={getTheme().semanticColors.primaryButtonBackground}
        strokeWidth="10" strokeDasharray="400,500"
        transform={"rotate(" + angle + ",100,100)"} />
      {(props.shouldBeConnected !== props.isConnected || props.shouldBeConnected === props.isDisconnected)
        ? <circle cx="100" cy="100" r="50"
          fill="none" strokeWidth="25"
          stroke={getTheme().semanticColors.warningIcon} />
        : undefined}
      {pulse}
    </svg>
  );
};

PulseMonitor.propTypes = {
  shouldBeConnected: PropTypes.bool,
  isConnected: PropTypes.bool,
  isDisconnected: PropTypes.bool
};

export default PulseMonitor;