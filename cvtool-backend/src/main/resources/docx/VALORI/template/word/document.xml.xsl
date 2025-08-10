<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:cv="https://ns.bransom.nl/valori/cv/v20250808.xsd"
        exclude-result-prefixes="cv"
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
        xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
        xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
        xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
        version="1.0">

    <xsl:import href="../../../common.xsl"/>
    <xsl:import href="../../translations.xsl"/>
    <xsl:import href="../../mappings.xsl"/>
    <xsl:import href="../../fragments.xsl"/>

    <xsl:output method="xml" standalone="yes" encoding="UTF-8" indent="no"/>

    <xsl:template match="/">
        <xsl:apply-templates select="cv:root"/>
    </xsl:template>

    <xsl:template match="cv:root">
        <w:document mc:Ignorable="w14">
            <w:body>
                <!--

                PROFILE

                -->
                <xsl:variable name="profile" select="cv:characteristics[cv:includeInCv = 'true']/cv:profile"/>
                <xsl:if test="$profile">
                    <w:p w14:paraId="3BF04214" w14:textId="77777777" w:rsidR="00D55949" w:rsidRDefault="00D55949"
                         w:rsidP="00D55949">
                        <w:pPr>
                            <w:pStyle w:val="Kop1"/>
                            <w:spacing w:after="60"/>
                        </w:pPr>
                        <w:r w:rsidRPr="00D55949">
                            <w:t>Profielschets</w:t>
                        </w:r>
                    </w:p>
                    <xsl:apply-templates select="$profile" mode="markdown"/>
                </xsl:if>
                <!--

                SKILLS

                -->
                <w:p w14:paraId="6DD8B0DA" w14:textId="3ABD36DD" w:rsidR="00475635" w:rsidRDefault="00BF29B7"
                     w:rsidP="00302F10">
                    <w:pPr>
                        <w:pStyle w:val="Kop1"/>
                    </w:pPr>
                    <w:r>
                        <w:t>Kennis &amp; vaardigheden</w:t>
                    </w:r>
                </w:p>
                <w:p w14:paraId="295EA1F8" w14:textId="77777777" w:rsidR="00BF29B7" w:rsidRDefault="00BF29B7"
                     w:rsidP="00BB35DE">
                    <w:pPr>
                        <w:sectPr w:rsidR="00BF29B7" w:rsidSect="000A5FCA">
                            <w:headerReference w:type="default" r:id="rId7"/>
                            <w:footerReference w:type="default" r:id="rId8"/>
                            <w:headerReference w:type="first" r:id="rId9"/>
                            <w:footerReference w:type="first" r:id="rId10"/>
                            <w:pgSz w:w="11906" w:h="16838" w:code="9"/>
                            <w:pgMar w:top="2835" w:right="991" w:bottom="1701" w:left="1701" w:header="1276"
                                     w:footer="641" w:gutter="0"/>
                            <w:cols w:space="708"/>
                            <w:titlePg/>
                            <w:docGrid w:linePitch="360"/>
                        </w:sectPr>
                    </w:pPr>
                </w:p>
                <!-- LANGUAGES -->
                <xsl:call-template name="skill-section">
                    <xsl:with-param name="category">LANGUAGES</xsl:with-param>
                </xsl:call-template>
                <!-- BRANCHES -->
                <xsl:call-template name="skill-section">
                    <xsl:with-param name="category">BRANCHES</xsl:with-param>
                </xsl:call-template>
                <!-- EXPERTISE -->
                <xsl:call-template name="skill-section">
                    <xsl:with-param name="category">EXPERTISE</xsl:with-param>
                </xsl:call-template>
                <!-- DATABASES -->
                <xsl:call-template name="skill-section">
                    <xsl:with-param name="category">DATABASES</xsl:with-param>
                </xsl:call-template>
                <!-- APPLICATIONS -->
                <xsl:call-template name="skill-section">
                    <xsl:with-param name="category">APPLICATIONS</xsl:with-param>
                </xsl:call-template>
                <!-- TOOLS -->
                <xsl:call-template name="skill-section">
                    <xsl:with-param name="category">TOOLS</xsl:with-param>
                </xsl:call-template>
                <!-- PROGRAMMING -->
                <xsl:call-template name="skill-section">
                    <xsl:with-param name="category">PROGRAMMING</xsl:with-param>
                </xsl:call-template>
                <!-- METHODS -->
                <xsl:call-template name="skill-section">
                    <xsl:with-param name="category">METHODS</xsl:with-param>
                </xsl:call-template>
                <!-- OS_NETWORKS -->
                <xsl:call-template name="skill-section">
                    <xsl:with-param name="category">OS_NETWORKS</xsl:with-param>
                </xsl:call-template>

                <w:p w14:paraId="68712A30" w14:textId="77777777" w:rsidR="0027209A" w:rsidRDefault="0027209A"
                     w:rsidP="00666ED6">
                    <w:pPr>
                        <w:sectPr w:rsidR="00660A7D" w:rsidSect="00660A7D">
                            <w:type w:val="continuous"/>
                            <w:pgSz w:w="11906" w:h="16838" w:code="9"/>
                            <w:pgMar w:top="1843" w:right="991" w:bottom="1701" w:left="1701" w:header="714"
                                     w:footer="641" w:gutter="0"/>
                            <w:cols w:num="3" w:space="238"/>
                            <w:titlePg/>
                            <w:docGrid w:linePitch="360"/>
                        </w:sectPr>
                    </w:pPr>
                </w:p>
                <w:p w14:paraId="6C7C904F" w14:textId="5AB055EC" w:rsidR="00F63003" w:rsidRDefault="00C14BDE"
                     w:rsidP="00FD53E1"/>
                <w:p w14:paraId="6C7C904F" w14:textId="5AB055EC" w:rsidR="00F63003" w:rsidRDefault="00C14BDE"
                     w:rsidP="00FD53E1">
                    <w:pPr>
                        <w:pStyle w:val="Valori-blauw"/>
                    </w:pPr>
                    <w:r w:rsidRPr="00C14BDE">
                        <w:rPr>
                            <w:rStyle w:val="Valori-niveau"/>
                        </w:rPr>
                        <w:t xml:space="preserve"> </w:t>
                    </w:r>
                    <w:r w:rsidRPr="00C14BDE">
                        <w:t>basis</w:t>
                    </w:r>
                    <w:r w:rsidRPr="00C14BDE">
                        <w:rPr>
                            <w:rStyle w:val="Valori-niveau"/>
                        </w:rPr>
                        <w:t xml:space="preserve">      </w:t>
                    </w:r>
                    <w:r w:rsidRPr="00C14BDE">
                        <w:t>gevorderd</w:t>
                    </w:r>
                    <w:r w:rsidRPr="00C14BDE">
                        <w:rPr>
                            <w:rStyle w:val="Valori-niveau"/>
                        </w:rPr>
                        <w:t xml:space="preserve">     </w:t>
                    </w:r>
                    <w:r w:rsidRPr="00C14BDE">
                        <w:t>ervaren</w:t>
                    </w:r>
                    <w:r w:rsidR="00F63003" w:rsidRPr="00360F7D">
                        <w:br w:type="page"/>
                    </w:r>
                </w:p>
                <!--

                EXPERIENCE - OVERVIEW

                -->
                <w:p w14:paraId="6B721967" w14:textId="392E381D" w:rsidR="00F15DA6" w:rsidRDefault="00F15DA6"
                     w:rsidP="00F15DA6">
                    <w:pPr>
                        <w:pStyle w:val="Kop1"/>
                    </w:pPr>
                    <w:r>
                        <w:lastRenderedPageBreak/>
                        <w:t>Werkervaring</w:t>
                    </w:r>
                </w:p>
                <w:tbl>
                    <w:tblPr>
                        <w:tblStyle w:val="Tabelraster"/>
                        <w:tblW w:w="0" w:type="auto"/>
                        <w:tblBorders>
                            <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                            <w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                            <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                            <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                            <w:insideH w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                            <w:insideV w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                        </w:tblBorders>
                        <w:tblCellMar>
                            <w:left w:w="0" w:type="dxa"/>
                            <w:right w:w="0" w:type="dxa"/>
                        </w:tblCellMar>
                        <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0"
                                   w:noHBand="0" w:noVBand="1"/>
                    </w:tblPr>
                    <w:tblGrid>
                        <w:gridCol w:w="3071"/>
                        <w:gridCol w:w="3071"/>
                        <w:gridCol w:w="3071"/>
                    </w:tblGrid>
                    <w:tr w:rsidR="00F15DA6" w14:paraId="2666AACC" w14:textId="77777777" w:rsidTr="001860B4">
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="3071" w:type="dxa"/>
                            </w:tcPr>
                            <w:p w14:paraId="0BF044E4" w14:textId="0D364EF6" w:rsidR="00F15DA6"
                                 w:rsidRDefault="00F15DA6" w:rsidP="00F15DA6">
                                <w:pPr>
                                    <w:pStyle w:val="Kop2"/>
                                    <w:outlineLvl w:val="1"/>
                                </w:pPr>
                                <w:r>
                                    <w:t>Periode</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="3071" w:type="dxa"/>
                            </w:tcPr>
                            <w:p w14:paraId="1B8FA0EB" w14:textId="06FE1258" w:rsidR="00F15DA6"
                                 w:rsidRDefault="00F15DA6" w:rsidP="00F15DA6">
                                <w:pPr>
                                    <w:pStyle w:val="Kop2"/>
                                    <w:outlineLvl w:val="1"/>
                                </w:pPr>
                                <w:r>
                                    <w:t>Rol</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="3071" w:type="dxa"/>
                            </w:tcPr>
                            <w:p w14:paraId="701D12C9" w14:textId="71E2D10A" w:rsidR="00F15DA6"
                                 w:rsidRDefault="00F15DA6" w:rsidP="00F15DA6">
                                <w:pPr>
                                    <w:pStyle w:val="Kop2"/>
                                    <w:outlineLvl w:val="1"/>
                                </w:pPr>
                                <w:r>
                                    <w:t>Opdrachtgever</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                    </w:tr>
                    <xsl:apply-templates select="cv:experience[cv:includeInCv = 'true']" mode="overview">
                        <xsl:sort select="cv:sortIndex" data-type="number"/>
                    </xsl:apply-templates>
                </w:tbl>
                <!--

                EDUCATION

                -->
                <xsl:variable name="educations" select="cv:education[cv:includeInCv = 'true']"/>
                <xsl:if test="$educations">
                    <w:p w14:paraId="6C209D83" w14:textId="48D9D99D" w:rsidR="001860B4" w:rsidRDefault="001860B4"
                         w:rsidP="001860B4">
                        <w:pPr>
                            <w:pStyle w:val="Kop1"/>
                        </w:pPr>
                        <w:r>
                            <w:t>Opleidingen</w:t>
                        </w:r>
                    </w:p>
                    <w:tbl>
                        <w:tblPr>
                            <w:tblStyle w:val="Tabelraster"/>
                            <w:tblW w:w="0" w:type="auto"/>
                            <w:tblBorders>
                                <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                                <w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                                <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                                <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                                <w:insideH w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                                <w:insideV w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                            </w:tblBorders>
                            <w:tblCellMar>
                                <w:left w:w="0" w:type="dxa"/>
                                <w:right w:w="0" w:type="dxa"/>
                            </w:tblCellMar>
                            <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0"
                                       w:noHBand="0" w:noVBand="1"/>
                        </w:tblPr>
                        <w:tblGrid>
                            <w:gridCol w:w="3071"/>
                            <w:gridCol w:w="3071"/>
                            <w:gridCol w:w="3071"/>
                        </w:tblGrid>
                        <w:tr w:rsidR="001860B4" w14:paraId="0B48CA77" w14:textId="77777777" w:rsidTr="000B7B5E">
                            <w:tc>
                                <w:tcPr>
                                    <w:tcW w:w="3071" w:type="dxa"/>
                                </w:tcPr>
                                <w:p w14:paraId="3A478FD2" w14:textId="4AEE9AAE" w:rsidR="001860B4"
                                     w:rsidRDefault="001860B4" w:rsidP="000B7B5E">
                                    <w:pPr>
                                        <w:pStyle w:val="Kop2"/>
                                        <w:outlineLvl w:val="1"/>
                                    </w:pPr>
                                    <w:r>
                                        <w:t>Opleiding</w:t>
                                    </w:r>
                                </w:p>
                            </w:tc>
                            <w:tc>
                                <w:tcPr>
                                    <w:tcW w:w="3071" w:type="dxa"/>
                                </w:tcPr>
                                <w:p w14:paraId="66652E0C" w14:textId="2130757E" w:rsidR="001860B4"
                                     w:rsidRDefault="001860B4" w:rsidP="000B7B5E">
                                    <w:pPr>
                                        <w:pStyle w:val="Kop2"/>
                                        <w:outlineLvl w:val="1"/>
                                    </w:pPr>
                                    <w:r>
                                        <w:t>Onderwijsinstelling</w:t>
                                    </w:r>
                                </w:p>
                            </w:tc>
                            <w:tc>
                                <w:tcPr>
                                    <w:tcW w:w="3071" w:type="dxa"/>
                                </w:tcPr>
                                <w:p w14:paraId="52A47C7E" w14:textId="4A1C98C1" w:rsidR="001860B4"
                                     w:rsidRDefault="001860B4" w:rsidP="000B7B5E">
                                    <w:pPr>
                                        <w:pStyle w:val="Kop2"/>
                                        <w:outlineLvl w:val="1"/>
                                    </w:pPr>
                                    <w:r>
                                        <w:t>Diploma</w:t>
                                    </w:r>
                                </w:p>
                            </w:tc>
                        </w:tr>
                        <xsl:apply-templates select="$educations">
                            <xsl:sort select="cv:yearTo" data-type="number" order="descending"/>
                            <xsl:sort select="cv:result"/>
                        </xsl:apply-templates>
                    </w:tbl>
                </xsl:if>
                <!--

                TRAINING

                -->
                <xsl:variable name="trainings" select="cv:training[cv:includeInCv = 'true']"/>
                <xsl:if test="$trainings">
                    <w:p w14:paraId="6600C847" w14:textId="2432E297" w:rsidR="001860B4" w:rsidRDefault="001860B4"
                         w:rsidP="001860B4">
                        <w:pPr>
                            <w:pStyle w:val="Kop1"/>
                        </w:pPr>
                        <w:r>
                            <w:t>Trainingen</w:t>
                        </w:r>
                    </w:p>
                    <w:tbl>
                        <w:tblPr>
                            <w:tblStyle w:val="Tabelraster"/>
                            <w:tblW w:w="0" w:type="auto"/>
                            <w:tblBorders>
                                <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                                <w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                                <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                                <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                                <w:insideH w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                                <w:insideV w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                            </w:tblBorders>
                            <w:tblCellMar>
                                <w:left w:w="0" w:type="dxa"/>
                                <w:right w:w="0" w:type="dxa"/>
                            </w:tblCellMar>
                            <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0"
                                       w:noHBand="0" w:noVBand="1"/>
                        </w:tblPr>
                        <w:tblGrid>
                            <w:gridCol w:w="3071"/>
                            <w:gridCol w:w="3071"/>
                            <w:gridCol w:w="3071"/>
                        </w:tblGrid>
                        <w:tr w:rsidR="001860B4" w14:paraId="185231E8" w14:textId="77777777" w:rsidTr="000B7B5E">
                            <w:tc>
                                <w:tcPr>
                                    <w:tcW w:w="3071" w:type="dxa"/>
                                </w:tcPr>
                                <w:p w14:paraId="47102961" w14:textId="549871FC" w:rsidR="001860B4"
                                     w:rsidRDefault="001860B4" w:rsidP="000B7B5E">
                                    <w:pPr>
                                        <w:pStyle w:val="Kop2"/>
                                        <w:outlineLvl w:val="1"/>
                                    </w:pPr>
                                    <w:r>
                                        <w:t>Training</w:t>
                                    </w:r>
                                </w:p>
                            </w:tc>
                            <w:tc>
                                <w:tcPr>
                                    <w:tcW w:w="3071" w:type="dxa"/>
                                </w:tcPr>
                                <w:p w14:paraId="5210430E" w14:textId="77777777" w:rsidR="001860B4"
                                     w:rsidRDefault="001860B4" w:rsidP="000B7B5E">
                                    <w:pPr>
                                        <w:pStyle w:val="Kop2"/>
                                        <w:outlineLvl w:val="1"/>
                                    </w:pPr>
                                    <w:r>
                                        <w:t>Opleidingsinstituut</w:t>
                                    </w:r>
                                </w:p>
                            </w:tc>
                            <w:tc>
                                <w:tcPr>
                                    <w:tcW w:w="3071" w:type="dxa"/>
                                </w:tcPr>
                                <w:p w14:paraId="54E9619A" w14:textId="45D64A8B" w:rsidR="001860B4"
                                     w:rsidRDefault="001860B4" w:rsidP="000B7B5E">
                                    <w:pPr>
                                        <w:pStyle w:val="Kop2"/>
                                        <w:outlineLvl w:val="1"/>
                                    </w:pPr>
                                    <w:r>
                                        <w:t>Certificaat</w:t>
                                    </w:r>
                                </w:p>
                            </w:tc>
                        </w:tr>
                        <xsl:apply-templates select="$trainings">
                            <xsl:sort select="cv:year" data-type="number" order="descending"/>
                            <xsl:sort select="cv:result"/>
                        </xsl:apply-templates>
                    </w:tbl>
                </xsl:if>
                <!--

                PUBLICATIONS

                -->
                <xsl:variable name="publications" select="cv:publication[cv:includeInCv = 'true']"/>
                <xsl:if test="$publications">
                    <w:p w14:paraId="409CC56D" w14:textId="55003D82" w:rsidR="001860B4" w:rsidRDefault="001860B4"
                         w:rsidP="001860B4">
                        <w:pPr>
                            <w:pStyle w:val="Kop1"/>
                        </w:pPr>
                        <w:r>
                            <w:t>Publicaties</w:t>
                        </w:r>
                    </w:p>
                    <w:tbl>
                        <w:tblPr>
                            <w:tblStyle w:val="Tabelraster"/>
                            <w:tblW w:w="0" w:type="auto"/>
                            <w:tblBorders>
                                <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                                <w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                                <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                                <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                                <w:insideH w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                                <w:insideV w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                            </w:tblBorders>
                            <w:tblLayout w:type="fixed"/>
                            <w:tblCellMar>
                                <w:left w:w="0" w:type="dxa"/>
                                <w:right w:w="0" w:type="dxa"/>
                            </w:tblCellMar>
                            <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0"
                                       w:noHBand="0" w:noVBand="1"/>
                        </w:tblPr>
                        <w:tblGrid>
                            <w:gridCol w:w="3071"/>
                            <w:gridCol w:w="2363"/>
                            <w:gridCol w:w="708"/>
                            <w:gridCol w:w="3071"/>
                        </w:tblGrid>
                        <w:tr w:rsidR="001860B4" w14:paraId="6575444B" w14:textId="77777777" w:rsidTr="001860B4">
                            <w:tc>
                                <w:tcPr>
                                    <w:tcW w:w="3071" w:type="dxa"/>
                                </w:tcPr>
                                <w:p w14:paraId="594EC8C1" w14:textId="30B63790" w:rsidR="001860B4"
                                     w:rsidRDefault="001860B4" w:rsidP="000B7B5E">
                                    <w:pPr>
                                        <w:pStyle w:val="Kop2"/>
                                        <w:outlineLvl w:val="1"/>
                                    </w:pPr>
                                    <w:r>
                                        <w:t>Titel</w:t>
                                    </w:r>
                                </w:p>
                            </w:tc>
                            <w:tc>
                                <w:tcPr>
                                    <w:tcW w:w="2363" w:type="dxa"/>
                                </w:tcPr>
                                <w:p w14:paraId="3E786C01" w14:textId="6055BD31" w:rsidR="001860B4"
                                     w:rsidRDefault="001860B4" w:rsidP="000B7B5E">
                                    <w:pPr>
                                        <w:pStyle w:val="Kop2"/>
                                        <w:outlineLvl w:val="1"/>
                                    </w:pPr>
                                    <w:r>
                                        <w:t>Media</w:t>
                                    </w:r>
                                </w:p>
                            </w:tc>
                            <w:tc>
                                <w:tcPr>
                                    <w:tcW w:w="708" w:type="dxa"/>
                                </w:tcPr>
                                <w:p w14:paraId="0B2114F9" w14:textId="30FD0186" w:rsidR="001860B4"
                                     w:rsidRDefault="001860B4" w:rsidP="001860B4">
                                    <w:pPr>
                                        <w:pStyle w:val="Kop2"/>
                                        <w:outlineLvl w:val="1"/>
                                    </w:pPr>
                                    <w:r>
                                        <w:t>Jaar</w:t>
                                    </w:r>
                                </w:p>
                            </w:tc>
                            <w:tc>
                                <w:tcPr>
                                    <w:tcW w:w="3071" w:type="dxa"/>
                                </w:tcPr>
                                <w:p w14:paraId="2CD43EAD" w14:textId="13C86D98" w:rsidR="001860B4"
                                     w:rsidRDefault="001860B4" w:rsidP="001860B4">
                                    <w:pPr>
                                        <w:pStyle w:val="Kop2"/>
                                        <w:outlineLvl w:val="1"/>
                                    </w:pPr>
                                    <w:r>
                                        <w:t>Omschrijving</w:t>
                                    </w:r>
                                </w:p>
                            </w:tc>
                        </w:tr>
                        <xsl:apply-templates select="$publications">
                            <xsl:sort select="cv:year" data-type="number" order="descending"/>
                        </xsl:apply-templates>
                    </w:tbl>
                </xsl:if>
                <!--

                INTERESTS

                -->
                <xsl:variable name="interests"
                              select="cv:characteristics[cv:includeInCv = 'true']/cv:interests"/>
                <xsl:if test="$interests">
                    <w:p w14:paraId="1227FA0A" w14:textId="1961BDE8" w:rsidR="001860B4" w:rsidRDefault="001860B4"
                         w:rsidP="001860B4">
                        <w:pPr>
                            <w:pStyle w:val="Kop1"/>
                            <w:spacing w:after="60"/>
                        </w:pPr>
                        <w:r>
                            <w:t>Interesses</w:t>
                        </w:r>
                    </w:p>
                    <xsl:apply-templates select="$interests" mode="markdown"/>
                </xsl:if>
                <!--

                REFERENCES

                -->
                <xsl:variable name="references" select="cv:reference[cv:includeInCv = 'true']"/>
                <xsl:if test="$references">
                    <w:p w14:paraId="33B477DB" w14:textId="1CC053B4" w:rsidR="001860B4" w:rsidRDefault="001860B4"
                         w:rsidP="001860B4">
                        <w:pPr>
                            <w:pStyle w:val="Kop1"/>
                        </w:pPr>
                        <w:r>
                            <w:t>Referenties</w:t>
                        </w:r>
                    </w:p>
                    <w:tbl>
                        <w:tblPr>
                            <w:tblStyle w:val="Tabelraster"/>
                            <w:tblW w:w="0" w:type="auto"/>
                            <w:tblBorders>
                                <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                                <w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                                <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                                <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                                <w:insideH w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                                <w:insideV w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                            </w:tblBorders>
                            <w:tblLayout w:type="fixed"/>
                            <w:tblCellMar>
                                <w:left w:w="0" w:type="dxa"/>
                                <w:right w:w="0" w:type="dxa"/>
                            </w:tblCellMar>
                            <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0"
                                       w:noHBand="0" w:noVBand="1"/>
                        </w:tblPr>
                        <w:tblGrid>
                            <w:gridCol w:w="9213"/>
                        </w:tblGrid>
                        <xsl:apply-templates select="$references"/>
                    </w:tbl>
                </xsl:if>
                <!--

                EXPERIENCE

                -->
                <w:p w14:paraId="422E787B" w14:textId="55333B6C" w:rsidR="00CA50C8" w:rsidRDefault="00CA50C8"
                     w:rsidP="00BB35DE">
                    <w:r>
                        <w:br w:type="page"/>
                    </w:r>
                </w:p>
                <w:p w14:paraId="21955C12" w14:textId="009E8DC2" w:rsidR="00BF3AD1" w:rsidRPr="008C7521"
                     w:rsidRDefault="00BF3AD1" w:rsidP="008C7521">
                    <w:pPr>
                        <w:pStyle w:val="Kop1"/>
                    </w:pPr>
                    <w:r w:rsidRPr="008C7521">
                        <w:lastRenderedPageBreak/>
                        <w:t>Werkervaring</w:t>
                    </w:r>
                </w:p>
                <w:tbl>
                    <w:tblPr>
                        <w:tblStyle w:val="Tabelraster"/>
                        <w:tblW w:w="0" w:type="auto"/>
                        <w:tblBorders>
                            <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                            <w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F29100"/>
                            <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                            <w:insideH w:val="single" w:sz="4" w:space="0" w:color="F29100"/>
                            <w:insideV w:val="dashed" w:sz="4" w:space="0" w:color="F29100"/>
                        </w:tblBorders>
                        <w:tblLayout w:type="fixed"/>
                        <w:tblCellMar>
                            <w:left w:w="0" w:type="dxa"/>
                            <w:bottom w:w="113" w:type="dxa"/>
                            <w:right w:w="0" w:type="dxa"/>
                        </w:tblCellMar>
                        <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0"
                                   w:noHBand="0" w:noVBand="1"/>
                    </w:tblPr>
                    <w:tblGrid>
                        <w:gridCol w:w="2052"/>
                        <w:gridCol w:w="7241"/>
                    </w:tblGrid>
                    <xsl:apply-templates select="cv:experience[cv:includeInCv = 'true']">
                        <xsl:sort select="cv:sortIndex" data-type="number"/>
                    </xsl:apply-templates>
                </w:tbl>
                <w:p w14:paraId="258AC442" w14:textId="77777777" w:rsidR="00A52C14" w:rsidRDefault="00A52C14"
                     w:rsidP="00A52C14"/>
                <w:sectPr w:rsidR="00A52C14" w:rsidSect="004D5885">
                    <w:type w:val="continuous"/>
                    <w:pgSz w:w="11906" w:h="16838" w:code="9"/>
                    <w:pgMar w:top="1843" w:right="991" w:bottom="1701" w:left="1701" w:header="714" w:footer="641"
                             w:gutter="0"/>
                    <w:cols w:space="708"/>
                    <w:titlePg/>
                    <w:docGrid w:linePitch="360"/>
                </w:sectPr>
            </w:body>
        </w:document>
    </xsl:template>

</xsl:stylesheet>