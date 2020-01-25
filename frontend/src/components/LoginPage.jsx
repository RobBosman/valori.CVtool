"use strict";

import React from "react";
import Title from "./Title";
import "./LoginPage.scss";

export default class LoginPage extends React.Component {
    constructor(props) {
        super(props);
    }

    handleAanmelden = (event) => {
        this.props.onChange("logging-in");
    };

    render() {
        return (
            <div className="LoginPage">
                <h1>Welkom bij de <Title height="27em"/></h1>
                <p>
                    Om de CVtool te gebruiken moet je je aanmelden met je <b>Valori</b> account.
                    <br/>Tijdens het inlogproces controleert de CVtool je account,
                    je moet daar eenmalig toestemming voor geven.
                </p>
                <p>
                    <a href="https://account.activedirectory.windowsazure.com/r/#/applications"
                       target="blank">Hier</a> kun je die toestemming bekijken en eventueel weer intrekken.
                    <br/>Als je de <em>Valori CVtool</em> app verwijdert blijven je cv-gegevens bewaard.
                    <br/>Na opnieuw inloggen (en toestemming verlenen) kun je daar weer bij.
                </p>
                <p>
                    Problemen? <a href="mailto:RobBosman@valori.nl" target="blank">Mail</a> even!
                </p>
                <button onClick={this.handleAanmelden}>Aanmelden</button>
            </div>
        );
    }
}