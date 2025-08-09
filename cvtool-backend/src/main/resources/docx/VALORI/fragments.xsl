<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
        xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
        version="1.0">

    <!-- NEWLINE -->
    <xsl:template name="newline">
        <w:br/>
    </xsl:template>

    <!-- MARKDOWN -->
    <xsl:template match="* | @* | text()" mode="markdown">
        <xsl:call-template name="format-markdown">
            <xsl:with-param name="text" select="."/>
            <xsl:with-param name="listItemNumber">0</xsl:with-param>
        </xsl:call-template>
    </xsl:template>

    <xsl:template name="format-markdown">
        <xsl:param name="text"/>
        <xsl:param name="listItemNumber"/>
        <xsl:variable name="nextListItemNumber">
            <xsl:choose>
                <xsl:when test="starts-with($text, '# ')">
                    <xsl:value-of select="$listItemNumber + 1"/>
                </xsl:when>
                <xsl:otherwise>0</xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:choose>
            <!-- Put text before and after newline in separate paragraphs. -->
            <xsl:when test="contains($text, '&#x0A;')">
                <xsl:call-template name="format-markdown-paragraph">
                    <xsl:with-param name="text" select="substring-before($text, '&#x0A;')"/>
                    <xsl:with-param name="listItemNumber" select="$nextListItemNumber"/>
                </xsl:call-template>
                <xsl:call-template name="format-markdown">
                    <xsl:with-param name="text" select="substring-after($text, '&#x0A;')"/>
                    <xsl:with-param name="listItemNumber" select="$nextListItemNumber"/>
                </xsl:call-template>
            </xsl:when>
            <!-- Put text in its own paragraph. -->
            <xsl:otherwise>
                <xsl:call-template name="format-markdown-paragraph">
                    <xsl:with-param name="text" select="$text"/>
                    <xsl:with-param name="listItemNumber" select="$nextListItemNumber"/>
                </xsl:call-template>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="format-markdown-paragraph">
        <xsl:param name="text"/>
        <xsl:param name="listItemNumber"/>
        <w:p w14:paraId="3FAFC2DF" w14:textId="4D7D9D0A" w:rsidR="00BB35DE" w:rsidRDefault="00D55949"
             w:rsidP="001730DD">
            <xsl:choose>
                <xsl:when test="substring($text, 1, 2) = '* '
                                or substring($text, 1, 2) = '- '
                                or substring($text, 1, 2) = '&#x2022; '
                                or substring($text, 1, 2) = '*&#x09;'
                                or substring($text, 1, 2) = '-&#x09;'
                                or substring($text, 1, 2) = '&#x2022;&#x09;'">
                    <w:pPr>
                        <w:pStyle w:val="Lijstalinea"/>
                        <w:numPr>
                            <w:ilvl w:val="0"/>
                            <w:numId w:val="18"/>
                        </w:numPr>
                    </w:pPr>
                    <w:r w:rsidRPr="00C14BDE">
                        <w:t>
                            <xsl:value-of select="substring($text, 3)"/>
                        </w:t>
                    </w:r>
                </xsl:when>
                <xsl:when test="starts-with($text, '# ')">
                    <w:pPr>
                        <w:ind w:left="534" w:hanging="364"/>
                    </w:pPr>
                    <w:r w:rsidRPr="00C14BDE">
                        <w:t>
                            <xsl:value-of select="concat($listItemNumber, '.')"/>
                        </w:t>
                        <w:tab/>
                        <w:t>
                            <xsl:value-of select="substring($text, 3)"/>
                        </w:t>
                    </w:r>
                </xsl:when>
                <xsl:otherwise>
                    <w:r>
                        <w:t>
                            <xsl:value-of select="$text"/>
                        </w:t>
                    </w:r>
                </xsl:otherwise>
            </xsl:choose>
        </w:p>
    </xsl:template>

</xsl:stylesheet>