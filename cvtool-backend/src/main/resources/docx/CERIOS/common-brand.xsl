<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:cv="https://ns.bransom.nl/valori/cv/v20201130.xsd"
        xmlns:w="http://purl.oclc.org/ooxml/wordprocessingml/main"
        xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
        version="1.0">

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
        <w:p w14:paraId="1E4DCC74" w14:textId="190F3819" w:rsidR="0004532F"
             w:rsidRDefault="0004532F" w:rsidP="000E5868">
            <w:pPr>
                <w:pStyle w:val="BasicParagraph"/>
                <w:suppressAutoHyphens/>
                <w:rPr>
                    <w:rFonts w:ascii="PlusJakartaSans-Regular"
                              w:hAnsi="PlusJakartaSans-Regular"
                              w:cs="PlusJakartaSans-Regular"/>
                    <w:color w:val="212B46"/>
                    <w:sz w:val="18"/>
                    <w:szCs w:val="18"/>
                </w:rPr>
            </w:pPr>
            <xsl:choose>
                <xsl:when test="substring($text, 1, 2) = '* '
                                or substring($text, 1, 2) = '- '
                                or substring($text, 1, 2) = '&#x2022; '
                                or substring($text, 1, 2) = '*&#x09;'
                                or substring($text, 1, 2) = '-&#x09;'
                                or substring($text, 1, 2) = '&#x2022;&#x09;'">
                    <w:rPr>
                        <w:rFonts w:ascii="PlusJakartaSans-Regular"
                                  w:hAnsi="PlusJakartaSans-Regular"
                                  w:cs="PlusJakartaSans-Regular"/>
                        <w:color w:val="212B46"/>
                        <w:sz w:val="18"/>
                        <w:szCs w:val="18"/>
                    </w:rPr>
                    <w:r>
                        <w:t>
                            <xsl:value-of select="substring($text, 3)"/>
                        </w:t>
                    </w:r>
                </xsl:when>
                <xsl:when test="starts-with($text, '# ')">
                    <w:pPr>
                        <w:ind w:left="534" w:hanging="364"/>
                    </w:pPr>
                    <w:r>
                        <w:rPr>
                            <w:rFonts w:ascii="PlusJakartaSans-Regular"
                                      w:hAnsi="PlusJakartaSans-Regular"
                                      w:cs="PlusJakartaSans-Regular"/>
                            <w:color w:val="212B46"/>
                            <w:sz w:val="18"/>
                            <w:szCs w:val="18"/>
                        </w:rPr>
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
                        <w:rPr>
                            <w:rFonts w:ascii="PlusJakartaSans-Regular"
                                      w:hAnsi="PlusJakartaSans-Regular"
                                      w:cs="PlusJakartaSans-Regular"/>
                            <w:color w:val="212B46"/>
                            <w:sz w:val="18"/>
                            <w:szCs w:val="18"/>
                        </w:rPr>
                        <w:t>
                            <xsl:value-of select="$text"/>
                        </w:t>
                    </w:r>
                </xsl:otherwise>
            </xsl:choose>
        </w:p>
    </xsl:template>

    <!-- SKILL SECTION -->
    <xsl:template name="skill-section">
        <xsl:param name="category"/>
        <xsl:variable name="skills" select="cv:skill[cv:includeInCv = 'true'][cv:category = $category]"/>
        <xsl:if test="$skills">
            <w:p w14:paraId="497BF54D" w14:textId="51366089" w:rsidR="00462426"
                 w:rsidRPr="00D51FD7" w:rsidRDefault="00462426"
                 w:rsidP="00F503A0">
                <w:pPr>
                    <w:pStyle w:val="BasicParagraph"/>
                    <w:spacing w:line="13.80pt" w:lineRule="auto"/>
                    <w:rPr>
                        <w:rStyle w:val="A1"/>
                    </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="00D51FD7">
                    <w:rPr>
                        <w:rStyle w:val="A1"/>
                    </w:rPr>
                    <w:t>
                        <xsl:apply-templates select="$skills[1]/cv:category" mode="skill-category"/>
                    </w:t>
                </w:r>
            </w:p>
            <xsl:apply-templates select="$skills">
                <xsl:with-param name="last" select="count($skills)"/>
                <xsl:sort select="cv:skillLevel" data-type="number" order="descending"/>
                <xsl:sort select="cv:description/cv:nl_NL"/>
            </xsl:apply-templates>
            <!-- Add a newline after the last skill of this category. -->
            <w:br/>
        </xsl:if>
    </xsl:template>

    <!-- SKILL -->
    <xsl:template match="cv:skill">
        <xsl:param name="last"/>
        <w:p w14:paraId="337E615E" w14:textId="7B810E7F" w:rsidR="00462426"
             w:rsidRPr="00545E7E" w:rsidRDefault="00462426"
             w:rsidP="00D51FD7">
            <w:pPr>
                <w:pStyle w:val="Niveau"/>
                <w:rPr>
                    <w:color w:val="000000" w:themeColor="text1"/>
                </w:rPr>
                <w:keepLines/>
                <xsl:if test="position() != $last">
                    <w:keepNext/>
                </xsl:if>
            </w:pPr>
            <w:r w:rsidRPr="00462426">
                <w:rPr>
                    <w:rFonts w:ascii="Plus Jakarta Sans"
                              w:hAnsi="Plus Jakarta Sans"
                              w:cs="Plus Jakarta Sans"/>
                    <w:color w:val="212B46"/>
                    <w:lang w:val="en-GB"/>
                </w:rPr>
                <w:t>
                    <xsl:call-template name="wrap-skill-description">
                        <xsl:with-param name="text" select="cv:description/cv:nl_NL"/>
                        <xsl:with-param name="newline"><w:br/></xsl:with-param>
                    </xsl:call-template>
                </w:t>
                <w:tab/>
            </w:r>
            <w:r w:rsidR="00545E7E" w:rsidRPr="00545E7E">
                <w:rPr>
                    <w:rStyle w:val="Valori-niveau"/>
                    <w:color w:val="55DD94"/>
                </w:rPr>
                <w:t>
                    <xsl:apply-templates select="cv:skillLevel" mode="skill-level"/>
                </w:t>
            </w:r>
        </w:p>
    </xsl:template>

</xsl:stylesheet>