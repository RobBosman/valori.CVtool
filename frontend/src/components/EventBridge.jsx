import React, {useEffect} from "react"
import EventBus from "vertx3-eventbus-client"

export const EventBridge = (props) => {

    useEffect(() => {
        const eb = new EventBus('http://localhost:80/eventbus');
        eb.onopen = () => {
            // use the service
            console.log(`The vert.x EventBus is now open!`)
        };
    }, []);

    return null; // render nothing
};