import React from "react"

const Heartbeat = (props) => {

    React.useEffect(() => {
        const intervalID = setInterval(() => console.log("ping"), props.period || 1000);
        return () => clearInterval(intervalID)
    }, []);

    return null // render nothing
};

export default Heartbeat