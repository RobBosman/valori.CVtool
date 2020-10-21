<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
    xmlns:cv="https://ns.bransom.nl/cerios/cv/v20110401"
    exclude-result-prefixes="cv"
    version="1.0">

  <xsl:variable name="LOWERCASE">abcdefghijklmnopqrstuvwxyz</xsl:variable>
  <xsl:variable name="UPPERCASE">ABCDEFGHIJKLMNOPQRSTUVWXYZ</xsl:variable>

  <xsl:template match="cv:persoonsgegevens" mode="full-name">
    <xsl:value-of select="cv:voornaam" />
    <xsl:if test="cv:tussenvoegsel">
      <xsl:text> </xsl:text>
      <xsl:value-of select="cv:tussenvoegsel" />
    </xsl:if>
    <xsl:text> </xsl:text>
    <xsl:value-of select="cv:achternaam" />
  </xsl:template>

  <xsl:template name="skill-level">
    <xsl:param name="level" />
    <w:r w:rsidR="00DE6855" w:rsidRPr="002271D3">
      <w:rPr>
        <w:rStyle w:val="Valori-niveau"/>
      </w:rPr>
      <w:t>
        <xsl:choose>
          <xsl:when test="$level = '1'"></xsl:when>
          <xsl:when test="$level = '2'"></xsl:when>
          <xsl:when test="$level = '3'"></xsl:when>
          <xsl:when test="$level = '4'"></xsl:when>
          <xsl:when test="$level = '5'"></xsl:when>
        </xsl:choose>
      </w:t>
    </w:r>
  </xsl:template>

  <xsl:template match="* | @* | text()" mode="markdown">
    <xsl:call-template name="format-markdown">
      <xsl:with-param name="text" select="." />
      <xsl:with-param name="listItemNumber">0</xsl:with-param>
    </xsl:call-template>
  </xsl:template>

  <xsl:template name="format-markdown">
    <xsl:param name="text" />
    <xsl:param name="listItemNumber" />
    <xsl:variable name="nextListItemNumber">
      <xsl:choose>
        <xsl:when test="starts-with($text, '# ')">
          <xsl:value-of select="$listItemNumber + 1" />
        </xsl:when>
        <xsl:otherwise>0</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="contains($text, '&#x0A;')">
        <xsl:call-template name="format-markdown-paragraph">
          <xsl:with-param name="text" select="substring-before($text, '&#x0A;')" />
          <xsl:with-param name="listItemNumber" select="$nextListItemNumber" />
        </xsl:call-template>
        <xsl:call-template name="format-markdown">
          <xsl:with-param name="text" select="substring-after($text, '&#x0A;')" />
          <xsl:with-param name="listItemNumber" select="$nextListItemNumber" />
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="format-markdown-paragraph">
          <xsl:with-param name="text" select="$text" />
          <xsl:with-param name="listItemNumber" select="$nextListItemNumber" />
        </xsl:call-template>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="format-markdown-paragraph">
    <xsl:param name="text" />
    <xsl:param name="listItemNumber" />
    <xsl:choose>
      <xsl:when test="starts-with($text, '* ')">
        <w:p w:rsidR="00181F85" w:rsidRPr="00181F85" w:rsidRDefault="00181F85" w:rsidP="00181F85">
          <w:pPr>
            <w:pStyle w:val="Lijst-bullets"/>
          </w:pPr>
          <w:r>
            <w:t><xsl:value-of select="substring($text, 3)" /></w:t>
          </w:r>
        </w:p>
      </xsl:when>
      <xsl:when test="starts-with($text, '# ')">
        <w:p w:rsidR="00DA0696" w:rsidRDefault="00DA0696" w:rsidP="00DA0696">
          <w:pPr>
            <w:pStyle w:val="Lijstalinea" />
          </w:pPr>
          <w:r>
            <w:t><xsl:value-of select="$listItemNumber" />.</w:t>
            <w:tab/>
            <w:t><xsl:value-of select="substring($text, 3)" /></w:t>
          </w:r>
        </w:p>
      </xsl:when>
      <xsl:when test="$text">
        <w:p w:rsidR="00EA114C" w:rsidRDefault="00EA114C" w:rsidP="004609AB">
          <w:pPr>
            <w:pStyle w:val="Paragraaf" />
          </w:pPr>
          <w:r>
            <w:t><xsl:value-of select="$text" /></w:t>
          </w:r>
        </w:p>
      </xsl:when>
    </xsl:choose>
  </xsl:template>
  
</xsl:stylesheet>