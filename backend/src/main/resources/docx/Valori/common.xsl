<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
    xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
    version="1.0">

  <!-- SKILL LEVEL -->
  <xsl:template match="* | @* | text()" mode="skill-level">
    <xsl:choose>
      <xsl:when test=". = 5"></xsl:when>
      <xsl:when test=". = 4"></xsl:when>
      <xsl:when test=". = 3"></xsl:when>
      <xsl:when test=". = 2"></xsl:when>
      <xsl:when test=". = 1"></xsl:when>
    </xsl:choose>
  </xsl:template>

  <!-- MARKDOWN -->
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
        <w:p w14:paraId="3FAFC2DF" w14:textId="4D7D9D0A" w:rsidR="00BB35DE" w:rsidRDefault="00D55949" w:rsidP="001730DD">
          <w:pPr>
            <w:pStyle w:val="Lijstalinea"/>
            <w:numPr>
              <w:ilvl w:val="0"/>
              <w:numId w:val="18"/>
            </w:numPr>
          </w:pPr>
          <w:r w:rsidRPr="00A52C14">
            <w:t><xsl:value-of select="substring($text, 3)" /></w:t>
          </w:r>
        </w:p>
      </xsl:when>
      <xsl:when test="starts-with($text, '# ')">
        <w:p w14:paraId="548A8F2F" w14:textId="0A8A5403" w:rsidR="00A52C14" w:rsidRDefault="0038710B" w:rsidP="0038710B">
          <w:pPr>
            <w:ind w:left="534" w:hanging="364"/>
          </w:pPr>
          <w:r w:rsidRPr="00A52C14">
            <w:t><xsl:value-of select="$listItemNumber" />.</w:t>
            <w:tab/>
            <w:t><xsl:value-of select="substring($text, 3)" /></w:t>
          </w:r>
        </w:p>
      </xsl:when>
      <xsl:otherwise>
        <w:p w14:paraId="3FAFC2DF" w14:textId="4D7D9D0A" w:rsidR="00BB35DE" w:rsidRDefault="00D55949" w:rsidP="001730DD">
          <w:r>
            <w:t><xsl:value-of select="$text" /></w:t>
          </w:r>
        </w:p>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
</xsl:stylesheet>