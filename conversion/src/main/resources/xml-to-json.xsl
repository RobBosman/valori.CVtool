<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:cv="https://ns.bransom.nl/cerios/cv/v20110401"
    xmlns:util="nl.valori.cvtool.XslUtil"
    exclude-result-prefixes="cv"
    version="1.0">

  <xsl:output method="text" encoding="utf-8" omit-xml-declaration="yes" indent="yes"/>

  <xsl:variable name="LOWERCASE" select="'abcdefghijklmnopqrstuvwxyz'"/>
  <xsl:variable name="UPPERCASE" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'"/>

  <xsl:template match="cv:set_of_businessunit">
    {
    "businessUnit": [<xsl:apply-templates select="cv:businessunit"/>]
    }
  </xsl:template>

  <xsl:template match="cv:businessunit">
    <xsl:if test="position() > 1">,</xsl:if>
    {
    "_id":"<xsl:value-of select="util:uuid(@id)"/>"
    ,"name":"<xsl:value-of select="cv:naam"/>"
    ,"contactName":"<xsl:value-of select="cv:manager_naam"/>"
    ,"contactPhone":"<xsl:value-of select="cv:manager_telefoonnummer"/>"
    ,"contactEmail":"<xsl:value-of select="cv:manager_email"/>"
    ,"accountIds": [
    <xsl:for-each select="cv:_account">
      <xsl:if test="position() > 1">,</xsl:if>
      "<xsl:value-of select="util:uuid(@id)"/>"
    </xsl:for-each>
    ]
    }
  </xsl:template>


  <xsl:template match="cv:set_of__account">
    {
    "account": [<xsl:apply-templates select="cv:_account"/>]
    ,"cv": [<xsl:apply-templates select="*/cv:cv"/>]
    ,"education": [<xsl:apply-templates select="*/cv:cv/cv:opleiding"/>]
    ,"publication": [<xsl:apply-templates select="*/cv:cv/cv:publicatie[cv:titel or cv:media]"/>]
    ,"reference": [<xsl:apply-templates select="*/cv:cv/cv:referentie[cv:naam_referent]"/>]
    ,"skill": [
    <xsl:apply-templates select="*/cv:cv/cv:talenkennis[cv:taal_NL or cv:taal_UK]
      | */cv:cv/cv:branchekennis[cv:omschrijving_NL or cv:omschrijving_UK]
      | */cv:cv/cv:vaardigheid[cv:omschrijving]"/>
    ]
    ,"experience": [<xsl:apply-templates select="*/cv:cv/cv:werkopdracht"/>]
    }
  </xsl:template>

  <xsl:template match="cv:_account">
    <xsl:if test="position() > 1">,</xsl:if>
    {
    "_id": "<xsl:value-of select="util:uuid(@id)"/>"
    ,"name": "<xsl:value-of select="cv:name"/>"
    ,"email": "<xsl:apply-templates select="." mode="email"/>"
    ,"dateOfBirth": "<xsl:value-of select="cv:cv/cv:persoonsgegevens/cv:geboortedatum"/>"
    ,"residence": "<xsl:value-of select="cv:cv/cv:persoonsgegevens/cv:woonplaats"/>"
    ,"privileges": <xsl:apply-templates select="." mode="privileges"/>
    }
  </xsl:template>

  <xsl:template match="cv:cv">
    <xsl:if test="position() > 1">,</xsl:if>
    {
    "_id": "<xsl:value-of select="util:uuid(@id)"/>"
    ,"accountId": "<xsl:value-of select="util:uuid(../@id)"/>"
    <xsl:if test="cv:persoonsgegevens/cv:functie_titel">
      ,"role": {
      "nl_NL": "<xsl:value-of select="util:jsonText(cv:persoonsgegevens/cv:functie_titel)"/>"
      }
    </xsl:if>
    ,"profile": {
    <xsl:for-each select="cv:profiel">
      <xsl:variable name="profiel" select="util:jsonText(cv:profiel)"/>
      <xsl:variable name="persoonlijke_eigenschappen" select="util:jsonText(cv:persoonlijke_eigenschappen)"/>
      <xsl:variable name="vaardigheden" select="util:jsonText(cv:vaardigheden)"/>
      <xsl:variable name="profileJsonText">
        <xsl:value-of select="$profiel"/>
        <xsl:if test="$persoonlijke_eigenschappen">\n\n</xsl:if>
        <xsl:value-of select="$persoonlijke_eigenschappen"/>
        <xsl:if test="$vaardigheden">\n\n</xsl:if>
        <xsl:value-of select="$vaardigheden"/>
      </xsl:variable>
      <xsl:if test="$profileJsonText">
        <xsl:if test="position() > 1">,</xsl:if>
        "<xsl:value-of select="cv:locale"/>": "<xsl:value-of select="$profileJsonText"/>"
      </xsl:if>
    </xsl:for-each>
    }
    <xsl:if test="cv:profiel/cv:interesses">
      ,"interests": {
      <xsl:for-each select="cv:profiel[util:jsonText(cv:interesses)]">
        <xsl:if test="position() > 1">,</xsl:if>
        "<xsl:value-of select="cv:locale"/>": "<xsl:value-of select="util:jsonText(cv:interesses)"/>"
      </xsl:for-each>
      }
    </xsl:if>
    <xsl:if test="util:jsonInt(cv:persoonsgegevens/cv:werkervaring_sinds) > 0">
      ,"workingSince": <xsl:value-of select="util:jsonInt(cv:persoonsgegevens/cv:werkervaring_sinds)"/>
    </xsl:if>
    <xsl:if test="util:jsonInt(cv:persoonsgegevens/cv:it_ervaring_sinds) > 0">
      ,"inItSince": <xsl:value-of select="util:jsonInt(cv:persoonsgegevens/cv:it_ervaring_sinds)"/>
    </xsl:if>
    }
  </xsl:template>

  <xsl:template match="cv:opleiding">
    <xsl:if test="position() > 1">,</xsl:if>
    {
    "_id": "<xsl:value-of select="util:uuid(@id)"/>"
    ,"cvId": "<xsl:value-of select="util:uuid(../@id)"/>"
    ,"type": "<xsl:apply-templates select="cv:soort_opleiding" mode="educationType"/>"
    ,"name": {
    "nl_NL": "<xsl:value-of select="util:jsonText(cv:naam_opleiding)"/>"
    }
    ,"institution": "<xsl:value-of select="util:jsonText(concat(cv:naam_instituut, ' ', cv:plaats_instituut))"/>"
    ,"yearTo": <xsl:value-of select="util:jsonInt(cv:jaar_diploma)"/>
    ,"result": "<xsl:apply-templates select="cv:diploma" mode="educationResult"/>"
    }
  </xsl:template>

  <xsl:template match="cv:publicatie">
    <xsl:variable name="titel" select="util:jsonText(cv:titel)"/>
    <xsl:variable name="media" select="util:jsonText(cv:media)"/>
    <xsl:if test="$titel or $media">
      <xsl:variable name="omschrijving_nl_NL" select="util:jsonText(cv:omschrijving_nl_NL)"/>
      <xsl:variable name="omschrijving_uk_UK" select="util:jsonText(cv:omschrijving_uk_UK)"/>
      <xsl:if test="position() > 1">,</xsl:if>
      {
      "_id": "<xsl:value-of select="util:uuid(@id)"/>"
      ,"cvId": "<xsl:value-of select="util:uuid(../@id)"/>"
      ,"year": <xsl:value-of select="util:jsonInt(cv:jaar)"/>
      ,"media": "<xsl:value-of select="$media"/>"
      ,"title": {
      "nl_NL": "<xsl:value-of select="$titel"/>"
      <xsl:if test="$omschrijving_uk_UK">
        ,"uk_UK": "<xsl:value-of select="$titel"/>"
      </xsl:if>
      }
      <xsl:if test="$omschrijving_nl_NL or $omschrijving_uk_UK">
        ,"description": {
        <xsl:if test="$omschrijving_nl_NL">
          "nl_NL": "<xsl:value-of select="$omschrijving_nl_NL"/>"
        </xsl:if>
        <xsl:if test="$omschrijving_uk_UK">
          <xsl:if test="$omschrijving_nl_NL">,</xsl:if>
          "uk_UK": "<xsl:value-of select="$omschrijving_uk_UK"/>"
        </xsl:if>
        }
      </xsl:if>
      ,"includeInCv": true
      }
    </xsl:if>
  </xsl:template>

  <xsl:template match="cv:referentie">
    <xsl:if test="cv:naam_referent">
      <xsl:variable name="functie_referent_nl_NL" select="util:jsonText(cv:functie_referent_nl_NL)"/>
      <xsl:variable name="functie_referent_uk_UK" select="util:jsonText(cv:functie_referent_uk_UK)"/>
      <xsl:variable name="omschrijving_nl_NL" select="util:jsonText(cv:omschrijving_nl_NL)"/>
      <xsl:variable name="omschrijving_uk_UK" select="util:jsonText(cv:omschrijving_uk_UK)"/>
      <xsl:if test="position() > 1">,</xsl:if>
      {
      "_id": "<xsl:value-of select="util:uuid(@id)"/>"
      ,"cvId": "<xsl:value-of select="util:uuid(../@id)"/>"
      ,"referentName": "<xsl:value-of select="util:jsonText(cv:naam_referent)"/>"
      <xsl:if test="$functie_referent_nl_NL or $functie_referent_uk_UK">
        ,"referentFunction": {
        <xsl:if test="$functie_referent_nl_NL">
          "nl_NL": "<xsl:value-of select="$functie_referent_nl_NL"/>"
        </xsl:if>
        <xsl:if test="$functie_referent_uk_UK">
          <xsl:if test="$functie_referent_nl_NL">,</xsl:if>
          "uk_UK": "<xsl:value-of select="$functie_referent_uk_UK"/>"
        </xsl:if>
        }
      </xsl:if>
      <xsl:if test="$omschrijving_nl_NL or $omschrijving_uk_UK">
        ,"description": {
        <xsl:if test="$omschrijving_nl_NL">
          "nl_NL": "<xsl:value-of select="$omschrijving_nl_NL"/>"
        </xsl:if>
        <xsl:if test="$omschrijving_uk_UK">
          <xsl:if test="$omschrijving_nl_NL">,</xsl:if>
          "uk_UK": "<xsl:value-of select="$omschrijving_uk_UK"/>"
        </xsl:if>
        }
      </xsl:if>
      ,"includeInCv": <xsl:apply-templates select="cv:opnemen_in_cv" mode="toBoolean"/>
      }
    </xsl:if>
  </xsl:template>

  <xsl:template match="cv:talenkennis">
    <xsl:variable name="taal_NL" select="util:jsonText(cv:taal_NL)"/>
    <xsl:variable name="taal_UK" select="util:jsonText(cv:taal_UK)"/>
    <xsl:variable name="mondeling" select="cv:mondeling"/>
    <xsl:if test="($taal_NL or $taal_UK) and $mondeling">
      <xsl:if test="position() > 1">,</xsl:if>
      {
      "_id": "<xsl:value-of select="util:uuid(@id)"/>"
      ,"cvId": "<xsl:value-of select="util:uuid(../@id)"/>"
      ,"category": "LANGUAGES"
      ,"description": {
      <xsl:if test="$taal_NL">
        "nl_NL": "<xsl:value-of select="$taal_NL"/>"
      </xsl:if>
      <xsl:if test="$taal_UK">
        <xsl:if test="$taal_NL">,</xsl:if>
        "uk_UK": "<xsl:value-of select="$taal_UK"/>"
      </xsl:if>
      }
      ,"skillLevel": <xsl:apply-templates select="$mondeling" mode="languageLevel"/>
      }
    </xsl:if>
  </xsl:template>

  <xsl:template match="cv:branchekennis">
    <xsl:variable name="omschrijving_NL" select="util:jsonText(cv:omschrijving_NL)"/>
    <xsl:variable name="omschrijving_UK" select="util:jsonText(cv:omschrijving_UK)"/>
    <xsl:if test="$omschrijving_NL or $omschrijving_UK">
      <xsl:if test="position() > 1">,</xsl:if>
      {
      "_id": "<xsl:value-of select="util:uuid(@id)"/>"
      ,"cvId": "<xsl:value-of select="util:uuid(../@id)"/>"
      ,"category": "BRANCHES"
      ,"description": {
      <xsl:if test="$omschrijving_NL">
        "nl_NL": "<xsl:value-of select="$omschrijving_NL"/>"
      </xsl:if>
      <xsl:if test="$omschrijving_UK">
        <xsl:if test="$omschrijving_NL">,</xsl:if>
        "uk_UK": "<xsl:value-of select="$omschrijving_UK"/>"
      </xsl:if>
      }
      ,"skillLevel": <xsl:value-of select="util:jsonLevel(cv:kennisniveau)"/>
      }
    </xsl:if>
  </xsl:template>

  <xsl:template match="cv:vaardigheid">
    <xsl:variable name="omschrijving" select="util:jsonText(cv:omschrijving)"/>
    <xsl:if test="$omschrijving">
      <xsl:if test="position() > 1">,</xsl:if>
      {
      "_id": "<xsl:value-of select="util:uuid(@id)"/>"
      ,"cvId": "<xsl:value-of select="util:uuid(../@id)"/>"
      ,"category": "<xsl:apply-templates select="cv:categorie" mode="convertCategory"/>"
      ,"description": {
      "nl_NL": "<xsl:value-of select="$omschrijving"/>"
      }
      ,"skillLevel": <xsl:value-of select="util:jsonLevel(cv:kennisniveau)"/>
      }
    </xsl:if>
  </xsl:template>

  <xsl:template match="cv:werkopdracht">
    <xsl:if test="position() > 1">,</xsl:if>
    {
    "_id": "<xsl:value-of select="util:uuid(@id)"/>"
    ,"cvId": "<xsl:value-of select="util:uuid(../@id)"/>"
    ,"periodBegin": "<xsl:value-of select="cv:periode_begin"/>"
    ,"periodEnd": "<xsl:value-of select="cv:periode_eind"/>"
    ,"client": "<xsl:value-of select="util:jsonText(cv:opdrachtgever)"/>"
    ,"employer": "<xsl:value-of select="util:jsonText(cv:werkgever)"/>"
    <xsl:if test="cv:werkervaring/cv:rol">
      ,"role": {
      <xsl:for-each select="cv:werkervaring[cv:rol]">
        <xsl:if test="position() > 1">,</xsl:if>
        "<xsl:value-of select="cv:locale"/>": "<xsl:value-of select="util:jsonText(cv:rol)"/>"
      </xsl:for-each>
      }
    </xsl:if>
    <xsl:if test="cv:werkervaring/cv:opdrachtformulering">
      ,"assignment": {
      <xsl:for-each select="cv:werkervaring[cv:opdrachtformulering]">
        <xsl:if test="position() > 1">,</xsl:if>
        "<xsl:value-of select="cv:locale"/>": "<xsl:value-of select="util:jsonText(cv:opdrachtformulering)"/>"
      </xsl:for-each>
      }
    </xsl:if>
    <xsl:if test="cv:werkervaring/cv:werkzaamheden">
      ,"activities": {
      <xsl:for-each select="cv:werkervaring[cv:werkzaamheden]">
        <xsl:if test="position() > 1">,</xsl:if>
        "<xsl:value-of select="cv:locale"/>": "<xsl:value-of select="util:jsonText(cv:werkzaamheden)"/>"
      </xsl:for-each>
      }
    </xsl:if>
    <xsl:if test="cv:werkervaring/cv:resultaat">
      ,"results": {
      <xsl:for-each select="cv:werkervaring[cv:resultaat]">
        <xsl:if test="position() > 1">,</xsl:if>
        "<xsl:value-of select="cv:locale"/>": "<xsl:value-of select="util:jsonText(cv:resultaat)"/>"
      </xsl:for-each>
      }
    </xsl:if>
    <xsl:if test="cv:werkervaring/cv:steekwoorden">
      ,"keywords": {
      <xsl:for-each select="cv:werkervaring[cv:steekwoorden]">
        <xsl:if test="position() > 1">,</xsl:if>
        "<xsl:value-of select="cv:locale"/>": "<xsl:value-of select="util:jsonText(cv:steekwoorden)"/>"
      </xsl:for-each>
      }
    </xsl:if>
    ,"sortIndex": <xsl:value-of select="util:jsonInt(cv:sort_index)"/>
    ,"includeInCv": <xsl:apply-templates select="cv:opnemen_in_cv" mode="toBoolean"/>
    }
  </xsl:template>


  <xsl:template match="cv:_account" mode="privileges">
    [<xsl:if test="cv:rol[cv:naam = 'view alle CVs']">"ADMIN"</xsl:if>]
  </xsl:template>

  <xsl:template match="text()" mode="educationType">
    <xsl:choose>
      <xsl:when test=". = 1">TRAINING</xsl:when>
      <xsl:otherwise>EDUCATION</xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="text()" mode="educationResult">
    <xsl:choose>
      <xsl:when test=". = 1">DIPLOMA</xsl:when>
      <xsl:when test=". = 2">CERTIFICATE</xsl:when>
      <xsl:when test=". = 3">ONGOING</xsl:when>
      <xsl:when test=". = 4">CANCELED</xsl:when>
      <xsl:otherwise>NOT_APPLICABLE</xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="text()" mode="languageLevel">
    <xsl:choose>
      <xsl:when test=". = 1">3</xsl:when>
      <xsl:when test=". = 2">3</xsl:when>
      <xsl:when test=". = 3">2</xsl:when>
      <xsl:when test=". = 4">2</xsl:when>
      <xsl:when test=". = 5">1</xsl:when>
      <xsl:otherwise>1</xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="text()" mode="convertCategory">
    <xsl:choose>
      <xsl:when test=". = 'Expertises'">EXPERTISE</xsl:when>
      <xsl:when test=". = 'Databases'">DATABASES</xsl:when>
      <xsl:when test=". = 'Applicaties'">APPLICATIONS</xsl:when>
      <xsl:when test=". = 'Tools'">TOOLS</xsl:when>
      <xsl:when test=". = 'Programmeren'">PROGRAMMING</xsl:when>
      <xsl:when test=". = 'Methodes'">METHODS</xsl:when>
      <xsl:when test=". = 'OS en Netwerken'">OS_NETWORKS</xsl:when>
      <xsl:otherwise><xsl:value-of select="."/></xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="text()" mode="toBoolean">
    <xsl:choose>
      <xsl:when test=". = 1">true</xsl:when>
      <xsl:otherwise>false</xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="cv:_account" mode="email">
    <xsl:variable name="naam">
      <xsl:choose>
        <xsl:when test="cv:name = 'Arend-Jan Bakker'">ArendJan Bakker</xsl:when>
        <xsl:when test="cv:name = 'Cees-Jan van Buuren'">CeesJan van Buuren</xsl:when>
        <xsl:when test="cv:name = 'Engin Işgüzar'">Engin Isguzar</xsl:when>
        <xsl:when test="cv:name = 'René Bouw'">Rene Bouw</xsl:when>
        <xsl:when test="cv:name = 'Tugay Üzinli'">Tugay Uzinli</xsl:when>
        <xsl:when test="cv:name = 'Valeria Esman-Huszak'">Valeria Huszak</xsl:when>
        <xsl:when test="cv:name = 'Youssef Aoulad Si Amar'">Youssef Aoulad</xsl:when>
        <xsl:otherwise><xsl:value-of select="cv:naam"/></xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:value-of select="concat(translate(translate($naam, ' ', ''), $LOWERCASE, $UPPERCASE), '@VALORI.NL')"/>
  </xsl:template>

  <xsl:template match="node()|text()|@*"/>

</xsl:stylesheet>