<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:cv="https://ns.bransom.nl/cerios/cv/v20110401"
    version="1.0">

  <xsl:import href="common-per-locale.xsl" />

  <xsl:param name="layout" />

  <xsl:output method="text" encoding="UTF-8" />

  <xsl:template match="/">
    <xsl:text>CV_UK_</xsl:text>
    <xsl:value-of select="//cv:persoonsgegevens/cv:voornaam" />
    <xsl:value-of select="//cv:persoonsgegevens/cv:achternaam" />
  </xsl:template>

</xsl:stylesheet>