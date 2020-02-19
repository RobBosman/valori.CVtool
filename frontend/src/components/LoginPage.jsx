import React from "react"
import Title from "./Title"
import {connect} from "react-redux"
import {requestLogin} from "../redux/ducks/AppState"
import {Link, PrimaryButton, Stack, Text} from "office-ui-fabric-react"

const LoginPage = (props) => {

    const themedLargeStackTokens = {
        childrenGap: 'l1',
        padding: 'l1'
    };

    return (
        <Stack tokens={themedLargeStackTokens} style={{textAlign: "center"}}>
            <Text variant="xxLarge">Welkom bij de <Title height="24em"/></Text>
            <Text>Om de CVtool te gebruiken moet je je aanmelden met je <b>Valori</b> account.
                <br/>Tijdens het inlogproces controleert de CVtool je account, je moet daar eenmalig toestemming
                voor geven.
                <br/>
                <br/><Link href="https://account.activedirectory.windowsazure.com/r/#/applications"
                           target="blank">Hier</Link> kun je die toestemming bekijken en eventueel weer intrekken.
                <br/>Als je de <em>Valori CVtool</em> app verwijdert blijven je cv-gegevens bewaard.
                <br/>Na opnieuw inloggen (en toestemming verlenen) kun je daar weer bij.
                <br/>
                <br/>Problemen? <Link href="mailto:RobBosman@valori.nl" target="blank">Mail</Link> even!</Text>
            <Stack.Item align="center">
                <PrimaryButton onClick={props.requestLogin}>Aanmelden</PrimaryButton>
            </Stack.Item>
        </Stack>
    )
};

const mapDispatchToProps = (dispatch) => ({
    requestLogin: () => dispatch(requestLogin())
});

export default connect(null, mapDispatchToProps)(LoginPage)