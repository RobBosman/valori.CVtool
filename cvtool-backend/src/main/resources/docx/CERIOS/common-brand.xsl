<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:cv="https://ns.bransom.nl/valori/cv/v20250808.xsd"
        xmlns:w="http://purl.oclc.org/ooxml/wordprocessingml/main"
        xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
        xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
        xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml"
        xmlns:wp="http://purl.oclc.org/ooxml/drawingml/wordprocessingDrawing"
        xmlns:a="http://purl.oclc.org/ooxml/drawingml/main"
        version="1.0">

    <!--
        Parameter 'cv_locale' is used to select the nl_NL or uk_UK version of a text node.
        If cv_locale is 'uk_UK' but no uk_UK node is available, then nl_NL is used as a fallback.
        It is set in the top-level XSL stylesheet and picked-up here.
    -->
    <xsl:param name="cv_locale"/>

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
        <xsl:choose>
            <!-- bullet list item -->
            <xsl:when test="substring($text, 1, 2) = '* '
                                or substring($text, 1, 2) = '- '
                                or substring($text, 1, 2) = '&#x2022; '
                                or substring($text, 1, 2) = '*&#x09;'
                                or substring($text, 1, 2) = '-&#x09;'
                                or substring($text, 1, 2) = '&#x2022;&#x09;'">
                <w:p w14:paraId="4DB0632C" w14:textId="542F4402" w:rsidR="00B2333C"
                     w:rsidRPr="00DE51B1" w:rsidRDefault="00B2333C" w:rsidP="00B2333C">
                    <w:pPr>
                        <w:numPr>
                            <w:ilvl w:val="0"/>
                            <w:numId w:val="7"/>
                        </w:numPr>
                        <w:spacing w:line="12pt" w:lineRule="auto"/>
                        <w:rPr>
                            <w:rFonts w:ascii="Plus Jakarta Sans"
                                      w:hAnsi="Plus Jakarta Sans"/>
                            <w:color w:val="212B46"/>
                            <w:sz w:val="18"/>
                            <w:szCs w:val="18"/>
                        </w:rPr>
                    </w:pPr>
                    <w:proofErr w:type="spellStart"/>
                    <w:r w:rsidRPr="00DE51B1">
                        <w:rPr>
                            <w:rFonts w:ascii="Plus Jakarta Sans"
                                      w:hAnsi="Plus Jakarta Sans"/>
                            <w:color w:val="212B46"/>
                            <w:sz w:val="18"/>
                            <w:szCs w:val="18"/>
                        </w:rPr>
                        <w:t>
                            <xsl:value-of select="substring($text, 3)"/>
                        </w:t>
                    </w:r>
                    <w:proofErr w:type="spellEnd"/>
                </w:p>
            </xsl:when>
            <!-- numbered list item -->
            <xsl:when test="starts-with($text, '# ')">
                <w:p w14:paraId="1E4DCC74" w14:textId="190F3819" w:rsidR="0004532F"
                     w:rsidRDefault="0004532F" w:rsidP="000E5868">
                    <w:pPr>
                        <w:pStyle w:val="BasicParagraph"/>
                        <w:suppressAutoHyphens/>
                        <w:ind w:left="534" w:hanging="364"/>
                    </w:pPr>
                    <w:proofErr w:type="spellStart"/>
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
                    <w:proofErr w:type="spellEnd"/>
                </w:p>
            </xsl:when>
            <xsl:otherwise>
                <!-- plain text; no list item -->
                <w:p w14:paraId="1E4DCC74" w14:textId="190F3819" w:rsidR="0004532F"
                     w:rsidRDefault="0004532F" w:rsidP="000E5868">
                    <w:pPr>
                        <w:pStyle w:val="BasicParagraph"/>
                        <w:suppressAutoHyphens/>
                        <w:rPr>
                            <w:rFonts w:ascii="PlusJakartaSans-Regular"
                                      w:hAnsi="PlusJakartaSans-Regular"
                                      w:cs="PlusJakartaSans-Regular"/>
                            <w:sz w:val="18"/>
                            <w:szCs w:val="18"/>
                        </w:rPr>
                    </w:pPr>
                    <w:proofErr w:type="spellStart"/>
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
            <w:p w14:paraId="497BF54D" w14:textId="51366089" w:rsidR="00462426"
                 w:rsidRPr="00D51FD7" w:rsidRDefault="00462426"
                 w:rsidP="00F503A0">
                <w:pPr>
                    <w:pStyle w:val="BasicParagraph"/>
                    <w:spacing w:line="13.80pt" w:lineRule="auto"/>
                    <w:noProof/>
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
                    <w:noProof/>
                </w:rPr>
                <w:tabs>
                    <w:tab w:val="clear" w:pos="134.70pt"/>
                    <w:tab w:val="end" w:pos="163.05pt"/>
                </w:tabs>
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
                </w:rPr>
                <w:t>
                    <xsl:call-template name="wrap-description">
                        <xsl:with-param name="text" select="cv:description/cv:nl_NL"/>
                        <xsl:with-param name="maxWidthMillis" select="number(60.0)"/>
                        <xsl:with-param name="newline">
                            <w:br/>
                        </xsl:with-param>
                    </xsl:call-template>
                </w:t>
            </w:r>
            <w:r w:rsidR="00545E7E" w:rsidRPr="00545E7E">
                <w:rPr>
                    <w:rStyle w:val="Valori-niveau"/>
                    <w:color w:val="55DD94"/>
                </w:rPr>
                <w:tab/>
                <w:t>
                    <xsl:apply-templates select="cv:skillLevel" mode="skill-level"/>
                </w:t>
            </w:r>
        </w:p>
    </xsl:template>

    <!-- EDUCATION -->
    <xsl:template match="cv:education">
        <w:tr w:rsidR="001405E4" w14:paraId="64B68484" w14:textId="5BEC4AB8" w:rsidTr="000A0E47">
            <w:trPr>
                <w:trHeight w:val="14"/>
            </w:trPr>
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="202.25pt" w:type="dxa"/>
                    <w:tcBorders>
                        <w:bottom w:val="single" w:sz="4" w:space="0" w:color="55DD94"/>
                    </w:tcBorders>
                    <w:vAlign w:val="center"/>
                </w:tcPr>
                <w:p w14:paraId="338DD9C1" w14:textId="7DCE8498" w:rsidR="001405E4" w:rsidRPr="00CA43CD"
                     w:rsidRDefault="001405E4" w:rsidP="001405E4">
                    <w:pPr>
                        <w:pStyle w:val="BasicParagraph"/>
                        <w:keepLines/>
                    </w:pPr>
                    <w:r w:rsidRPr="00CA43CD">
                        <w:rPr>
                            <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                            <w:sz w:val="18"/>
                            <w:szCs w:val="16"/>
                        </w:rPr>
                        <w:t>
                            <xsl:apply-templates select="cv:name" mode="localized"/>
                        </w:t>
                    </w:r>
                </w:p>
            </w:tc>
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="156.30pt" w:type="dxa"/>
                    <w:tcBorders>
                        <w:bottom w:val="single" w:sz="4" w:space="0" w:color="55DD94"/>
                    </w:tcBorders>
                    <w:vAlign w:val="center"/>
                </w:tcPr>
                <w:p w14:paraId="42C3C744" w14:textId="76C1C097" w:rsidR="001405E4" w:rsidRPr="00CA43CD"
                     w:rsidRDefault="001405E4" w:rsidP="001405E4">
                    <w:pPr>
                        <w:pStyle w:val="BasicParagraph"/>
                    </w:pPr>
                    <w:r w:rsidRPr="00CA43CD">
                        <w:rPr>
                            <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                            <w:sz w:val="18"/>
                            <w:szCs w:val="16"/>
                        </w:rPr>
                        <w:t>
                            <xsl:value-of select="cv:institution"/>
                        </w:t>
                    </w:r>
                </w:p>
            </w:tc>
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="83.80pt" w:type="dxa"/>
                    <w:tcBorders>
                        <w:bottom w:val="single" w:sz="4" w:space="0" w:color="55DD94"/>
                    </w:tcBorders>
                    <w:vAlign w:val="center"/>
                </w:tcPr>
                <w:p w14:paraId="6BC06187" w14:textId="77777777" w:rsidR="001405E4" w:rsidRPr="00CA43CD"
                     w:rsidRDefault="001405E4" w:rsidP="001405E4">
                    <w:pPr>
                        <w:pStyle w:val="BasicParagraph"/>
                    </w:pPr>
                    <w:r w:rsidRPr="00CA43CD">
                        <xsl:variable name="yearFrom" select="cv:yearFrom"/>
                        <xsl:variable name="yearTo" select="cv:yearTo"/>
                        <w:rPr>
                            <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                            <w:sz w:val="18"/>
                            <w:szCs w:val="16"/>
                        </w:rPr>
                        <w:t>
                            <xsl:if test="$yearFrom">
                                <xsl:value-of select="$yearFrom"/>
                                <xsl:text xml:space="preserve"> – </xsl:text>
                            </xsl:if>
                            <xsl:choose>
                                <xsl:when test="$yearTo">
                                    <xsl:value-of select="$yearTo"/>
                                </xsl:when>
                                <xsl:otherwise>heden</xsl:otherwise>
                            </xsl:choose>
                        </w:t>
                    </w:r>
                </w:p>
            </w:tc>
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="83.80pt" w:type="dxa"/>
                    <w:tcBorders>
                        <w:bottom w:val="single" w:sz="4" w:space="0" w:color="55DD94"/>
                    </w:tcBorders>
                    <w:vAlign w:val="center"/>
                </w:tcPr>
                <w:p w14:paraId="12FB4C37" w14:textId="5EECAC13" w:rsidR="001405E4" w:rsidRPr="00CA43CD"
                     w:rsidRDefault="001405E4" w:rsidP="001405E4">
                    <w:pPr>
                        <w:pStyle w:val="BasicParagraph"/>
                    </w:pPr>
                    <w:r w:rsidRPr="00CA43CD">
                        <w:rPr>
                            <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                            <w:sz w:val="18"/>
                            <w:szCs w:val="16"/>
                        </w:rPr>
                        <w:t>
                            <xsl:apply-templates select="cv:result" mode="education-result"/>
                        </w:t>
                    </w:r>
                </w:p>
            </w:tc>
        </w:tr>
    </xsl:template>

    <!-- TRAINING -->
    <xsl:template match="cv:training">
        <w:tr w:rsidR="001405E4" w14:paraId="381BD1A4" w14:textId="2753382C" w:rsidTr="001405E4">
            <w:trPr>
                <w:trHeight w:val="14"/>
            </w:trPr>
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="202.25pt" w:type="dxa"/>
                    <w:tcBorders>
                        <w:bottom w:val="single" w:sz="4" w:space="0" w:color="55DD94"/>
                    </w:tcBorders>
                    <w:vAlign w:val="center"/>
                </w:tcPr>
                <w:p w14:paraId="4E8FC99E" w14:textId="6D870EF7" w:rsidR="001405E4" w:rsidRPr="00CA43CD"
                     w:rsidRDefault="001405E4" w:rsidP="001405E4">
                    <w:pPr>
                        <w:pStyle w:val="Pa0"/>
                        <w:keepLines/>
                    </w:pPr>
                    <w:r w:rsidRPr="00CA43CD">
                        <w:rPr>
                            <w:sz w:val="18"/>
                            <w:szCs w:val="18"/>
                        </w:rPr>
                        <w:t>
                            <xsl:apply-templates select="cv:name" mode="localized"/>
                        </w:t>
                    </w:r>
                </w:p>
            </w:tc>
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="156.30pt" w:type="dxa"/>
                    <w:tcBorders>
                        <w:bottom w:val="single" w:sz="4" w:space="0" w:color="55DD94"/>
                    </w:tcBorders>
                    <w:vAlign w:val="center"/>
                </w:tcPr>
                <w:p w14:paraId="315B4A13" w14:textId="71560C11" w:rsidR="001405E4" w:rsidRPr="00CA43CD"
                     w:rsidRDefault="001405E4" w:rsidP="001405E4">
                    <w:pPr>
                        <w:pStyle w:val="Pa0"/>
                    </w:pPr>
                    <w:r w:rsidRPr="00CA43CD">
                        <w:rPr>
                            <w:sz w:val="18"/>
                            <w:szCs w:val="18"/>
                        </w:rPr>
                        <w:t>
                            <xsl:value-of select="cv:institution"/>
                        </w:t>
                    </w:r>
                </w:p>
            </w:tc>
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="83.80pt" w:type="dxa"/>
                    <w:tcBorders>
                        <w:bottom w:val="single" w:sz="4" w:space="0" w:color="55DD94"/>
                    </w:tcBorders>
                    <w:vAlign w:val="center"/>
                </w:tcPr>
                <w:p w14:paraId="16358336" w14:textId="77777777" w:rsidR="001405E4" w:rsidRPr="00CA43CD"
                     w:rsidRDefault="001405E4" w:rsidP="001405E4">
                    <w:pPr>
                    </w:pPr>
                    <w:r w:rsidRPr="00CA43CD">
                        <w:rPr>
                            <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                            <w:sz w:val="18"/>
                            <w:szCs w:val="18"/>
                        </w:rPr>
                        <w:t>
                            <xsl:choose>
                                <xsl:when test="cv:year">
                                    <xsl:value-of select="cv:year"/>
                                </xsl:when>
                                <xsl:otherwise>heden</xsl:otherwise>
                            </xsl:choose>
                        </w:t>
                    </w:r>
                </w:p>
            </w:tc>
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="83.80pt" w:type="dxa"/>
                    <w:tcBorders>
                        <w:bottom w:val="single" w:sz="4" w:space="0" w:color="55DD94"/>
                    </w:tcBorders>
                </w:tcPr>
                <w:p w14:paraId="3E9EB30C" w14:textId="37F00EB5" w:rsidR="001405E4" w:rsidRPr="00CA43CD"
                     w:rsidRDefault="001405E4" w:rsidP="001405E4">
                    <w:r w:rsidRPr="00CA43CD">
                        <w:rPr>
                            <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                            <w:sz w:val="18"/>
                            <w:szCs w:val="18"/>
                        </w:rPr>
                        <w:t>
                            <xsl:apply-templates select="cv:result" mode="education-result"/>
                        </w:t>
                    </w:r>
                </w:p>
            </w:tc>
        </w:tr>
    </xsl:template>

    <!-- EXPERIENCE -->
    <xsl:template match="cv:experience">
        <w:p w14:paraId="6B031F37" w14:textId="07FFD1E2" w:rsidR="00B2333C" w:rsidRDefault="00CC7FCE"
             w:rsidP="00B2333C">
            <w:r>
                <w:rPr>
                    <w:noProof/>
                </w:rPr>
                <w:drawing>
                    <wp:inline distT="0" distB="0" distL="0" distR="0" wp14:anchorId="3F6C22CD" wp14:editId="0D488227">
                        <wp:extent cx="6667500" cy="3567430"/>
                        <wp:effectExtent l="0" t="0" r="0" b="0"/>
                        <wp:docPr id="1868590632" name="Text Box 9"/>
                        <wp:cNvGraphicFramePr/>
                        <a:graphic>
                            <a:graphicData uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                <wp:wsp>
                                    <wp:cNvSpPr txBox="1"/>
                                    <wp:spPr>
                                        <a:xfrm>
                                            <a:off x="0" y="0"/>
                                            <a:ext cx="6667500" cy="3567430"/>
                                        </a:xfrm>
                                        <a:prstGeom prst="rect">
                                            <a:avLst/>
                                        </a:prstGeom>
                                        <a:solidFill>
                                            <a:schemeClr val="bg1">
                                                <a:lumMod val="95%"/>
                                            </a:schemeClr>
                                        </a:solidFill>
                                        <a:ln w="6350">
                                            <a:noFill/>
                                        </a:ln>
                                    </wp:spPr>
                                    <wp:txbx>
                                        <wne:txbxContent>
                                            <w:p w14:paraId="71D1695A" w14:textId="0B233B53" w:rsidR="00B2333C"
                                                 w:rsidRPr="00DE51B1" w:rsidRDefault="00B2333C" w:rsidP="00B2333C">
                                                <w:pPr>
                                                    <w:rPr>
                                                        <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                  w:hAnsi="Plus Jakarta Sans"/>
                                                        <w:color w:val="212B46"/>
                                                    </w:rPr>
                                                </w:pPr>
                                                <w:r w:rsidRPr="00DE51B1">
                                                    <w:rPr>
                                                        <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                  w:hAnsi="Plus Jakarta Sans"/>
                                                        <w:b/>
                                                        <w:bCs/>
                                                        <w:color w:val="212B46"/>
                                                    </w:rPr>
                                                    <w:t>
                                                        <xsl:apply-templates select="cv:periodBegin" mode="date-year"/>
                                                    </w:t>
                                                </w:r>
                                                <w:r w:rsidRPr="00DE51B1">
                                                    <w:rPr>
                                                        <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                  w:hAnsi="Plus Jakarta Sans"/>
                                                        <w:color w:val="55DD94"/>
                                                    </w:rPr>
                                                    <w:t xml:space="preserve"> — </w:t>
                                                </w:r>
                                                <w:r w:rsidRPr="00DE51B1">
                                                    <w:rPr>
                                                        <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                  w:hAnsi="Plus Jakarta Sans"/>
                                                        <w:b/>
                                                        <w:bCs/>
                                                        <w:color w:val="212B46"/>
                                                    </w:rPr>
                                                    <w:t>
                                                        <xsl:choose>
                                                            <xsl:when test="cv:periodEnd">
                                                                <xsl:apply-templates select="cv:periodEnd"
                                                                                     mode="date-year"/>
                                                            </xsl:when>
                                                            <xsl:otherwise>
                                                                <xsl:apply-templates select="." mode="date-today"/>
                                                            </xsl:otherwise>
                                                        </xsl:choose>
                                                    </w:t>
                                                </w:r>
                                                <w:r w:rsidRPr="00DE51B1">
                                                    <w:rPr>
                                                        <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                  w:hAnsi="Plus Jakarta Sans"/>
                                                        <w:color w:val="55DD94"/>
                                                    </w:rPr>
                                                    <w:t xml:space="preserve"> | </w:t>
                                                </w:r>
                                                <w:r w:rsidRPr="00DE51B1">
                                                    <w:rPr>
                                                        <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                  w:hAnsi="Plus Jakarta Sans"/>
                                                        <w:b/>
                                                        <w:bCs/>
                                                        <w:color w:val="212B46"/>
                                                    </w:rPr>
                                                    <w:t>
                                                        <xsl:apply-templates select="." mode="client"/>
                                                    </w:t>
                                                </w:r>
                                            </w:p>
                                            <w:p w14:paraId="1C2DEC96" w14:textId="21912888" w:rsidR="00B2333C"
                                                 w:rsidRPr="00DE51B1" w:rsidRDefault="00B2333C" w:rsidP="00B2333C">
                                                <w:r w:rsidRPr="00DE51B1">
                                                    <w:rPr>
                                                        <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                  w:hAnsi="Plus Jakarta Sans"/>
                                                        <w:color w:val="212B46"/>
                                                        <w:sz w:val="18"/>
                                                        <w:szCs w:val="18"/>
                                                    </w:rPr>
                                                    <w:t>
                                                        <xsl:apply-templates select="cv:role" mode="localized"/>
                                                    </w:t>
                                                </w:r>
                                            </w:p>
                                            <xsl:variable name="assignment" select="cv:assignment/cv:nl_NL"/>
                                            <w:p w14:paraId="4F4CEE96" w14:textId="4FCDD30D" w:rsidR="00B2333C"
                                                 w:rsidRPr="00DE51B1" w:rsidRDefault="00B2333C" w:rsidP="00B2333C">
                                                <w:r w:rsidRPr="00DE51B1">
                                                    <w:rPr>
                                                        <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                  w:hAnsi="Plus Jakarta Sans"/>
                                                        <w:b/>
                                                        <w:bCs/>
                                                        <w:color w:val="212B46"/>
                                                        <w:sz w:val="22"/>
                                                        <w:szCs w:val="22"/>
                                                    </w:rPr>
                                                    <w:t>Situatie</w:t>
                                                </w:r>
                                            </w:p>
                                            <xsl:apply-templates select="$assignment" mode="markdown"/>
                                            <xsl:variable name="activities" select="cv:activities/cv:nl_NL"/>
                                            <xsl:if test="$activities">
                                                <w:p w14:paraId="6736B730" w14:textId="3D978164" w:rsidR="00B2333C"
                                                     w:rsidRPr="00DE51B1" w:rsidRDefault="00B2333C" w:rsidP="00B2333C">
                                                    <w:pPr>
                                                        <w:spacing w:before="8pt"/>
                                                    </w:pPr>
                                                    <w:r w:rsidRPr="00DE51B1">
                                                        <w:rPr>
                                                            <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                      w:hAnsi="Plus Jakarta Sans"/>
                                                            <w:b/>
                                                            <w:bCs/>
                                                            <w:color w:val="212B46"/>
                                                            <w:sz w:val="22"/>
                                                            <w:szCs w:val="22"/>
                                                        </w:rPr>
                                                        <w:t>Taken</w:t>
                                                    </w:r>
                                                </w:p>
                                                <xsl:apply-templates select="$activities" mode="markdown"/>
                                            </xsl:if>
                                            <xsl:variable name="results" select="cv:results/cv:nl_NL"/>
                                            <xsl:if test="$results">
                                                <w:p w14:paraId="76E931EB" w14:textId="6471A0AC" w:rsidR="00B2333C"
                                                     w:rsidRPr="00DE51B1" w:rsidRDefault="00B2333C"
                                                     w:rsidP="00B2333C">
                                                    <w:pPr>
                                                        <w:spacing w:before="8pt"/>
                                                    </w:pPr>
                                                    <w:r w:rsidRPr="00DE51B1">
                                                        <w:rPr>
                                                            <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                      w:hAnsi="Plus Jakarta Sans"/>
                                                            <w:b/>
                                                            <w:bCs/>
                                                            <w:color w:val="212B46"/>
                                                            <w:sz w:val="22"/>
                                                            <w:szCs w:val="22"/>
                                                        </w:rPr>
                                                        <w:t>Resultaten</w:t>
                                                    </w:r>
                                                </w:p>
                                                <xsl:apply-templates select="$results" mode="markdown"/>
                                            </xsl:if>
                                            <xsl:variable name="keywords" select="cv:keywords/cv:nl_NL"/>
                                            <xsl:if test="$keywords">
                                                <w:p w14:paraId="22A70B22" w14:textId="6254D1F5" w:rsidR="00B2333C"
                                                     w:rsidRPr="00DE51B1" w:rsidRDefault="00B2333C" w:rsidP="00B2333C">
                                                    <w:pPr>
                                                        <w:spacing w:before="8pt"/>
                                                    </w:pPr>
                                                    <w:r w:rsidRPr="00DE51B1">
                                                        <w:rPr>
                                                            <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                      w:hAnsi="Plus Jakarta Sans"/>
                                                            <w:b/>
                                                            <w:bCs/>
                                                            <w:color w:val="212B46"/>
                                                            <w:sz w:val="21"/>
                                                            <w:szCs w:val="21"/>
                                                        </w:rPr>
                                                        <w:t>Technologie &amp; tools</w:t>
                                                    </w:r>
                                                </w:p>
                                                <xsl:apply-templates select="$keywords" mode="markdown"/>
                                            </xsl:if>
                                        </wne:txbxContent>
                                    </wp:txbx>
                                    <wp:bodyPr rot="0" spcFirstLastPara="0" vertOverflow="overflow"
                                               horzOverflow="overflow" vert="horz" wrap="square" lIns="90000"
                                               tIns="90000" rIns="90000" bIns="90000" numCol="1" spcCol="0"
                                               rtlCol="0" fromWordArt="0" anchor="ctr" anchorCtr="0" forceAA="0"
                                               compatLnSpc="1">
                                        <a:prstTxWarp prst="textNoShape">
                                            <a:avLst/>
                                        </a:prstTxWarp>
                                        <a:spAutoFit/>
                                    </wp:bodyPr>
                                </wp:wsp>
                            </a:graphicData>
                        </a:graphic>
                    </wp:inline>
                </w:drawing>
                <w:br/>
            </w:r>
        </w:p>
    </xsl:template>

    <!-- EXPERIENCE OVERVIEW -->
    <xsl:template match="cv:experience" mode="overview">
        <w:tr w:rsidR="001405E4" w14:paraId="4FC5C810" w14:textId="7D0C3EB0" w:rsidTr="001405E4">
            <w:trPr>
                <w:trHeight w:val="14"/>
            </w:trPr>
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="67.70pt" w:type="dxa"/>
                    <w:tcBorders>
                        <w:bottom w:val="single" w:sz="4" w:space="0" w:color="55DD94"/>
                        <w:end w:val="single" w:sz="4" w:space="0" w:color="55DD94"/>
                    </w:tcBorders>
                    <w:vAlign w:val="center"/>
                </w:tcPr>
                <w:p w14:paraId="112EB434" w14:textId="705A12EB" w:rsidR="001405E4" w:rsidRPr="00CA43CD"
                     w:rsidRDefault="001405E4" w:rsidP="001405E4">
                    <w:pPr>
                        <w:pStyle w:val="BasicParagraph"/>
                        <w:rPr>
                            <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                            <w:sz w:val="18"/>
                            <w:szCs w:val="16"/>
                        </w:rPr>
                    </w:pPr>
                    <w:r>
                        <w:t>
                            <xsl:apply-templates select="cv:periodBegin" mode="date-period"/>
                        </w:t>
                    </w:r>
                </w:p>
            </w:tc>
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="104.20pt" w:type="dxa"/>
                    <w:tcBorders>
                        <w:start w:val="single" w:sz="4" w:space="0" w:color="55DD94"/>
                        <w:bottom w:val="single" w:sz="4" w:space="0" w:color="55DD94"/>
                    </w:tcBorders>
                    <w:vAlign w:val="center"/>
                </w:tcPr>
                <w:p w14:paraId="47C3E883" w14:textId="775EF887" w:rsidR="001405E4" w:rsidRPr="00CA43CD"
                     w:rsidRDefault="001405E4" w:rsidP="001405E4">
                    <w:pPr>
                        <w:pStyle w:val="BasicParagraph"/>
                        <w:rPr>
                            <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                            <w:sz w:val="18"/>
                            <w:szCs w:val="16"/>
                        </w:rPr>
                    </w:pPr>
                    <w:r>
                        <w:t>
                            <xsl:apply-templates select="cv:periodEnd" mode="date-period"/>
                        </w:t>
                    </w:r>
                </w:p>
            </w:tc>
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="176pt" w:type="dxa"/>
                    <w:tcBorders>
                        <w:bottom w:val="single" w:sz="4" w:space="0" w:color="55DD94"/>
                    </w:tcBorders>
                    <w:vAlign w:val="center"/>
                </w:tcPr>
                <w:p w14:paraId="41BBB737" w14:textId="77777777" w:rsidR="001405E4" w:rsidRPr="00CA43CD"
                     w:rsidRDefault="001405E4" w:rsidP="001405E4">
                    <w:pPr>
                        <w:pStyle w:val="BasicParagraph"/>
                        <w:keepLines/>
                        <w:rPr>
                            <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                            <w:sz w:val="18"/>
                            <w:szCs w:val="16"/>
                        </w:rPr>
                    </w:pPr>
                    <w:r>
                        <w:t>
                            <xsl:apply-templates select="." mode="client"/>
                        </w:t>
                    </w:r>
                </w:p>
            </w:tc>
            <w:tc>
                <w:tcPr>
                    <w:tcW w:w="176pt" w:type="dxa"/>
                    <w:tcBorders>
                        <w:bottom w:val="single" w:sz="4" w:space="0" w:color="55DD94"/>
                    </w:tcBorders>
                    <w:vAlign w:val="center"/>
                </w:tcPr>
                <w:p w14:paraId="59CDE4CA" w14:textId="662830AA" w:rsidR="001405E4"
                     w:rsidRDefault="001405E4"
                     w:rsidP="001405E4">
                    <w:pPr>
                        <w:pStyle w:val="BasicParagraph"/>
                        <w:keepLines/>
                        <w:rPr>
                            <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                            <w:sz w:val="18"/>
                            <w:szCs w:val="16"/>
                        </w:rPr>
                    </w:pPr>
                    <w:r>
                        <w:t>
                            <xsl:apply-templates select="cv:role" mode="localized"/>
                        </w:t>
                    </w:r>
                </w:p>
            </w:tc>
        </w:tr>
    </xsl:template>

    <!-- PUBLICATION -->
    <xsl:template match="cv:publication">
        <w:p w14:paraId="723A7055" w14:textId="6537F84F" w:rsidR="00CC7FCE" w:rsidRPr="00CC7FCE"
             w:rsidRDefault="00CC7FCE" w:rsidP="00CC7FCE">
            <w:pPr>
                <w:spacing w:before="12pt"/>
            </w:pPr>
            <w:r w:rsidRPr="00CC7FCE">
                <w:rPr>
                    <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                    <w:b/>
                    <w:bCs/>
                    <w:color w:val="212B46"/>
                </w:rPr>
                <w:t>
                    <xsl:value-of select="cv:year"/>
                </w:t>
            </w:r>
            <w:r w:rsidRPr="00CC7FCE">
                <w:rPr>
                    <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                    <w:color w:val="55DD94"/>
                </w:rPr>
                <w:t xml:space="preserve"> | </w:t>
            </w:r>
            <w:r w:rsidRPr="00CC7FCE">
                <w:rPr>
                    <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                    <w:b/>
                    <w:bCs/>
                    <w:color w:val="212B46"/>
                </w:rPr>
                <w:t>
                    <xsl:value-of select="cv:media"/>
                </w:t>
            </w:r>
            <w:r w:rsidRPr="00CC7FCE">
                <w:rPr>
                    <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                    <w:color w:val="55DD94"/>
                </w:rPr>
                <w:t xml:space="preserve"> | </w:t>
            </w:r>
            <w:r w:rsidRPr="00CC7FCE">
                <w:rPr>
                    <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                    <w:b/>
                    <w:bCs/>
                    <w:color w:val="212B46"/>
                </w:rPr>
                <w:t>
                    <xsl:apply-templates select="cv:title" mode="localized"/>
                </w:t>
            </w:r>
        </w:p>
        <w:p w14:paraId="1E4DCC74" w14:textId="190F3819" w:rsidR="0004532F"
             w:rsidRDefault="0004532F" w:rsidP="000E5868">
            <w:pPr>
                <w:pStyle w:val="BasicParagraph"/>
                <w:spacing w:after="12pt"/>
                <w:ind w:end="276.65pt"/>
                <w:suppressAutoHyphens/>
                <w:rPr>
                    <w:rFonts w:ascii="PlusJakartaSans-Regular"
                              w:hAnsi="PlusJakartaSans-Regular"
                              w:cs="PlusJakartaSans-Regular"/>
                    <w:sz w:val="18"/>
                    <w:szCs w:val="18"/>
                </w:rPr>
            </w:pPr>
            <w:proofErr w:type="spellStart"/>
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
                    <xsl:apply-templates select="cv:description" mode="localized"/>
                </w:t>
            </w:r>
            <w:proofErr w:type="spellEnd"/>
        </w:p>
    </xsl:template>

    <!-- REFERENCE -->
    <xsl:template match="cv:reference">
        <w:p w14:paraId="723A7055" w14:textId="6537F84F" w:rsidR="00CC7FCE" w:rsidRPr="00CC7FCE"
             w:rsidRDefault="00CC7FCE" w:rsidP="00CC7FCE">
            <w:pPr>
                <w:spacing w:before="12pt"/>
            </w:pPr>
            <xsl:if test="cv:year">
                <w:r w:rsidRPr="00CC7FCE">
                    <w:rPr>
                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                        <w:b/>
                        <w:bCs/>
                        <w:color w:val="212B46"/>
                    </w:rPr>
                    <w:t>
                        <xsl:value-of select="cv:year"/>
                    </w:t>
                </w:r>
                <w:r w:rsidRPr="00CC7FCE">
                    <w:rPr>
                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                        <w:color w:val="55DD94"/>
                    </w:rPr>
                    <w:t xml:space="preserve"> | </w:t>
                </w:r>
            </xsl:if>
            <w:r w:rsidRPr="00CC7FCE">
                <w:rPr>
                    <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                    <w:b/>
                    <w:bCs/>
                    <w:color w:val="212B46"/>
                </w:rPr>
                <w:t>
                    <xsl:value-of select="cv:referentName"/>
                </w:t>
            </w:r>
            <w:r w:rsidRPr="00CC7FCE">
                <w:rPr>
                    <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                    <w:color w:val="55DD94"/>
                </w:rPr>
                <w:t xml:space="preserve"> | </w:t>
            </w:r>
            <w:r w:rsidRPr="00CC7FCE">
                <w:rPr>
                    <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                    <w:b/>
                    <w:bCs/>
                    <w:color w:val="212B46"/>
                </w:rPr>
                <w:t>
                    <xsl:apply-templates select="cv:referentFunction" mode="localized"/>
                </w:t>
                <xsl:if test="cv:client">
                    <w:t xml:space="preserve"> </w:t>
                    <w:t>
                        <xsl:value-of select="cv:client"/>
                    </w:t>
                </xsl:if>
            </w:r>
        </w:p>
        <w:p w14:paraId="1E4DCC74" w14:textId="190F3819" w:rsidR="0004532F"
             w:rsidRDefault="0004532F" w:rsidP="000E5868">
            <w:pPr>
                <w:pStyle w:val="BasicParagraph"/>
                <w:spacing w:after="12pt"/>
                <w:ind w:end="276.65pt"/>
                <w:suppressAutoHyphens/>
                <w:rPr>
                    <w:rFonts w:ascii="PlusJakartaSans-Regular"
                              w:hAnsi="PlusJakartaSans-Regular"
                              w:cs="PlusJakartaSans-Regular"/>
                    <w:sz w:val="18"/>
                    <w:szCs w:val="18"/>
                </w:rPr>
            </w:pPr>
            <w:proofErr w:type="spellStart"/>
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
                    <xsl:apply-templates select="cv:description" mode="localized"/>
                </w:t>
            </w:r>
            <w:proofErr w:type="spellEnd"/>
        </w:p>
    </xsl:template>

</xsl:stylesheet>