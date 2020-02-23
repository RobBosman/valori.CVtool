import React from "react"

const Heartbeat = (props) => {

    React.useEffect(() => {
        const intervalID = setInterval(() => console.log("tik-tak"), props.period);
        return () => clearInterval(intervalID)
    }, []);

    return null // render nothing
};

export default Heartbeat