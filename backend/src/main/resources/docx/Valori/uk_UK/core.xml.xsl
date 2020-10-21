<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:cv="https://ns.bransom.nl/cerios/cv/v20110401"
    exclude-result-prefixes="cv"
    version="1.0">

  <xsl:import href="common-per-locale.xsl" />

  <xsl:output method="xml" standalone="yes" encoding="UTF-8" indent="no" />

  <xsl:template match="/">
    <cp:coreProperties
        xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
        xmlns:dc="http://purl.org/dc/elements/1.1/"
        xmlns:dcterms="http://purl.org/dc/terms/"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      <dc:title>
        <xsl:text>Curriculum vitae</xsl:text>
        <xsl:if test="//cv:persoonsgegevens">
          <xsl:text> - </xsl:text>
          <xsl:apply-templates select="//cv:persoonsgegevens" mode="full-name" />
        </xsl:if>
      </dc:title>
      <dc:subject>Curriculum vitae</dc:subject>
      <dc:creator>Valori CVtool</dc:creator>
      <cp:revision>1</cp:revision>
      <dcterms:created xsi:type="dcterms:W3CDTF"><xsl:value-of select="/cv:*/@at" /></dcterms:created>
    </cp:coreProperties>
  </xsl:template>

</xsl:stylesheet>