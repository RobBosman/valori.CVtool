<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:cv="https://ns.bransom.nl/valori/cv/v20250808.xsd"
        exclude-result-prefixes="cv"
        xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
        xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
        version="1.0">

    <xsl:import href="../translations.xsl"/>
    <xsl:import href="../mappings.xsl"/>

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
            <xsl:when test="contains($text, '&#x0A;')">
                <!-- Put text before and after newline in separate paragraphs. -->
                <xsl:call-template name="format-markdown-paragraph">
                    <xsl:with-param name="text" select="substring-before($text, '&#x0A;')"/>
                    <xsl:with-param name="listItemNumber" select="$nextListItemNumber"/>
                </xsl:call-template>
                <xsl:call-template name="format-markdown">
                    <xsl:with-param name="text" select="substring-after($text, '&#x0A;')"/>
                    <xsl:with-param name="listItemNumber" select="$nextListItemNumber"/>
                </xsl:call-template>
            </xsl:when>
            <xsl:otherwise>
                <!-- Put text in its own paragraph. -->
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
        <xsl:choose>
            <xsl:when test="substring($text, 1, 2) = '* '
                                or substring($text, 1, 2) = '- '
                                or substring($text, 1, 2) = '&#x2022; '
                                or substring($text, 1, 2) = '*&#x09;'
                                or substring($text, 1, 2) = '-&#x09;'
                                or substring($text, 1, 2) = '&#x2022;&#x09;'">
                <!-- bullet list item -->
                <w:p w14:paraId="3FAFC2DF" w14:textId="4D7D9D0A" w:rsidR="00BB35DE" w:rsidRDefault="00D55949"
                     w:rsidP="001730DD">
                    <w:pPr>
                        <w:pStyle w:val="Lijstalinea"/>
                        <w:numPr>
                            <w:ilvl w:val="0"/>
                            <w:numId w:val="18"/>
                        </w:numPr>
                    </w:pPr>
                    <w:proofErr w:type="spellStart"/>
                    <w:r w:rsidRPr="00C14BDE">
                        <w:t>
                            <xsl:value-of select="substring($text, 3)"/>
                        </w:t>
                    </w:r>
                    <w:proofErr w:type="spellEnd"/>
                </w:p>
            </xsl:when>
            <xsl:when test="starts-with($text, '# ')">
                <!-- numbered list item -->
                <w:p w14:paraId="3FAFC2DF" w14:textId="4D7D9D0A" w:rsidR="00BB35DE" w:rsidRDefault="00D55949"
                     w:rsidP="001730DD">
                    <w:pPr>
                        <w:ind w:left="534" w:hanging="364"/>
                    </w:pPr>
                    <w:proofErr w:type="spellStart"/>
                    <w:r w:rsidRPr="00C14BDE">
                        <w:t>
                            <xsl:value-of select="concat($listItemNumber, '.')"/>
                        </w:t>
                        <w:tab/>
                        <w:t>
                            <xsl:value-of select="substring($text, 3)"/>
                        </w:t>
                    </w:r>
                    <w:proofErr w:type="spellEnd"/>
                </w:p>
            </xsl:when>
            <xsl:otherwise>
                <!-- plain text; no list item -->
                <w:p w14:paraId="3FAFC2DF" w14:textId="4D7D9D0A" w:rsidR="00BB35DE" w:rsidRDefault="00D55949"
                     w:rsidP="001730DD">
                    <w:proofErr w:type="spellStart"/>
                    <w:r>
                        <w:t>
                            <xsl:value-of select="$text"/>
                        </w:t>
                    </w:r>
                    <w:proofErr w:type="spellEnd"/>
                </w:p>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <!-- SKILL SECTION -->
    <xsl:template name="skill-section">
        <xsl:param name="category"/>
        <xsl:variable name="skills" select="cv:skill[cv:includeInCv = 'true'][cv:category = $category]"/>
        <xsl:if test="$skills">
            <w:p w14:paraId="6097DCCD" w14:textId="4767636E" w:rsidR="00BF29B7" w:rsidRPr="00C14BDE"
                 w:rsidRDefault="008317EA" w:rsidP="00C14BDE">
                <w:pPr>
                    <w:pStyle w:val="Kop2"/>
                </w:pPr>
                <w:r>
                    <w:t>
                        <xsl:apply-templates select="$skills[1]/cv:category" mode="skill-category"/>
                    </w:t>
                </w:r>
            </w:p>
            <xsl:apply-templates select="$skills">
                <xsl:with-param name="last" select="count($skills)"/>
                <xsl:sort select="cv:skillLevel" data-type="number" order="descending"/>
                <xsl:sort select="cv:description"/>
            </xsl:apply-templates>
        </xsl:if>
    </xsl:template>

    <!-- SKILL CATEGORY -->
    <xsl:template match="* | @* | text()" mode="skill-category">
        <xsl:call-template name="translate">
            <xsl:with-param name="text">
                <xsl:choose>
                    <xsl:when test=". = 'LANGUAGES'">Talen</xsl:when>
                    <xsl:when test=". = 'BRANCHES'">Branches</xsl:when>
                    <xsl:when test=". = 'EXPERTISE'">Expertises</xsl:when>
                    <xsl:when test=". = 'DATABASES'">Databases</xsl:when>
                    <xsl:when test=". = 'APPLICATIONS'">Applicaties</xsl:when>
                    <xsl:when test=". = 'TOOLS'">Tools</xsl:when>
                    <xsl:when test=". = 'PROGRAMMING'">Programmeren</xsl:when>
                    <xsl:when test=". = 'METHODS'">Methodes</xsl:when>
                    <xsl:when test=". = 'OS_NETWORKS'">OS &amp; Netwerken</xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="."/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>

    <!-- SKILL -->
    <xsl:template match="cv:skill">
        <xsl:param name="last"/>
        <w:p w14:paraId="0F728A97" w14:textId="77777777" w:rsidR="000A5FCA" w:rsidRDefault="000A5FCA"
             w:rsidP="000A5FCA">
            <w:pPr>
                <w:pStyle w:val="Valori-blauw"/>
                <w:tabs>
                    <w:tab w:val="clear" w:pos="2835"/>
                    <w:tab w:val="right" w:pos="3071"/>
                </w:tabs>
                <w:rPr>
                    <w:rStyle w:val="Valori-niveau"/>
                </w:rPr>
                <w:keepLines/>
                <xsl:if test="position() != $last">
                    <w:keepNext/>
                </xsl:if>
            </w:pPr>
            <w:r w:rsidRPr="00752D43">
                <w:rPr>
                    <w:rStyle w:val="Valori-skillChar"/>
                </w:rPr>
                <w:t>
                    <xsl:call-template name="wrap-lines">
                        <xsl:with-param name="text" select="cv:description"/>
                        <xsl:with-param name="maxWidthMillis" select="number(42.0)"/>
                        <xsl:with-param name="newline">
                            <w:br/>
                        </xsl:with-param>
                    </xsl:call-template>
                </w:t>
                <w:tab/>
            </w:r>
            <w:r w:rsidRPr="00C14BDE">
                <w:rPr>
                    <w:rStyle w:val="Valori-niveau"/>
                </w:rPr>
                <w:t>
                    <xsl:apply-templates select="cv:skillLevel" mode="skill-level"/>
                </w:t>
            </w:r>
        </w:p>
    </xsl:template>

    <!-- EXPERIENCE - OVERVIEW -->
    <xsl:template match="cv:experience" mode="overview">
        <w:tr w:rsidR="00F15DA6" w14:paraId="6F0C0FFB" w14:textId="77777777" w:rsidTr="001860B4">
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="3071" w:type="dxa"/>
                </w:tcPr>
                <w:p w14:paraId="4BB31EAA" w14:textId="681AB43A" w:rsidR="00F15DA6" w:rsidRDefault="00F15DA6"
                     w:rsidP="001860B4">
                    <w:r w:rsidRPr="00F15DA6">
                        <w:t>
                            <xsl:call-template name="period">
                                <xsl:with-param name="periodBegin" select="cv:periodBegin"/>
                                <xsl:with-param name="periodEnd" select="cv:periodEnd"/>
                            </xsl:call-template>
                        </w:t>
                    </w:r>
                </w:p>
            </w:tc>
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="3071" w:type="dxa"/>
                </w:tcPr>
                <w:p w14:paraId="31AC2F55" w14:textId="399AB44B" w:rsidR="00F15DA6" w:rsidRDefault="001860B4"
                     w:rsidP="001860B4">
                    <w:r>
                        <w:t>
                            <xsl:value-of select="cv:role"/>
                        </w:t>
                    </w:r>
                </w:p>
            </w:tc>
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="3071" w:type="dxa"/>
                </w:tcPr>
                <w:p w14:paraId="35A0A5F9" w14:textId="7A864B0E" w:rsidR="00F15DA6" w:rsidRDefault="001860B4"
                     w:rsidP="001860B4">
                    <w:r>
                        <w:t>
                            <xsl:apply-templates select="." mode="client"/>
                        </w:t>
                    </w:r>
                </w:p>
            </w:tc>
        </w:tr>
    </xsl:template>

    <!-- EDUCATION -->
    <xsl:template match="cv:education">
        <w:tr w:rsidR="001860B4" w14:paraId="150F7FE7" w14:textId="77777777" w:rsidTr="000B7B5E">
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="3071" w:type="dxa"/>
                </w:tcPr>
                <w:p w14:paraId="028BDECC" w14:textId="0BDF33E7" w:rsidR="000A5FCA" w:rsidRDefault="000A5FCA"
                     w:rsidP="000B7B5E">
                    <w:r>
                        <w:t>
                            <xsl:value-of select="cv:name"/>
                        </w:t>
                    </w:r>
                </w:p>
            </w:tc>
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="3071" w:type="dxa"/>
                </w:tcPr>
                <w:p w14:paraId="4AEEE7FD" w14:textId="373E4A48" w:rsidR="001860B4" w:rsidRDefault="001860B4"
                     w:rsidP="000B7B5E">
                    <w:r>
                        <w:t>
                            <xsl:value-of select="cv:institution"/>
                        </w:t>
                    </w:r>
                </w:p>
            </w:tc>
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="3071" w:type="dxa"/>
                </w:tcPr>
                <w:p w14:paraId="4A46B160" w14:textId="391ADBDB" w:rsidR="001860B4" w:rsidRDefault="001860B4"
                     w:rsidP="000B7B5E">
                    <w:r>
                        <xsl:variable name="yearFrom" select="cv:yearFrom"/>
                        <xsl:variable name="yearTo" select="cv:yearTo"/>
                        <w:t>
                            <xsl:if test="$yearFrom">
                                <xsl:value-of select="$yearFrom"/>
                                <xsl:text xml:space="preserve"> – </xsl:text>
                            </xsl:if>
                            <xsl:choose>
                                <xsl:when test="$yearTo">
                                    <xsl:value-of select="$yearTo"/>
                                </xsl:when>
                                <xsl:otherwise>
                                    <xsl:call-template name="translate">
                                        <xsl:with-param name="text" select="'heden'"/>
                                    </xsl:call-template>
                                </xsl:otherwise>
                            </xsl:choose>
                        </w:t>
                    </w:r>
                    <w:r w:rsidRPr="001860B4">
                        <w:rPr>
                            <w:rStyle w:val="Valori-geel"/>
                        </w:rPr>
                        <w:t xml:space="preserve">&#xA0;// </w:t>
                    </w:r>
                    <w:r w:rsidRPr="00666ED6">
                        <w:t>
                            <xsl:apply-templates select="cv:result" mode="education-result"/>
                        </w:t>
                    </w:r>
                </w:p>
            </w:tc>
        </w:tr>
    </xsl:template>

    <!-- EDUCATION RESULT -->
    <xsl:template match="* | @* | text()" mode="education-result">
        <xsl:call-template name="translate">
            <xsl:with-param name="text">
                <xsl:choose>
                    <xsl:when test=". = 'DIPLOMA'">diploma</xsl:when>
                    <xsl:when test=". = 'CERTIFICATE'">certificaat</xsl:when>
                    <xsl:when test=". = 'ONGOING'">nog bezig</xsl:when>
                    <xsl:when test=". = 'CANCELED'">afgebroken</xsl:when>
                    <xsl:when test=". = 'NOT_APPLICABLE'">nvt</xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="."/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>

    <!-- TRAINING -->
    <xsl:template match="cv:training">
        <w:tr w:rsidR="001860B4" w14:paraId="150F7FE7" w14:textId="77777777" w:rsidTr="000B7B5E">
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="3071" w:type="dxa"/>
                </w:tcPr>
                <w:p w14:paraId="028BDECC" w14:textId="0BDF33E7" w:rsidR="000A5FCA" w:rsidRDefault="000A5FCA"
                     w:rsidP="000B7B5E">
                    <w:r>
                        <w:t>
                            <xsl:value-of select="cv:name"/>
                        </w:t>
                    </w:r>
                </w:p>
            </w:tc>
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="3071" w:type="dxa"/>
                </w:tcPr>
                <w:p w14:paraId="4AEEE7FD" w14:textId="373E4A48" w:rsidR="001860B4" w:rsidRDefault="001860B4"
                     w:rsidP="000B7B5E">
                    <w:r>
                        <w:t>
                            <xsl:value-of select="cv:institution"/>
                        </w:t>
                    </w:r>
                </w:p>
            </w:tc>
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="3071" w:type="dxa"/>
                </w:tcPr>
                <w:p w14:paraId="4A46B160" w14:textId="391ADBDB" w:rsidR="001860B4" w:rsidRDefault="001860B4"
                     w:rsidP="000B7B5E">
                    <w:r>
                        <w:t>
                            <xsl:choose>
                                <xsl:when test="cv:year">
                                    <xsl:value-of select="cv:year"/>
                                </xsl:when>
                                <xsl:otherwise>
                                    <xsl:call-template name="translate">
                                        <xsl:with-param name="text" select="'heden'"/>
                                    </xsl:call-template>
                                </xsl:otherwise>
                            </xsl:choose>
                        </w:t>
                    </w:r>
                    <w:r w:rsidRPr="001860B4">
                        <w:rPr>
                            <w:rStyle w:val="Valori-geel"/>
                        </w:rPr>
                        <w:t xml:space="preserve">&#xA0;// </w:t>
                    </w:r>
                    <w:r w:rsidRPr="00666ED6">
                        <w:t>
                            <xsl:apply-templates select="cv:result" mode="education-result"/>
                        </w:t>
                    </w:r>
                </w:p>
            </w:tc>
        </w:tr>
    </xsl:template>

    <!-- PUBLICATION -->
    <xsl:template match="cv:publication">
        <w:tr w:rsidR="001860B4" w14:paraId="2E94810F" w14:textId="77777777" w:rsidTr="001860B4">
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="3071" w:type="dxa"/>
                </w:tcPr>
                <w:p w14:paraId="5EC9DC18" w14:textId="73E77901" w:rsidR="001860B4" w:rsidRDefault="000A5FCA"
                     w:rsidP="000B7B5E">
                    <w:r>
                        <w:t>
                            <xsl:value-of select="cv:title"/>
                        </w:t>
                    </w:r>
                </w:p>
            </w:tc>
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="2363" w:type="dxa"/>
                </w:tcPr>
                <w:p w14:paraId="010D5F50" w14:textId="215C545B" w:rsidR="001860B4" w:rsidRDefault="001860B4"
                     w:rsidP="000B7B5E">
                    <w:r>
                        <w:t>
                            <xsl:value-of select="cv:media"/>
                        </w:t>
                    </w:r>
                </w:p>
            </w:tc>
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="708" w:type="dxa"/>
                </w:tcPr>
                <w:p w14:paraId="7CD275C5" w14:textId="2B1B7994" w:rsidR="001860B4" w:rsidRDefault="001860B4"
                     w:rsidP="000B7B5E">
                    <w:r>
                        <w:t>
                            <xsl:value-of select="cv:year"/>
                        </w:t>
                    </w:r>
                </w:p>
            </w:tc>
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="3071" w:type="dxa"/>
                </w:tcPr>
                <w:p w14:paraId="790E2453" w14:textId="0F2E4324" w:rsidR="001860B4" w:rsidRDefault="001860B4"
                     w:rsidP="000B7B5E">
                    <w:r>
                        <w:t>
                            <xsl:value-of select="cv:description"/>
                        </w:t>
                    </w:r>
                </w:p>
            </w:tc>
        </w:tr>
    </xsl:template>

    <!-- REFERENCE -->
    <xsl:template match="cv:reference">
        <w:tr w:rsidR="001860B4" w14:paraId="44A9A9D2" w14:textId="77777777" w:rsidTr="001860B4">
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="9213" w:type="dxa"/>
                </w:tcPr>
                <w:p w14:paraId="2D66D278" w14:textId="68175263" w:rsidR="001860B4" w:rsidRPr="00666ED6"
                     w:rsidRDefault="001860B4" w:rsidP="00666ED6">
                    <w:pPr>
                        <w:pStyle w:val="Kop2"/>
                        <w:outlineLvl w:val="1"/>
                    </w:pPr>
                    <w:r w:rsidRPr="00666ED6">
                        <xsl:if test="cv:year">
                            <w:t>
                                <xsl:value-of select="cv:year"/>
                            </w:t>
                            <w:t xml:space="preserve"> &#x2500; </w:t>
                        </xsl:if>
                        <w:t>
                            <xsl:value-of select="cv:referentName"/>
                        </w:t>
                        <w:t xml:space="preserve"> &#x2500; </w:t>
                        <w:t>
                            <xsl:value-of select="cv:referentFunction"/>
                        </w:t>
                        <xsl:if test="cv:client">
                            <w:t xml:space="preserve"> </w:t>
                            <w:t>
                                <xsl:value-of select="cv:client"/>
                            </w:t>
                        </xsl:if>
                    </w:r>
                </w:p>
            </w:tc>
        </w:tr>
        <w:tr w:rsidR="001860B4" w14:paraId="18A8EE06" w14:textId="77777777" w:rsidTr="001860B4">
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="9213" w:type="dxa"/>
                </w:tcPr>
                <xsl:apply-templates select="cv:description" mode="markdown"/>
            </w:tc>
        </w:tr>
    </xsl:template>

    <!-- EXPERIENCE -->
    <xsl:template match="cv:experience">
        <w:tr w:rsidR="00A52C14" w14:paraId="480B31F7" w14:textId="77777777" w:rsidTr="004D5885">
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="1972" w:type="dxa"/>
                </w:tcPr>
                <w:p w14:paraId="1F9BB23A" w14:textId="5CBB339A" w:rsidR="00A52C14" w:rsidRDefault="00A52C14"
                     w:rsidP="00666ED6">
                    <w:pPr>
                        <w:pStyle w:val="Valori-blauw"/>
                    </w:pPr>
                    <w:r>
                        <w:t>
                            <xsl:call-template name="period">
                                <xsl:with-param name="periodBegin" select="cv:periodBegin"/>
                                <xsl:with-param name="periodEnd" select="cv:periodEnd"/>
                            </xsl:call-template>
                        </w:t>
                    </w:r>
                </w:p>
                <w:p w14:paraId="2AD5877B" w14:textId="77777777" w:rsidR="00A52C14" w:rsidRPr="00A52C14"
                     w:rsidRDefault="00A52C14" w:rsidP="00666ED6">
                    <w:pPr>
                        <w:rPr>
                            <w:rStyle w:val="Valori-geel"/>
                        </w:rPr>
                    </w:pPr>
                    <w:r w:rsidRPr="00A52C14">
                        <w:rPr>
                            <w:rStyle w:val="Valori-geel"/>
                        </w:rPr>
                        <w:t>
                            <xsl:value-of select="cv:role"/>
                        </w:t>
                    </w:r>
                </w:p>
                <w:p w14:paraId="533DCC22" w14:textId="190759EB" w:rsidR="00A52C14" w:rsidRDefault="00A52C14"
                     w:rsidP="00666ED6">
                    <w:r w:rsidRPr="00A52C14">
                        <w:rPr>
                            <w:rStyle w:val="Valori-geel"/>
                        </w:rPr>
                        <w:t>
                            <xsl:apply-templates select="." mode="client"/>
                        </w:t>
                    </w:r>
                </w:p>
            </w:tc>
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="7241" w:type="dxa"/>
                    <w:tcMar>
                        <w:left w:w="113" w:type="dxa"/>
                    </w:tcMar>
                </w:tcPr>
                <xsl:variable name="assignment" select="cv:assignment"/>
                <xsl:apply-templates select="$assignment" mode="markdown"/>
                <xsl:variable name="activities" select="cv:activities"/>
                <xsl:if test="$activities">
                    <w:p w14:paraId="4C066476" w14:textId="77777777" w:rsidR="00A52C14" w:rsidRDefault="00A52C14"
                         w:rsidP="00A52C14">
                        <w:pPr>
                            <w:pStyle w:val="Paragraaf"/>
                        </w:pPr>
                        <w:r>
                            <w:rPr>
                                <w:rStyle w:val="Valori-geel"/>
                            </w:rPr>
                            <w:t>
                                <xsl:call-template name="translate">
                                    <xsl:with-param name="text" select="'Taken/werkzaamheden'"/>
                                </xsl:call-template>
                                <xsl:text>:</xsl:text>
                            </w:t>
                        </w:r>
                    </w:p>
                    <xsl:apply-templates select="$activities" mode="markdown"/>
                </xsl:if>
                <xsl:variable name="results" select="cv:results"/>
                <xsl:if test="$results">
                    <w:p w14:paraId="05A636A2" w14:textId="77777777" w:rsidR="00A52C14" w:rsidRPr="00C97881"
                         w:rsidRDefault="00A52C14" w:rsidP="00A52C14">
                        <w:pPr>
                            <w:pStyle w:val="Paragraaf"/>
                        </w:pPr>
                        <w:r>
                            <w:rPr>
                                <w:rStyle w:val="Valori-geel"/>
                            </w:rPr>
                            <w:t>
                                <xsl:call-template name="translate">
                                    <xsl:with-param name="text" select="'Resultaat'"/>
                                </xsl:call-template>
                                <xsl:text>:</xsl:text>
                            </w:t>
                        </w:r>
                    </w:p>
                    <xsl:apply-templates select="$results" mode="markdown"/>
                </xsl:if>
                <xsl:variable name="keywords" select="cv:keywords"/>
                <xsl:if test="$keywords">
                    <w:p w14:paraId="62A3EFF7" w14:textId="77777777" w:rsidR="00A52C14" w:rsidRPr="00C97881"
                         w:rsidRDefault="00A52C14" w:rsidP="00A52C14">
                        <w:pPr>
                            <w:pStyle w:val="Paragraaf"/>
                        </w:pPr>
                        <w:r>
                            <w:rPr>
                                <w:rStyle w:val="Valori-geel"/>
                            </w:rPr>
                            <w:t>
                                <xsl:call-template name="translate">
                                    <xsl:with-param name="text" select="'Werkomgeving'"/>
                                </xsl:call-template>
                                <xsl:text>:</xsl:text>
                            </w:t>
                        </w:r>
                    </w:p>
                    <xsl:apply-templates select="$keywords" mode="markdown"/>
                </xsl:if>
                <xsl:if test="not($assignment) and not($activities) and not($results) and not($keywords)">
                    <w:p w14:paraId="62A3EFF7" w14:textId="77777777" w:rsidR="00A52C14" w:rsidRPr="00C97881"
                         w:rsidRDefault="00A52C14" w:rsidP="00A52C14">
                        <w:pPr>
                            <w:pStyle w:val="Paragraaf"/>
                        </w:pPr>
                        <w:r/>
                    </w:p>
                </xsl:if>
            </w:tc>
        </w:tr>
    </xsl:template>

</xsl:stylesheet>