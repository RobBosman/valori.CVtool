import React from "react"
import {AppStates, requestLogout} from "../redux/ducks/AppState"
import {connect} from "react-redux";

const mapStateToProps = (state) => ({
    appState: state.appState
});

const mapDispatchToProps = (dispatch) => ({
    requestLogout: () => dispatch(requestLogout())
});

class AutoLogout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timerID: null
        };
    }

    componentDidMount() {
        this.state.timerID = setTimeout(() => alert("And... it's gone!"), 10000);
    }

    componentWillUnmount() {
        clearTimeout(this.state.timerID)
    }

    render() {
        if (this.props.appState === AppStates.LOGGED_IN) {
            clearTimeout(this.state.timerID);
            this.state.timerID = setTimeout(this.props.requestLogout, 2000);
        }
        return null; // render nothing
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AutoLogout)