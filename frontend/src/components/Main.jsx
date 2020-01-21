'use strict';

import React from "react";
import LoginPage from "./LoginPage";
import ErrorPage from "./ErrorPage";
import './Main.scss';

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appState: 'logged-out'
        };
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    handleAppStateChange = (value) => {
        this.setState({
            appState: value
        });

        if (value === 'logging-in') {
            this.timerID = setTimeout(
                () => {
                    this.handleAppStateChange('logged-in')
                },
                1000);
        } else if (value === 'logged-in') {
            this.timerID = setTimeout(
                () => {
                    this.handleAppStateChange('logged-out')
                },
                1000);
        }
    };

    render() {
        switch (this.state.appState) {
            case 'logged-out':
                return <LoginPage onChange={this.handleAppStateChange}/>;
            case 'logging-in':
                return <span>logging in...</span>;
            case 'logged-in':
                return <span>logged in</span>;
            default:
                return <ErrorPage/>;
        }
    }
}