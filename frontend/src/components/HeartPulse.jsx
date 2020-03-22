import React from "react"
import {getTheme} from "office-ui-fabric-react"
import {addEventHandler, removeEventHandler} from "./EventBroker"

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

    const [pulseColor, setPulseColor] = React.useState(getTheme().semanticColors.bodyBackground);

    const serverHeartbeatHandler = (error, message) => {
        setPulseColor(getTheme().semanticColors.warningHighlight);
        const timeoutID = setTimeout(() => setPulseColor(getTheme().semanticColors.bodyBackground), 150);
        // at the close:
        return () => clearTimeout(timeoutID)
    };

    return (
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 200 200"
             preserveAspectRatio="none" style={{width: 100, height: 100, top: 0, left: 0}}>
            <circle cx="100" cy="100" r="50" fill="none" stroke={getTheme().semanticColors.primaryButtonBackground}
                    strokeWidth="20" strokeDasharray="270,360" transform={"rotate(" + angle + ",100,100)"}/>
            <circle cx="100" cy="100" r="25" fill={pulseColor}/>
        </svg>
    )
};

export default HeartPulse