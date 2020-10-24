<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
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

  <xsl:template match="* | @* | text()" mode="skill-category">
    <xsl:value-of select="." />
  </xsl:template>

</xsl:stylesheet>