import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Text, Stack, Link, DefaultButton, TooltipHost } from "@fluentui/react";
import * as commonUtils from "../utils/CommonUtils";
import { useTheme } from "../services/ui/ui-services";
import * as cvActions from "../services/cv/cv-actions";

const Info = (props) => {

  const {viewPaneBackground} = useTheme();
  const viewStyles = {
    root: {
      background: viewPaneBackground,
      padding: 20,
      height: "calc(100vh - 170px)"
    }
  };

  return (
    <Stack styles={viewStyles}>
      <Text variant="xxLarge">Info</Text>
      <Text>
        <br/>Dit is de Cerios <strong>CVtool</strong> waarmee je je curriculum vitae kunt invoeren.
        <br/>Let even op het volgende:
        <ul>
          <li><u>Profielfoto</u>: Voeg eventueel je (pas)foto toe in de <strong>Profiel</strong> tab.
            <br/>Als je je Cerios profielfoto wilt gebruiken moet je daarvoor (eenmalig) toestemming verlenen.
            <br/>De foto moet een resolutie van ten minste {commonUtils.MIN_PHOTO_SIZE_PX}x{commonUtils.MIN_PHOTO_SIZE_PX} pixels hebben.
            <br/>Met de knop <em>Foto in cv opnemen</em> kun je per profiel bepalen of de foto in het cv wordt opgenomen.</li>
          <br/>
          <li><u>Markdown lijst</u>: In veel tekstvelden kun je een opsomming maken door regels te laten beginnen met
            <br/>&apos;<strong>* </strong>&apos; of &apos;<strong>- </strong>&apos; (asterisk/streepje + spatie) voor een lijst met bullets of met
            <br/>&apos;<strong># </strong>&apos; (hekje + spatie) voor een genummerde lijst.</li>
          <br/>
          <li><u>Sorteren</u>: Gegevens in tabellen kun je sorteren, maar dat heeft geen invloed op de volgorde in het cv-document.
            <br/><em>Werkervaringen</em> moet je handmatig sorteren, omdat automatisch sorteren niet altijd goed werkt als je meerdere opdrachten tegelijk hebt.
            <br/>Je kunt de volgorde van werkervaringen met drag&amp;drop aanpassen.</li>
          <br/>
          <li><u>Engelstalig cv</u>: Als je een andere taal selecteert worden bepaalde gegevens, zoals je naam ongewijzigd overgenomen.
            <br/>De meeste gegevens moet je echter per taal opnieuw invoeren, de betreffende tekstvelden zijn dan leeg.
            <br/>Bij een aantal daarvan wordt de NL-waarde alvast voor-ingevuld, bijvoorbeeld bij vaardigheden.
            <br/>Je kunt daar je eigen vertaling invullen, maar als je dat niet doet wordt de voor-ingevulde waarde in je cv opgenomen.</li>
          <br/>
          <li><u>AutoSave</u>: Elke wijziging wordt na twee seconden vanzelf opgeslagen.</li>
          <br/>
          <li><u>Voorbeeld</u>: Klik hier om een uitgewerkt voorbeeld cv te downloaden:&nbsp;
            <TooltipHost content="Download uitgewerkt voorbeeld CV">
              <DefaultButton
                text="Voorbeeld CV"
                iconProps={{ iconName: "CloudDownload" }}
                onClick={() => props.onFetchDemoCv(props.authInfo.accountId, props.locale)}
                styles={{ root: { padding: 0, width: 140 } }}
              />
            </TooltipHost>
          </li>
        </ul>
        Ik heb geprobeerd alles zo gebruiksvriendelijk mogelijk te maken, maar tips en (positieve ;-) kritiek zijn altijd welkom.
        <br/>Problemen? Een bug ontdekt? Stuur even een mailtje naar <Link href="mailto:RobBosman@valori.nl?subject=CVtool" target="blank">RobBosman@valori.nl</Link>.
        <br/>
        <br/>Enjoy!
        <br/>Rob
      </Text>
    </Stack>
  );
};

Info.propTypes = {
  locale: PropTypes.string.isRequired,
  authInfo: PropTypes.object,
  onFetchDemoCv: PropTypes.func.isRequired
};

const select = (store) => ({
  locale: store.ui.userPrefs.locale,
  authInfo: store.auth.authInfo,
});

const mapDispatchToProps = (dispatch) => ({
  onFetchDemoCv: (accountId, locale) => dispatch(cvActions.fetchDemoCv(accountId, locale))
});

export default connect(select, mapDispatchToProps)(Info);