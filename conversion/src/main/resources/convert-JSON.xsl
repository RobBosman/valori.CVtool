<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:cv="https://ns.bransom.nl/cerios/cv/v20110401"
    xmlns:util="nl.valori.cvtool.XslUtil"
    exclude-result-prefixes="cv"
    version="1.0">

  <xsl:output method="text" encoding="utf-8" omit-xml-declaration="yes" indent="yes"/>

  <xsl:template match="/">
    {
      "account": {
        <xsl:apply-templates select="cv:_account"/>
      },
      "businessUnit": {
        <xsl:apply-templates select="cv:_account/cv:businessunit"/>
      },
      "cv": {
        <xsl:apply-templates select="cv:_account/cv:cv"/>
      },
      "education": {
        <xsl:apply-templates select="cv:_account/cv:cv/cv:opleiding"/>
      },
      "publication": {
        <xsl:apply-templates select="cv:_account/cv:cv/cv:publicatie"/>
      },
      "reference": {
        <xsl:apply-templates select="cv:_account/cv:cv/cv:referentie"/>
      },
      "skill": {
        <xsl:apply-templates select="cv:_account/cv:cv/cv:talenkennis|cv:_account/cv:cv/cv:branchekennis|cv:_account/cv:cv/cv:vaardigheid"/>
      },
      "experience" : {
        <xsl:apply-templates select="cv:_account/cv:cv/cv:werkopdracht"/>
      }
    }
  </xsl:template>

  <xsl:template match="cv:_account">
    <xsl:variable name="_id" select="util:uuid(@id)"/>
    "<xsl:value-of select="$_id"/>": {
      "id": "<xsl:value-of select="$_id"/>",
      "name": "<xsl:value-of select="cv:name"/>",
      "email": "<xsl:value-of select="translate(cv:name, ' ', '')"/>@valori.nl",
      "dateOfBirth": "<xsl:value-of select="cv:cv/cv:persoonsgegevens/cv:geboortedatum"/>",
      "residence": "<xsl:value-of select="cv:cv/cv:persoonsgegevens/cv:woonplaats"/>",
      "privileges": [
      <xsl:for-each select="cv:rol/cv:naam">
        <xsl:if test="position() > 1">
          <xsl:text>,</xsl:text>
        </xsl:if>
        <xsl:choose>
          <xsl:when test=". = 'view alle CVs'">"ADMIN"</xsl:when>
          <xsl:otherwise>"CONSULTANT"</xsl:otherwise>
        </xsl:choose>
      </xsl:for-each>
      ],
      "businessUnitIds": [
        <xsl:for-each select="cv:businessunit">
          "<xsl:value-of select="util:uuid(@id)"/>"
        </xsl:for-each>
      ]
    }
  </xsl:template>

  <xsl:template match="cv:businessunit">
    <xsl:variable name="_id" select="util:uuid(@id)"/>
    "<xsl:value-of select="$_id"/>": {
      "id": "<xsl:value-of select="$_id"/>",
      "name": "<xsl:value-of select="cv:naam"/>",
      "contactName": "<xsl:value-of select="cv:manager_naam"/>",
      "contactEmail": "<xsl:value-of select="cv:manager_email"/>",
      "contactPhone": "<xsl:value-of select="cv:manager_telefoonnummer"/>"
    }
  </xsl:template>

  <xsl:template match="cv:cv">
    <xsl:variable name="_id" select="util:uuid(@id)"/>
    "<xsl:value-of select="$_id"/>": {
      "_id": "<xsl:value-of select="$_id"/>",
      "accountId": "<xsl:value-of select="util:uuid(../@id)"/>",
      <xsl:if test="cv:persoonsgegevens/cv:functie_titel">
        "role": {
          "nl_NL": "<xsl:value-of select="util:jsonText(cv:persoonsgegevens/cv:functie_titel)"/>"
        },
      </xsl:if>
      "profile": {
        <xsl:for-each select="cv:profiel">
          <xsl:variable name="profileText">
            <xsl:value-of select="util:jsonText(cv:profiel)"/>
            <xsl:text>&#x0A;&#x0A;</xsl:text>
            <xsl:value-of select="util:jsonText(cv:persoonlijke_eigenschappen)"/>
            <xsl:text>&#x0A;&#x0A;</xsl:text>
            <xsl:value-of select="util:jsonText(cv:vaardigheden)"/>
          </xsl:variable>
          <xsl:if test="normalize-space($profileText) != ''">
            "<xsl:value-of select="cv:locale"/>": "<xsl:value-of select="util:jsonText($profileText)"/>",
          </xsl:if>
        </xsl:for-each>
      },
      <xsl:if test="cv:profiel/cv:interesses">
        "interests": {
          <xsl:for-each select="cv:profiel">
            <xsl:if test="cv:interesses">
              "<xsl:value-of select="cv:locale"/>": "<xsl:value-of select="util:jsonText(cv:interesses)"/>"
            </xsl:if>
          </xsl:for-each>
        },
      </xsl:if>
      "workingSince" : <xsl:value-of select="cv:persoonsgegevens/cv:werkervaring_sinds"/>,
      "inItSince" : <xsl:value-of select="cv:persoonsgegevens/cv:it_ervaring_sinds"/>
    }
  </xsl:template>

  <xsl:template match="cv:opleiding">
    <xsl:variable name="_id" select="util:uuid(@id)"/>
    "<xsl:value-of select="$_id"/>": {
      "_id": "<xsl:value-of select="$_id"/>",
      "cvId": "<xsl:value-of select="util:uuid(../@id)"/>",
      "type": "<xsl:apply-templates mode="educationType" select="cv:soort_opleiding"/>",
      "name": {
        "nl_NL": "<xsl:value-of select="util:jsonText(cv:naam_opleiding)"/>"
      },
      "institution": "<xsl:value-of select="util:jsonText(cv:naam_instituut)"/>",
      "result": "<xsl:apply-templates mode="educationResult" select="cv:diploma"/>",
      "year": <xsl:value-of select="cv:jaar_diploma"/>
    },
  </xsl:template>

  <xsl:template match="cv:publicatie">
    <xsl:variable name="_id" select="util:uuid(@id)"/>
    "<xsl:value-of select="$_id"/>": {
      "_id": "<xsl:value-of select="$_id"/>",
      "cvId": "<xsl:value-of select="util:uuid(../@id)"/>",
      "year": <xsl:value-of select="cv:jaar"/>,
      "media": "<xsl:value-of select="util:jsonText(cv:media)"/>",
      "title": {
        "nl_NL": "<xsl:value-of select="util:jsonText(cv:titel)"/>"
      },
      "description": {
        <xsl:if test="cv:omschrijving_nl_NL">
          "nl_NL": "<xsl:value-of select="util:jsonText(cv:omschrijving_nl_NL)"/>",
        </xsl:if>
        <xsl:if test="cv:omschrijving_uk_UK">
          "uk_UK": "<xsl:value-of select="util:jsonText(cv:omschrijving_uk_UK)"/>",
        </xsl:if>
      },
      "includeInCv": true
    },
  </xsl:template>

  <xsl:template match="cv:referentie">
    <xsl:variable name="_id" select="util:uuid(@id)"/>
    "<xsl:value-of select="$_id"/>": {
      "_id": "<xsl:value-of select="$_id"/>",
      "cvId": "<xsl:value-of select="util:uuid(../@id)"/>",
      "referentName": "<xsl:value-of select="util:jsonText(cv:naam_referent)"/>",
      "referentFunction": {
        <xsl:if test="cv:functie_referent_nl_NL">
          "nl_NL": "<xsl:value-of select="util:jsonText(cv:functie_referent_nl_NL)"/>",
        </xsl:if>
        <xsl:if test="cv:functie_referent_uk_UK">
          "uk_UK": "<xsl:value-of select="util:jsonText(cv:functie_referent_uk_UK)"/>",
        </xsl:if>
      },
      "description": {
        <xsl:if test="cv:omschrijving_nl_NL">
          "nl_NL": "<xsl:value-of select="util:jsonText(cv:omschrijving_nl_NL)"/>",
        </xsl:if>
        <xsl:if test="cv:omschrijving_uk_UK">
          "uk_UK": "<xsl:value-of select="util:jsonText(cv:omschrijving_uk_UK)"/>",
        </xsl:if>
      },
      "includeInCv": <xsl:apply-templates mode="toBoolean" select="cv:opnemen_in_cv"/>
    },
  </xsl:template>

  <xsl:template match="cv:talenkennis">
    <xsl:variable name="_id" select="util:uuid(@id)"/>
    "<xsl:value-of select="$_id"/>": {
      "_id": "<xsl:value-of select="$_id"/>",
      "cvId": "<xsl:value-of select="util:uuid(../@id)"/>",
      "category": "LANGUAGES",
      "description": {
        <xsl:if test="cv:taal_NL">
          "nl_NL": "<xsl:value-of select="cv:taal_NL"/>",
        </xsl:if>
        <xsl:if test="cv:taal_UK">
          "uk_UK": "<xsl:value-of select="cv:taal_UK"/>"
        </xsl:if>
      },
      "skillLevel": <xsl:apply-templates mode="languageLevel" select="cv:mondeling"/>
    },
  </xsl:template>

  <xsl:template match="cv:branchekennis">
    <xsl:variable name="_id" select="util:uuid(@id)"/>
    "<xsl:value-of select="$_id"/>": {
    "cvId": "<xsl:value-of select="util:uuid(../@id)"/>",
    "category": "BRANCHES",
    "description": {
      <xsl:if test="cv:omschrijving_NL">
        "nl_NL": "<xsl:value-of select="util:jsonText(cv:omschrijving_NL)"/>",
      </xsl:if>
      <xsl:if test="cv:omschrijving_UK">
        "uk_UK": "<xsl:value-of select="util:jsonText(cv:omschrijving_UK)"/>"
      </xsl:if>
    },
    "skillLevel": <xsl:value-of select="cv:kennisniveau"/>
    },
  </xsl:template>

  <xsl:template match="cv:vaardigheid">
    <xsl:variable name="_id" select="util:uuid(@id)"/>
    "<xsl:value-of select="$_id"/>": {
      "_id": "<xsl:value-of select="$_id"/>",
      "cvId": "<xsl:value-of select="util:uuid(../@id)"/>",
      "category": "<xsl:apply-templates mode="convertCategory" select="cv:categorie"/>",
      "description": "<xsl:value-of select="cv:omschrijving"/>",
      "skillLevel": <xsl:value-of select="cv:kennisniveau"/>
    },
  </xsl:template>

  <xsl:template match="cv:werkopdracht">
    <xsl:variable name="_id" select="util:uuid(@id)"/>
    "<xsl:value-of select="$_id"/>": {
      "_id": "<xsl:value-of select="$_id"/>",
      "cvId": "<xsl:value-of select="util:uuid(../@id)"/>",
      "periodBegin": "<xsl:value-of select="cv:periode_begin"/>",
      "periodEnd": "<xsl:value-of select="cv:periode_eind"/>",
      "client": "<xsl:value-of select="util:jsonText(cv:opdrachtgever)"/>",
      "employer": "<xsl:value-of select="util:jsonText(cv:werkgever)"/>",
      <xsl:if test="cv:werkervaring/cv:rol">
        "role": {
          <xsl:for-each select="cv:werkervaring">
            <xsl:if test="cv:rol">
              "<xsl:value-of select="cv:locale"/>": "<xsl:value-of select="util:jsonText(cv:rol)"/>",
            </xsl:if>
          </xsl:for-each>
        },
      </xsl:if>
      <xsl:if test="cv:werkervaring/cv:opdrachtformulering">
        "assignment": {
          <xsl:for-each select="cv:werkervaring">
            <xsl:if test="cv:opdrachtformulering">
              "<xsl:value-of select="cv:locale"/>": "<xsl:value-of select="util:jsonText(cv:opdrachtformulering)"/>",
            </xsl:if>
          </xsl:for-each>
        },
      </xsl:if>
      <xsl:if test="cv:werkervaring/cv:werkzaamheden">
        "activities": {
          <xsl:for-each select="cv:werkervaring">
            <xsl:if test="cv:werkzaamheden">
              "<xsl:value-of select="cv:locale"/>": "<xsl:value-of select="util:jsonText(cv:werkzaamheden)"/>",
            </xsl:if>
          </xsl:for-each>
        },
      </xsl:if>
      <xsl:if test="cv:werkervaring/cv:resultaat">
        "results": {
          <xsl:for-each select="cv:werkervaring">
            <xsl:if test="cv:resultaat">
              "<xsl:value-of select="cv:locale"/>": "<xsl:value-of select="util:jsonText(cv:resultaat)"/>",
            </xsl:if>
          </xsl:for-each>
        },
      </xsl:if>
      <xsl:if test="cv:werkervaring/cv:steekwoorden">
        "keywords": {
          <xsl:for-each select="cv:werkervaring">
            <xsl:if test="cv:steekwoorden">
              "<xsl:value-of select="cv:locale"/>": "<xsl:value-of select="util:jsonText(cv:steekwoorden)"/>",
            </xsl:if>
          </xsl:for-each>
        },
      </xsl:if>
      "sortIndex": <xsl:value-of select="cv:sort_index"/>,
      "includeInCv": <xsl:apply-templates mode="toBoolean" select="cv:opnemen_in_cv"/>
    },
  </xsl:template>

  <xsl:template match="*" mode="educationType">
    <xsl:choose>
      <xsl:when test=". = 1">TRAINING</xsl:when>
      <xsl:otherwise>EDUCATION</xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="*" mode="educationResult">
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
      <xsl:when test=". = 1">5</xsl:when>
      <xsl:when test=". = 2">5</xsl:when>
      <xsl:when test=". = 3">4</xsl:when>
      <xsl:when test=". = 4">3</xsl:when>
      <xsl:when test=". = 5">2</xsl:when>
      <xsl:otherwise>1</xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="text()" mode="convertCategory">
    <xsl:choose>
      <xsl:when test=". = 'Applicaties'">APPLICATIONS</xsl:when>
      <xsl:when test=". = 'Databases'">DATABASES</xsl:when>
      <xsl:when test=". = 'Expertises'">EXPERTISE</xsl:when>
      <xsl:when test=". = 'Methodes'">METHODS</xsl:when>
      <xsl:when test=". = 'OS en Netwerken'">OS_NETWORKS</xsl:when>
      <xsl:when test=". = 'Programmeren'">PROGRAMMING</xsl:when>
      <xsl:when test=". = 'Tools'">TOOLS</xsl:when>
      <xsl:otherwise><xsl:value-of select="."/></xsl:otherwise> <!-- Certificeringen -->
    </xsl:choose>
  </xsl:template>

  <xsl:template match="*" mode="toBoolean">
    <xsl:choose>
      <xsl:when test=". = 1">true</xsl:when>
      <xsl:otherwise>false</xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="node()|text()|@*"/>

</xsl:stylesheet>