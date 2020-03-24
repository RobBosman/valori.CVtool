import React from "react"
import {getTheme} from "office-ui-fabric-react"
import {addEventHandler, removeEventHandler} from "./EventBroker"
import "./KeyFrames.css"
import {AppStates} from "../redux/ducks/AppState"
import {connect} from "react-redux"
import {EventBusStates} from "../redux/ducks/EventBusState"

const PulseMonitor = (props) => {

    React.useEffect(() => {
        const handler = {address: 'server.heartbeat', header: {}, callback: serverHeartbeatHandler};
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

    const serverHeartbeatHandler = (error, message) => {
        setPulse(<circle cx="100" cy="100" r="25" fill={getTheme().semanticColors.bodySubtext}
                         style={{opacity: 0.0, animationName: "fadeOutOpacity", animationDuration: "1s"}}/>);
        const timeoutID = setTimeout(() => setPulse(undefined), 900);
        // at the close:
        return () => clearTimeout(timeoutID)
    };

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"
             style={{position: "fixed", width: 200, height: 200, bottom: 0, right: 0}}>
            <circle cx="100" cy="100" r="80" fill="none" stroke={getTheme().semanticColors.primaryButtonBackground}
                    strokeWidth="10" strokeDasharray="400,500" transform={"rotate(" + angle + ",100,100)"}/>
            {(props.shouldBeConnected !== props.isConnected || !props.shouldBeConnected !== props.isDisconnected)
                ? <circle cx="100" cy="100" r="50" fill="none" strokeWidth="25"
                          stroke={getTheme().semanticColors.warningHighlight}/>
                : undefined}
            {pulse}
        </svg>
    )
};

const select = (state) => ({
    shouldBeConnected: state.appState === AppStates.LOGGED_IN,
    isConnected: state.eventBusState === EventBusStates.CONNECTED,
    isDisconnected: (state.eventBusState === EventBusStates.CLOSED || state.eventBusState === EventBusStates.DISABLED)
});

export default connect(select)(PulseMonitor)