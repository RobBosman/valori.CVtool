import React from "react";
import { Text, Stack } from "@fluentui/react";
import { useTheme } from "../../services/ui/ui-services";

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
      <Text variant="xLarge">Welkom Rob Bosman</Text>
      <Text>
        <br/>Dit is versie v2020### van CvCenter van Valori, waarmee je je curriculum vitae kunt invoeren.
        <br/>Let even op het volgende:
        <ul>
          <li>AutoSave: al je wijzigingen worden na twee seconden vanzelf opgeslagen.
            <br/>Als je niet van plan bent iets te wijzigen, zet &apos;AutoSave&apos; dan uit met de knop rechtsonder.</li>
          <br/>
          <li><em>Publiceren</em> plaatst je cv in de <a href="https://valorinl.sharepoint.com/sites/Kantoor/CV_databank" target="blank">CV Databank in SharePoint</a>.</li>
          <br/>
          <li>Sorteren: gegevens in tabellen kun je sorteren door op de kolomheader te klikken.
            <br/>Het sorteren van tabelgegevens heeft geen invloed op de volgorde in je cv, behalve bij Werkopdrachten.
            <br/>Die zijn standaard gesorteerd op einddatum, maar dat kun je met drag&amp;drop aanpassen.
            <br/>Dat kan handig zijn als je meerdere opdrachten tegelijk hebt.</li>
          <br/>
          <li>Markdown lijst: In veel tekstvelden kun je een opsomming maken door regels te laten beginnen met
            <br/>&apos;<strong>* </strong>&apos; (sterretje + spatie) voor een lijst met &apos;Valori bullets&apos; of met
            <br/>&apos;<strong># </strong>&apos; (hekje + spatie) voor een genummerde lijst.</li>
        </ul>
        Ik heb geprobeerd alles zo gebruiksvriendelijk mogelijk te maken, maar tips en (positieve ;-) kritiek zijn altijd welkom.
        <br/>Problemen? Een bug ontdekt? Stuur even een mailtje naar <a href="mailto:RobBosman@valori.nl" target="blank">RobBosman@valori.nl</a>.
        <br/>
        <br/>Enjoy!
        <br/>Rob
      </Text>
    </Stack>
  );
};

export default Info;