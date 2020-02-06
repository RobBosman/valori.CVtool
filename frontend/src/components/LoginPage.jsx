import "./LoginPage.scss"
import React from "react"
import Title from "./Title"
import {connect} from "react-redux"
import {requestLogin} from "../redux/ducks/AppState"
import {Link, PrimaryButton, Text} from "office-ui-fabric-react"

const LoginPage = (props) => (
    <div className="LoginPage">
        <Text variant="xxLarge">Welkom bij de <Title height="24em"/></Text>
        <p>
            <Text>Om de CVtool te gebruiken moet je je aanmelden met je <b>Valori</b> account.
                <br/>Tijdens het inlogproces controleert de CVtool je account,
                je moet daar eenmalig toestemming voor geven.</Text>
        </p>
        <p>
            <Text><Link href="https://account.activedirectory.windowsazure.com/r/#/applications"
                        target="blank">Hier</Link> kun je die toestemming bekijken en eventueel weer intrekken.
                <br/>Als je de <em>Valori CVtool</em> app verwijdert blijven je cv-gegevens bewaard.
                <br/>Na opnieuw inloggen (en toestemming verlenen) kun je daar weer bij.</Text>
        </p>
        <p>
            <Text>Problemen? <Link href="mailto:RobBosman@valori.nl" target="blank">Mail</Link> even!</Text>
        </p>
        <PrimaryButton onClick={props.requestLogin}>Aanmelden</PrimaryButton>
    </div>
);

const mapDispatchToProps = (dispatch) => ({
    requestLogin: () => dispatch(requestLogin("Rob"))
});

export default connect(null, mapDispatchToProps)(LoginPage)