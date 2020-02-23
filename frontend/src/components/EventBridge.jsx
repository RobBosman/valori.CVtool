import React, {useEffect} from "react"
import EventBus from "vertx3-eventbus-client"

const getHeartbeatHandler = (error, message) => {
    console.log('received a Heartbeat: ' + message.body);
};
const getCvDataHandler = (error, message) => {
    console.log('received a message: ' + JSON.stringify(message), error, message);
};

const registerHandlers = (eventBus) => {
    if (eventBus.state === EventBus.OPEN) {
        console.log('registering handlers');
        eventBus.registerHandler('cv.heartbeat', {}, getHeartbeatHandler);
        eventBus.registerHandler('cv.data.get', {}, getCvDataHandler);
    }
};
const unregisterHandlers = (eventBus) => {
    if (eventBus.state === EventBus.OPEN) {
        console.log('unregistering handlers');
        eventBus.unregisterHandler('cv.heartbeat', {}, getHeartbeatHandler);
        eventBus.unregisterHandler('cv.data.get', {}, getCvDataHandler);
    }
};

export const EventBridge = (props) => {

    useEffect(() => {
        const options = {
            vertxbus_reconnect_attempts_max: Infinity, // Max reconnect attempts
            vertxbus_reconnect_delay_min: 1000, // Initial delay (in ms) before first reconnect attempt
            vertxbus_reconnect_delay_max: 5000, // Max delay (in ms) between reconnect attempts
            vertxbus_reconnect_exponent: 2, // Exponential backoff factor
            vertxbus_randomization_factor: 0.5 // Randomization factor between 0 and 1
        };
        const eventBus = new EventBus('http://localhost:80/eventbus', options);
        eventBus.onerror = (error) => {
            console.log('An error occurred on the Eventbus', error);
        };

        eventBus.enableReconnect(true);
        eventBus.onreconnect = () => {
            console.log('Eventbus reconnected!');
            unregisterHandlers(eventBus);
            registerHandlers(eventBus);
        };

        eventBus.onopen = () => {
            console.log(`The vert.x EventBus is now open.`);

            // receive stuff
            registerHandlers(eventBus);

            // send a message
            eventBus.send('cv.data.set', {name: 'dummy', age: "gibberish"}, (error, message) => {
                if (error) {
                    console.error("received error response: ", error)
                } else {
                    eventBus.send('cv.data.get', message.body, getCvDataHandler);
                }
            });
        };

        // at the close:
        return () => {
            unregisterHandlers(eventBus);
            eventBus.close();
            console.log(`The vert.x EventBus has been closed`)
        }
    }, []);

    return null // render nothing
};