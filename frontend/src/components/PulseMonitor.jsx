import React from "react";
import { getTheme } from "@fluentui/react";
import { addEventHandler, removeEventHandler } from "./EventBroker";
import "./KeyFrames.css";
import { LoginStates } from "../redux/authentication";
import { connect } from "react-redux";
import { EventBusStates } from "../redux/eventBus";

const select = (state) => ({
  shouldBeConnected: state.authentication.loginState === LoginStates.LOGGED_IN,
  isConnected: state.eventBus === EventBusStates.CONNECTED,
  isDisconnected: (state.eventBus === EventBusStates.CLOSED || state.eventBus === EventBusStates.DISABLED)
});

const PulseMonitor = (props) => {

  React.useEffect(() => {
    const handler = { address: 'server.heartbeat', header: {}, callback: serverHeartbeatHandler };
    addEventHandler(handler, 'add handlers');
    // at the close:
    return () => removeEventHandler(handler)
  }, []);

  const [angle, setAngle] = React.useState(0);

  React.useEffect(() => {
    const timeoutID = setTimeout(() => setAngle((angle + 9) % 360), 25);
    // at the close:
    return () => clearTimeout(timeoutID)
  });

  const [pulse, setPulse] = React.useState(undefined);

  const serverHeartbeatHandler = () => {
    setPulse(<circle cx="100" cy="100" r="25" fill={getTheme().semanticColors.bodySubtext}
      style={{ opacity: 0.0, animationName: "fadeOutOpacity", animationDuration: "1s" }} />);
    const timeoutID = setTimeout(() => setPulse(undefined), 900);
    // at the close:
    return () => clearTimeout(timeoutID)
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"
      style={{ position: "fixed", width: 200, height: 200, bottom: 0, right: 0 }}>
      <circle cx="100" cy="100" r="80"
        fill="none"
        stroke={getTheme().semanticColors.primaryButtonBackground}
        strokeWidth="10" strokeDasharray="400,500"
        transform={"rotate(" + angle + ",100,100)"} />
      {(props.shouldBeConnected !== props.isConnected || !props.shouldBeConnected !== props.isDisconnected)
        ? <circle cx="100" cy="100" r="50"
          fill="none" strokeWidth="25"
          stroke={getTheme().semanticColors.warningHighlight} />
        : undefined}
      {pulse}
    </svg>
  )
};

export default connect(select)(PulseMonitor)