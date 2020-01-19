'use strict';

import React from "react";

function ErrorPage(props) {
    return (
        <div>
            <h2>Error...</h2>
        </div>
    );
}

function TitleCerios(props) {
    return (
        <del className='cerios'>Cerios</del>
    );
}

function TitleValori(props) {
    return (
        <span className='valori'>VALORI</span>
    );
}

function TitleCVtool(props) {
    return (
        <span><TitleCerios/> <TitleValori/> CVtool</span>
    );
}

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
    }

    handleAanmelden = (event) => {
        this.props.onChange('logging-in');
    };

    render() {
        return (
            <div align="center">
                <h1>Welkom bij de <TitleCVtool/>!</h1>
                <p>
                    Om de CVtool te gebruiken moet je je aanmelden met je <TitleValori/> account.
                    <br/>Tijdens het inlogproces controleert de CVtool je account,
                    je moet daar eenmalig toestemming voor geven.
                </p>
                <p>
                    <a href="https://account.activedirectory.windowsazure.com/r/#/applications"
                       target="blank">Hier</a> kun je die toestemming bekijken en eventueel weer intrekken.
                    <br/>Als je de '<em>Cerios (Valori) CVtool</em> app verwijdert blijven je CV-gegevens bewaard.
                    Na opnieuw inloggen (en toestemming verlenen) kun je daar weer bij.
                </p>
                <p>
                    Problemen? <a href="mailto:RobBosman@valori.nl" target="blank">Mail</a> even!
                </p>
                <button onClick={this.handleAanmelden}>Aanmelden</button>
            </div>
        );
    }
}

export default class MainApp extends React.Component {
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