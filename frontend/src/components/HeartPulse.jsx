import React from "react"
import {getTheme} from "office-ui-fabric-react"
import {addEventHandler, removeEventHandler} from "./EventBroker"
import "./HeartPulse.css"
import {AppStates} from "../redux/ducks/AppState"
import {connect} from "react-redux"
import {EventBusStates} from "../redux/ducks/EventBusState";

const HeartPulse = (props) => {

    const [angle, setAngle] = React.useState(0);

    React.useEffect(() => {
        const timeoutID = setTimeout(() => setAngle((angle + 9) % 360), 25);
        // at the close:
        return () => clearTimeout(timeoutID)
    });

    React.useEffect(() => {
        const handler = {address: 'server.heartbeat', header: {}, callback: serverHeartbeatHandler};
        addEventHandler(handler, 'add handlers');
        // at the close:
        return () => removeEventHandler(handler)
    }, []);

    const [pulse, setPulse] = React.useState(undefined);

    const serverHeartbeatHandler = (error, message) => {
        setPulse(<circle id="pulse" cx="100" cy="100" r="25" fill={getTheme().semanticColors.bodySubtext}/>);
        const timeoutID = setTimeout(() => setPulse(undefined), 900);
        // at the close:
        return () => clearTimeout(timeoutID)
    };

    let warningNotConnected = undefined;
    if (props.shouldBeConnected && props.eventBusState !== EventBusStates.CONNECTED) {
        warningNotConnected = <circle cx="100" cy="100" r="50" fill="none" strokeWidth="25"
                                      stroke={getTheme().semanticColors.warningHighlight}/>;
    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"
             style={{position: "fixed", width: 100, height: 100, bottom: 0, right: 0}}>
            <circle cx="100" cy="100" r="80" fill="none" stroke={getTheme().semanticColors.primaryButtonBackground}
                    strokeWidth="10" strokeDasharray="270,360" transform={"rotate(" + angle + ",100,100)"}/>
            {warningNotConnected}
            {pulse}
        </svg>
    )
};

const select = (state) => ({
    shouldBeConnected: state.appState === AppStates.LOGGED_IN,
    eventBusState: state.eventBusState
});

export default connect(select)(HeartPulse)