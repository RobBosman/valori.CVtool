import React from "react";
import { Text, Stack, Link } from "@fluentui/react";
import { useTheme } from "../services/ui/ui-services";

const Info = () => {

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
        <br/>Dit is de Valori <strong>CVtool</strong> waarmee je je curriculum vitae kunt invoeren.
        <br/>Let even op het volgende:
        <ul>
          <li><u>AutoSave</u>: Alle wijzigingen worden na twee seconden vanzelf opgeslagen.</li>
          <br/>
          <li><u>Markdown lijst</u>: In veel tekstvelden kun je een opsomming maken door regels te laten beginnen met
            <br/>&apos;<strong>* </strong>&apos; (sterretje + spatie) voor een lijst met bullets of met
            <br/>&apos;<strong># </strong>&apos; (hekje + spatie) voor een genummerde lijst.</li>
          <br/>
          <li><u>Sorteren</u>: Gegevens in tabellen kun je sorteren, maar dat heeft geen invloed op de volgorde in het cv-document.
            <br/><em>Werkervaringen</em> moet je handmatig sorteren, omdat automatisch sorteren niet altijd goed werkt als je meerdere opdrachten tegelijk hebt.
            <br/>Je kunt de volgorde van werkervaringen met drag&amp;drop aanpassen.</li>
          <br/>
          <li><u>Engelstalig cv</u>: Als je een andere taal selecteert worden bepaalde gegevens, zoals je naam ongewijzigd overgenomen.
            <br/>De meeste gegevems moet je echter per taal opnieuw invoeren, de betreffende tekstvelden zijn dan leeg.
            <br/>Bij een aantal daarvan wordt de NL-waarde alvast voor-ingevuld, bijvoorbeeld bij vaardigheden.
            <br/>Je kunt daar je eigen vertaling invullen, maar als je dat niet doet wordt de voor-ingevulde waarde in je cv opgenomen.</li>
        </ul>
        Ik heb geprobeerd alles zo gebruiksvriendelijk mogelijk te maken, maar tips en (positieve ;-) kritiek zijn altijd welkom.
        <br/>Problemen? Een bug ontdekt? Stuur even een mailtje naar <Link href="mailto:RobBosman@Valori.nl?subject=CVtool" target="blank">RobBosman@Valori.nl</Link>.
        <br/>
        <br/>Enjoy!
        <br/>Rob
      </Text>
    </Stack>
  );
};

export default Info;