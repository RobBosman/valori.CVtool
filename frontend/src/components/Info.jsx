import React from "react";
import { Text, Stack } from "@fluentui/react";
import { useTheme } from "../services/ui/ui-services";

const Info = () => {

  const { viewPaneColor } = useTheme();
  const viewStyles = {
    root: [
      {
        background: viewPaneColor,
        padding: 20
      }
    ]
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
          <li><u>Sorteren</u>: Gegevens in tabellen worden gesorteerd in dezelfde volgorde als in het cv-document.
            <br/><em>Werkervaringen</em> moet je handmatig sorteren. omdat automatisch sorteren niet altijd goed werkt als je meerdere opdrachten tegelijk hebt.
            <br/>Je kunt de volgorde van werkervaringen met drag&amp;drop aanpassen.</li>
        </ul>
        Ik heb geprobeerd alles zo gebruiksvriendelijk mogelijk te maken, maar tips en (positieve ;-) kritiek zijn altijd welkom.
        <br/>Problemen? Een bug ontdekt? Stuur even een mailtje naar <a href="mailto:RobBosman@Valori.nl?subject=CVtool" target="blank">RobBosman@Valori.nl</a>.
        <br/>
        <br/>Enjoy!
        <br/>Rob
      </Text>
    </Stack>
  );
};

export default Info;