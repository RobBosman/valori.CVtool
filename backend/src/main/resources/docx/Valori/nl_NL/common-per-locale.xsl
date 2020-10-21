<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:cv="https://ns.bransom.nl/cerios/cv/v20110401"
    exclude-result-prefixes="cv"
    version="1.0">

  <xsl:import href="../common.xsl" />

  <xsl:param name="locale">nl_NL</xsl:param>

  <xsl:template match="* | @* | text()" mode="date-numeric">
    <xsl:value-of select="substring(., 9, 2)" />
    <xsl:text>-</xsl:text>
    <xsl:value-of select="substring(., 6, 2)" />
    <xsl:text>-</xsl:text>
    <xsl:value-of select="substring(., 1, 4)" />
  </xsl:template>

  <xsl:template match="* | @* | text()" mode="date-period">
    <xsl:value-of select="substring(., 6, 2)" />
    <xsl:text>-</xsl:text>
    <xsl:value-of select="substring(., 1, 4)" />
  </xsl:template>

  <xsl:template match="* | @* | text()" mode="linguistics-level">
    <xsl:choose>
      <xsl:when test=". = 1"></xsl:when>
      <xsl:when test=". = 2"></xsl:when>
      <xsl:when test=". = 3"></xsl:when>
      <xsl:when test=". = 4"></xsl:when>
      <xsl:when test=". = 5"></xsl:when>
      <xsl:when test=". = 6"></xsl:when>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="* | @* | text()" mode="skill-category">
    <xsl:value-of select="." />
  </xsl:template>

</xsl:stylesheet>