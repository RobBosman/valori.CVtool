<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:cv="https://ns.bransom.nl/cerios/cv/v20110401"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
    xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
    xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
    xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
    xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
    exclude-result-prefixes="cv"
    version="1.0">

  <xsl:import href="common-per-locale.xsl" />

  <xsl:param name="layout" />

  <xsl:output method="xml" standalone="yes" encoding="UTF-8" indent="no" />

  <xsl:template match="/">
    <w:document mc:Ignorable="w14 w15 wp14">
      <w:body>
        <w:p w:rsidR="0041112D" w:rsidRDefault="00C34A5E" w:rsidP="0041112D">
          <w:r>
            <w:rPr>
              <w:noProof/>
              <w:lang w:eastAsia="nl-NL"/>
            </w:rPr>
            <w:drawing>
              <wp:anchor distT="45720" distB="45720" distL="114300" distR="114300" simplePos="0" relativeHeight="251659264" behindDoc="0" locked="0" layoutInCell="1" allowOverlap="1">
                <wp:simplePos x="0" y="0"/>
                <wp:positionH relativeFrom="margin">
                  <wp:align>right</wp:align>
                </wp:positionH>
                <wp:positionV relativeFrom="paragraph">
                  <wp:posOffset>-561995</wp:posOffset>
                </wp:positionV>
                <wp:extent cx="5934251" cy="561315"/>
                <wp:effectExtent l="0" t="0" r="9525" b="10795"/>
                <wp:wrapNone/>
                <wp:docPr id="217" name="Tekstvak 2"/>
                <wp:cNvGraphicFramePr>
                  <a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"/>
                </wp:cNvGraphicFramePr>
                <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
                  <a:graphicData uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                    <wps:wsp>
                      <wps:cNvSpPr txBox="1">
                        <a:spLocks noChangeArrowheads="1"/>
                      </wps:cNvSpPr>
                      <wps:spPr bwMode="auto">
                        <a:xfrm>
                          <a:off x="0" y="0"/>
                          <a:ext cx="5934251" cy="561315"/>
                        </a:xfrm>
                        <a:prstGeom prst="rect">
                          <a:avLst/>
                        </a:prstGeom>
                        <a:noFill/>
                        <a:ln w="9525">
                          <a:noFill/>
                          <a:miter lim="800000"/>
                          <a:headEnd/>
                          <a:tailEnd/>
                        </a:ln>
                      </wps:spPr>
                      <wps:txbx>
                        <w:txbxContent>
                          <w:p w:rsidR="00C34A5E" w:rsidRPr="00C34A5E" w:rsidRDefault="00C34A5E" w:rsidP="00C34A5E">
                            <w:pPr>
                              <w:pStyle w:val="Titel"/>
                            </w:pPr>
                            <w:r w:rsidRPr="00C34A5E">
                              <w:t><xsl:apply-templates select="//cv:persoonsgegevens" mode="full-name" /></w:t>
                            </w:r>
                          </w:p>
                          <w:p w:rsidR="0041112D" w:rsidRPr="00057125" w:rsidRDefault="00C34A5E" w:rsidP="00057125">
                            <w:pPr>
                              <w:pStyle w:val="Ondertitel"/>
                              <w:rPr>
                                <w:iCs/>
                                <w:color w:val="F4931E"/>
                                <w:szCs w:val="24"/>
                              </w:rPr>
                            </w:pPr>
                            <w:r w:rsidRPr="00057125">
                              <w:rPr>
                                <w:szCs w:val="24"/>
                              </w:rPr>
                              <w:t><xsl:value-of select="//cv:persoonsgegevens/cv:functie_titel" /></w:t>
                            </w:r>
                            <w:r w:rsidRPr="002271D3">
                              <w:rPr>
                                <w:rStyle w:val="Valori-geel"/>
                              </w:rPr>
                              <w:t xml:space="preserve"> // </w:t>
                            </w:r>
                            <w:r w:rsidRPr="00057125">
                              <w:rPr>
                                <w:szCs w:val="24"/>
                              </w:rPr>
                              <w:t><xsl:apply-templates select="//cv:persoonsgegevens/cv:geboortedatum" mode="date-numeric" /></w:t>
                            </w:r>
                            <w:r w:rsidRPr="002271D3">
                              <w:rPr>
                                <w:rStyle w:val="Valori-geel"/>
                              </w:rPr>
                              <w:t xml:space="preserve"> // </w:t>
                            </w:r>
                            <w:r w:rsidRPr="00057125">
                              <w:rPr>
                                <w:szCs w:val="24"/>
                              </w:rPr>
                              <w:t><xsl:value-of select="//cv:persoonsgegevens/cv:woonplaats" /></w:t>
                            </w:r>
                            <w:r w:rsidRPr="002271D3">
                              <w:rPr>
                                <w:rStyle w:val="Valori-geel"/>
                              </w:rPr>
                              <w:t xml:space="preserve"> //</w:t>
                            </w:r>
                          </w:p>
                        </w:txbxContent>
                      </wps:txbx>
                      <wps:bodyPr rot="0" vert="horz" wrap="square" lIns="0" tIns="0" rIns="0" bIns="0" anchor="t" anchorCtr="0">
                        <a:noAutofit/>
                      </wps:bodyPr>
                    </wps:wsp>
                  </a:graphicData>
                </a:graphic>
                <wp14:sizeRelH relativeFrom="margin">
                  <wp14:pctWidth>0</wp14:pctWidth>
                </wp14:sizeRelH>
                <wp14:sizeRelV relativeFrom="margin">
                  <wp14:pctHeight>0</wp14:pctHeight>
                </wp14:sizeRelV>
              </wp:anchor>
            </w:drawing>
          </w:r>
        </w:p>
        <w:p w:rsidR="0041112D" w:rsidRDefault="0041112D" w:rsidP="0041112D"/>
        <w:p w:rsidR="00403D6F" w:rsidRDefault="00403D6F" w:rsidP="0041112D"/>
        <!--
        
          PROFIELSCHETS
          
        -->
        <xsl:variable name="profiel" select="//cv:cv/cv:profiel[(cv:locale = $locale) and (normalize-space() != cv:locale)]" />
        <w:p w:rsidR="0041112D" w:rsidRPr="00CE4E21" w:rsidRDefault="00403D6F" w:rsidP="00CE4E21">
          <w:pPr>
            <w:pStyle w:val="Kop1"/>
            <w:rPr>
              <w:iCs/>
            </w:rPr>
          </w:pPr>
          <w:r w:rsidRPr="00CE4E21">
            <w:t>Profielschets</w:t>
          </w:r>
        </w:p>
        <xsl:if test="normalize-space($profiel/cv:profiel)">
          <xsl:apply-templates select="$profiel/cv:profiel" mode="markdown" />
        </xsl:if>
        <xsl:if test="normalize-space($profiel/cv:persoonlijke_eigenschappen)">
          <xsl:apply-templates select="$profiel/cv:persoonlijke_eigenschappen" mode="markdown" />
        </xsl:if>
        <xsl:if test="normalize-space($profiel/cv:vaardigheden)">
          <xsl:apply-templates select="$profiel/cv:vaardigheden" mode="markdown" />
        </xsl:if>
        <!--
        
          KENNIS EN VAARDIGHEDEN
          
        -->
        <w:p w:rsidR="002E2E53" w:rsidRDefault="00A37916" w:rsidP="00A37916">
          <w:pPr>
            <w:pStyle w:val="Kop1"/>
          </w:pPr>
          <w:r>
            <w:t>Kennis en vaardigheden</w:t>
          </w:r>
        </w:p>
        <w:p w:rsidR="0081312E" w:rsidRPr="0081312E" w:rsidRDefault="0081312E" w:rsidP="0081312E">
          <w:pPr>
            <w:sectPr w:rsidR="0081312E" w:rsidRPr="0081312E" w:rsidSect="00720889">
              <w:headerReference w:type="default" r:id="rId8"/>
              <w:footerReference w:type="default" r:id="rId9"/>
              <w:pgSz w:w="11906" w:h="16838"/>
              <w:pgMar w:top="2268" w:right="707" w:bottom="1417" w:left="1843" w:header="708" w:footer="425" w:gutter="0"/>
              <w:cols w:space="708"/>
              <w:docGrid w:linePitch="360"/>
            </w:sectPr>
          </w:pPr>
        </w:p>
        <!--
          TALEN
        -->
        <xsl:variable name="talenkennis" select="//cv:talenkennis[normalize-space()]" />
        <xsl:if test="$talenkennis">
          <w:p w:rsidR="002E2E53" w:rsidRPr="00057125" w:rsidRDefault="002E2E53" w:rsidP="00DE6855">
            <w:pPr>
              <w:pStyle w:val="Kop2"/>
            </w:pPr>
            <w:r w:rsidRPr="00DE6855">
              <w:t>Talen</w:t>
            </w:r>
          </w:p>
          <xsl:apply-templates select="$talenkennis">
            <xsl:sort select="cv:mondeling" data-type="number" />
            <xsl:sort select="cv:schriftelijk" data-type="number" />
          </xsl:apply-templates>
        </xsl:if>
        <!--
          BRANCHES
        -->
        <xsl:variable name="branches" select="//cv:branchekennis[normalize-space()]" />
        <xsl:if test="$branches">
          <w:p w:rsidR="002E2E53" w:rsidRPr="002E2E53" w:rsidRDefault="002E2E53" w:rsidP="0081312E">
            <w:pPr>
              <w:pStyle w:val="Kop2"/>
            </w:pPr>
            <w:r w:rsidRPr="002E2E53">
              <w:t>Branches</w:t>
            </w:r>
          </w:p>
          <xsl:apply-templates select="$branches">
              <xsl:sort select="cv:kennisniveau" data-type="number" order="descending" />
              <xsl:sort select="cv:omschrijving_NL" />
          </xsl:apply-templates>
        </xsl:if>
        <!--
          EXPERTISES
        -->
        <xsl:call-template name="vaardigheden">
          <xsl:with-param name="categorie" select="'Expertises'" />
        </xsl:call-template>
        <!--
          DATABASES
        -->
        <xsl:call-template name="vaardigheden">
          <xsl:with-param name="categorie" select="'Databases'" />
          <xsl:with-param name="next_column" select="'true'" />
        </xsl:call-template>
        <!--
          APPLICATIES
        -->
        <xsl:call-template name="vaardigheden">
          <xsl:with-param name="categorie" select="'Applicaties'" />
        </xsl:call-template>
        <!--
          OS EN NETWERKEN
        -->
        <xsl:call-template name="vaardigheden">
          <xsl:with-param name="categorie" select="'OS en Netwerken'" />
        </xsl:call-template>
        <!--
          TOOLS
        -->
        <xsl:call-template name="vaardigheden">
          <xsl:with-param name="categorie" select="'Tools'" />
        </xsl:call-template>
        <!--
          PROGRAMMEREN
        -->
        <xsl:call-template name="vaardigheden">
          <xsl:with-param name="categorie" select="'Programmeren'" />
          <xsl:with-param name="next_column" select="'true'" />
        </xsl:call-template>
        <!--
          METHODES
        -->
        <xsl:call-template name="vaardigheden">
          <xsl:with-param name="categorie" select="'Methodes'" />
        </xsl:call-template>
        <!--
          CERTIFICERINGEN
        -->
        <xsl:call-template name="vaardigheden">
          <xsl:with-param name="categorie" select="'Certificeringen'" />
        </xsl:call-template>
        <w:p w:rsidR="002E2E53" w:rsidRDefault="002E2E53" w:rsidP="002E2E53">
          <w:pPr>
            <w:sectPr w:rsidR="002E2E53" w:rsidSect="002E2E53">
              <w:type w:val="continuous"/>
              <w:pgSz w:w="11906" w:h="16838"/>
              <w:pgMar w:top="2268" w:right="707" w:bottom="1417" w:left="1843" w:header="708" w:footer="708" w:gutter="0"/>
              <w:cols w:num="3" w:space="212"/>
              <w:docGrid w:linePitch="360"/>
            </w:sectPr>
          </w:pPr>
        </w:p>
        <w:p w:rsidR="002E2E53" w:rsidRDefault="002E2E53" w:rsidP="002E2E53">
          <w:pPr>
            <w:pStyle w:val="Valori-tabel"/>
            <w:spacing w:before="120"/>
          </w:pPr>
          <w:r w:rsidRPr="002E2E53">
            <w:rPr>
              <w:rFonts w:ascii="Wingdings" w:hAnsi="Wingdings"/>
            </w:rPr>
            <w:t></w:t>
          </w:r>
          <w:r w:rsidRPr="002E2E53">
            <w:t xml:space="preserve">Foundation   </w:t>
          </w:r>
          <w:r w:rsidRPr="002E2E53">
            <w:rPr>
              <w:rFonts w:ascii="Wingdings" w:hAnsi="Wingdings"/>
            </w:rPr>
            <w:t></w:t>
          </w:r>
          <w:r w:rsidRPr="002E2E53">
            <w:t xml:space="preserve">Advanced   </w:t>
          </w:r>
          <w:r w:rsidRPr="002E2E53">
            <w:rPr>
              <w:rFonts w:ascii="Wingdings" w:hAnsi="Wingdings"/>
            </w:rPr>
            <w:t></w:t>
          </w:r>
          <w:r w:rsidRPr="002E2E53">
            <w:t>Expert</w:t>
          </w:r>
        </w:p>
        <!--
        
          WERKERVARING
          
        -->
        <xsl:variable name="werkopdrachten"
                      select="//cv:werkopdracht[(cv:opnemen_in_cv = 1)
                              and normalize-space(concat(cv:werkgever, cv:opdrachtgever))
                              and normalize-space(cv:werkervaring[cv:locale = $locale]/cv:opdrachtformulering)]" />
        <w:p w:rsidR="00A37916" w:rsidRDefault="002E2E53" w:rsidP="002E2E53">
          <w:pPr>
            <w:pStyle w:val="Kop1"/>
          </w:pPr>
          <w:r>
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
            <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
          </w:tblPr>
          <w:tblGrid>
            <w:gridCol w:w="3261"/>
            <w:gridCol w:w="3118"/>
            <w:gridCol w:w="2967"/>
          </w:tblGrid>
          <w:tr w:rsidR="00CE4E21" w:rsidRPr="00CE4E21" w:rsidTr="005E4B3F">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="3261" w:type="dxa"/>
              </w:tcPr>
              <w:p w:rsidR="00CE4E21" w:rsidRPr="00CE4E21" w:rsidRDefault="00CE4E21" w:rsidP="0081312E">
                <w:pPr>
                  <w:pStyle w:val="Kop2"/>
                  <w:outlineLvl w:val="1"/>
                </w:pPr>
                <w:r w:rsidRPr="00CE4E21">
                  <w:t>Periode</w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="3118" w:type="dxa"/>
              </w:tcPr>
              <w:p w:rsidR="00CE4E21" w:rsidRPr="00CE4E21" w:rsidRDefault="00CE4E21" w:rsidP="0081312E">
                <w:pPr>
                  <w:pStyle w:val="Kop2"/>
                  <w:outlineLvl w:val="1"/>
                </w:pPr>
                <w:r w:rsidRPr="00CE4E21">
                  <w:t>Rol</w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2967" w:type="dxa"/>
              </w:tcPr>
              <w:p w:rsidR="00CE4E21" w:rsidRPr="00CE4E21" w:rsidRDefault="00CE4E21" w:rsidP="0081312E">
                <w:pPr>
                  <w:pStyle w:val="Kop2"/>
                  <w:outlineLvl w:val="1"/>
                </w:pPr>
                <w:r w:rsidRPr="00CE4E21">
                  <w:t>Opdrachtgever</w:t>
                </w:r>
              </w:p>
            </w:tc>
          </w:tr>
          <!-- Sorteer op 'sort_index' als die is gedefinieerd, anders op 'periode_eind'. -->
          <xsl:choose>
            <xsl:when test="$werkopdrachten[normalize-space(cv:sort_index) != '']">
              <xsl:apply-templates select="$werkopdrachten" mode="overzicht">
                <xsl:sort select="cv:sort_index" data-type="number" />
              </xsl:apply-templates>
            </xsl:when>
            <xsl:otherwise>
              <!-- Eerst de werkopdrachten die tot 'heden' lopen... -->
              <xsl:apply-templates select="$werkopdrachten[not(cv:periode_eind)]" mode="overzicht" />
              <!-- ...en dan de rest. -->
              <xsl:apply-templates select="$werkopdrachten[cv:periode_eind]" mode="overzicht">
                <xsl:sort select="cv:periode_eind" order="descending" />
                <xsl:sort select="cv:sort_index" data-type="number" />
              </xsl:apply-templates>
            </xsl:otherwise>
          </xsl:choose>
        </w:tbl>
        <!--
        
          OPLEIDINGEN
          
        -->
        <xsl:variable name="opleidingen"
                      select="//cv:opleiding[(not(cv:soort_opleiding) or (cv:soort_opleiding = 0))
                              and (normalize-space(cv:naam_opleiding | cv:naam_instituut))]" />
        <xsl:if test="$opleidingen">
          <w:p w:rsidR="00902CB9" w:rsidRDefault="00902CB9" w:rsidP="00902CB9">
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
              <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
            </w:tblPr>
            <w:tblGrid>
              <w:gridCol w:w="3261"/>
              <w:gridCol w:w="3118"/>
              <w:gridCol w:w="2967"/>
            </w:tblGrid>
            <w:tr w:rsidR="00902CB9" w:rsidRPr="00CE4E21" w:rsidTr="005E4B3F">
              <w:tc>
                <w:tcPr>
                  <w:tcW w:w="3261" w:type="dxa"/>
                </w:tcPr>
                <w:p w:rsidR="00902CB9" w:rsidRPr="00CE4E21" w:rsidRDefault="00902CB9" w:rsidP="0081312E">
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
                  <w:tcW w:w="3118" w:type="dxa"/>
                </w:tcPr>
                <w:p w:rsidR="00902CB9" w:rsidRPr="00CE4E21" w:rsidRDefault="00902CB9" w:rsidP="0081312E">
                  <w:pPr>
                    <w:pStyle w:val="Kop2"/>
                    <w:outlineLvl w:val="1"/>
                  </w:pPr>
                  <w:r>
                    <w:t>Locatie</w:t>
                  </w:r>
                </w:p>
              </w:tc>
              <w:tc>
                <w:tcPr>
                  <w:tcW w:w="2967" w:type="dxa"/>
                </w:tcPr>
                <w:p w:rsidR="00902CB9" w:rsidRPr="00CE4E21" w:rsidRDefault="00902CB9" w:rsidP="0081312E">
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
            <xsl:apply-templates select="$opleidingen">
              <xsl:sort select="cv:jaar_diploma" data-type="number" order="descending" />
              <xsl:sort select="cv:diploma" data-type="number" />
            </xsl:apply-templates>
          </w:tbl>
        </xsl:if>
        <!--
        
          CURSUSSEN
          
        -->
        <xsl:variable name="cursussen" select="//cv:opleiding[(cv:soort_opleiding > 0)
                                               and (normalize-space(cv:naam_opleiding | cv:naam_instituut))]" />
        <xsl:if test="$cursussen">
          <w:p w:rsidR="00902CB9" w:rsidRDefault="00902CB9" w:rsidP="00902CB9">
            <w:pPr>
              <w:pStyle w:val="Kop1"/>
            </w:pPr>
            <w:r>
              <w:t>Cursussen</w:t>
            </w:r>
          </w:p>
          <w:tbl>
            <w:tblPr>
              <w:tblStyle w:val="Tabelraster"/>
              <w:tblW w:w="0" w:type="auto"/>
              <w:tblInd w:w="-5" w:type="dxa"/>
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
              <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
            </w:tblPr>
            <w:tblGrid>
              <w:gridCol w:w="3266"/>
              <w:gridCol w:w="3118"/>
              <w:gridCol w:w="2967"/>
            </w:tblGrid>
            <w:tr w:rsidR="00902CB9" w:rsidRPr="00CE4E21" w:rsidTr="005E4B3F">
              <w:tc>
                <w:tcPr>
                  <w:tcW w:w="3266" w:type="dxa"/>
                </w:tcPr>
                <w:p w:rsidR="00902CB9" w:rsidRPr="00CE4E21" w:rsidRDefault="00902CB9" w:rsidP="0081312E">
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
                  <w:tcW w:w="3118" w:type="dxa"/>
                </w:tcPr>
                <w:p w:rsidR="00902CB9" w:rsidRPr="00CE4E21" w:rsidRDefault="00902CB9" w:rsidP="0081312E">
                  <w:pPr>
                    <w:pStyle w:val="Kop2"/>
                    <w:outlineLvl w:val="1"/>
                  </w:pPr>
                  <w:r>
                    <w:t>Locatie</w:t>
                  </w:r>
                </w:p>
              </w:tc>
              <w:tc>
                <w:tcPr>
                  <w:tcW w:w="2962" w:type="dxa"/>
                </w:tcPr>
                <w:p w:rsidR="00902CB9" w:rsidRPr="00CE4E21" w:rsidRDefault="00902CB9" w:rsidP="0081312E">
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
            <xsl:apply-templates select="$cursussen">
              <xsl:sort select="cv:jaar_diploma" data-type="number" order="descending" />
              <xsl:sort select="cv:diploma" data-type="number" />
            </xsl:apply-templates>
          </w:tbl>
        </xsl:if>
        <!--
        
          PUBLICATIES
          
        -->
        <xsl:variable name="publicaties" select="//cv:publicatie" />
        <xsl:if test="$publicaties">
          <w:p w:rsidR="00902CB9" w:rsidRDefault="00902CB9" w:rsidP="00902CB9">
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
              <w:tblInd w:w="-5" w:type="dxa"/>
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
              <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
            </w:tblPr>
            <w:tblGrid>
              <w:gridCol w:w="3266"/>
              <w:gridCol w:w="3118"/>
              <w:gridCol w:w="2967"/>
            </w:tblGrid>
            <w:tr w:rsidR="00902CB9" w:rsidRPr="00CE4E21" w:rsidTr="005E4B3F">
              <w:tc>
                <w:tcPr>
                  <w:tcW w:w="3266" w:type="dxa"/>
                </w:tcPr>
                <w:p w:rsidR="00902CB9" w:rsidRPr="00CE4E21" w:rsidRDefault="00902CB9" w:rsidP="0081312E">
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
                  <w:tcW w:w="3118" w:type="dxa"/>
                </w:tcPr>
                <w:p w:rsidR="00902CB9" w:rsidRPr="00CE4E21" w:rsidRDefault="00902CB9" w:rsidP="0081312E">
                  <w:pPr>
                    <w:pStyle w:val="Kop2"/>
                    <w:outlineLvl w:val="1"/>
                  </w:pPr>
                  <w:r>
                    <w:t>Omschrijving</w:t>
                  </w:r>
                </w:p>
              </w:tc>
              <w:tc>
                <w:tcPr>
                  <w:tcW w:w="2962" w:type="dxa"/>
                </w:tcPr>
                <w:p w:rsidR="00902CB9" w:rsidRPr="00CE4E21" w:rsidRDefault="00902CB9" w:rsidP="0081312E">
                  <w:pPr>
                    <w:pStyle w:val="Kop2"/>
                    <w:outlineLvl w:val="1"/>
                  </w:pPr>
                  <w:r>
                    <w:t>Media</w:t>
                  </w:r>
                </w:p>
              </w:tc>
            </w:tr>
            <xsl:apply-templates select="$publicaties">
              <xsl:sort select="cv:jaar" data-type="number" order="descending" />
            </xsl:apply-templates>
          </w:tbl>
        </xsl:if>
        <!--
        
          INTERESSES
          
        -->
        <xsl:variable name="interesses" select="//cv:profiel[cv:locale = $locale]/cv:interesses" />
        <xsl:if test="$interesses">
          <w:p w:rsidR="00902CB9" w:rsidRDefault="00902CB9" w:rsidP="00902CB9">
            <w:pPr>
              <w:pStyle w:val="Kop1"/>
            </w:pPr>
            <w:r>
              <w:t>Interesses</w:t>
            </w:r>
          </w:p>
          <xsl:apply-templates select="$interesses" />
        </xsl:if>
        <!--
        
          REFERENTIES
          
        -->
        <xsl:variable name="referenties" select="//cv:referentie[cv:opnemen_in_cv = 1]" />
        <xsl:if test="$referenties">
          <w:p w:rsidR="00902CB9" w:rsidRDefault="00902CB9" w:rsidP="00902CB9">
            <w:pPr>
              <w:pStyle w:val="Kop1"/>
            </w:pPr>
            <w:r>
              <w:t>Referenties</w:t>
            </w:r>
          </w:p>
          <xsl:apply-templates select="$referenties" />
        </xsl:if>
        <w:p w:rsidR="00EA114C" w:rsidRDefault="00EA114C">
          <w:pPr>
            <w:spacing w:after="160"/>
          </w:pPr>
          <w:r>
            <w:br w:type="page"/>
          </w:r>
        </w:p>
        <!--
        
          WERKERVARING
          
        -->
        <w:p w:rsidR="00EA114C" w:rsidRDefault="00EA114C" w:rsidP="00EA114C">
          <w:pPr>
            <w:pStyle w:val="Kop1"/>
          </w:pPr>
          <w:r>
            <w:t>Werkervaring</w:t>
          </w:r>
        </w:p>
        <w:tbl>
          <w:tblPr>
            <w:tblStyle w:val="Tabelraster"/>
            <w:tblW w:w="0" w:type="auto"/>
            <w:tblInd w:w="-5" w:type="dxa"/>
            <w:tblBorders>
              <w:top w:val="single" w:sz="0" w:space="0" w:color="F4931E"/>
              <w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F4931E"/>
              <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:insideH w:val="single" w:sz="4" w:space="0" w:color="F4931E"/>
              <w:insideV w:val="dashed" w:sz="4" w:space="0" w:color="F4931E"/>
            </w:tblBorders>
            <w:tblCellMar>
              <w:left w:w="80" w:type="dxa"/>
              <w:right w:w="0" w:type="dxa"/>
            </w:tblCellMar>
            <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
          </w:tblPr>
          <w:tblGrid>
            <w:gridCol w:w="2415"/>
            <w:gridCol w:w="6946"/>
          </w:tblGrid>
          <!-- Sorteer op 'sort_index' als die is gedefinieerd, anders op 'periode_eind'. -->
          <xsl:choose>
            <xsl:when test="$werkopdrachten[normalize-space(cv:sort_index) != '']">
              <xsl:apply-templates select="$werkopdrachten" mode="detail">
                <xsl:sort select="cv:sort_index" data-type="number" />
              </xsl:apply-templates>
            </xsl:when>
            <xsl:otherwise>
              <!-- Eerst de werkopdrachten die tot 'heden' lopen... -->
              <xsl:apply-templates select="$werkopdrachten[not(cv:periode_eind)]" mode="detail" />
              <!-- ...en dan de rest. -->
              <xsl:apply-templates select="$werkopdrachten[cv:periode_eind]" mode="detail">
                <xsl:sort select="cv:periode_eind" order="descending" />
                <xsl:sort select="cv:sort_index" data-type="number" />
              </xsl:apply-templates>
            </xsl:otherwise>
          </xsl:choose>
        </w:tbl>
        <w:p w:rsidR="00902CB9" w:rsidRPr="00720889" w:rsidRDefault="00902CB9" w:rsidP="00720889">
          <w:pPr>
            <w:tabs>
              <w:tab w:val="left" w:pos="1875"/>
            </w:tabs>
          </w:pPr>
        </w:p>
        <w:sectPr w:rsidR="00902CB9" w:rsidRPr="00720889" w:rsidSect="00720889">
          <w:type w:val="continuous"/>
          <w:pgSz w:w="11906" w:h="16838"/>
          <w:pgMar w:top="2268" w:right="707" w:bottom="993" w:left="1843" w:header="708" w:footer="425" w:gutter="0"/>
          <w:cols w:space="708"/>
          <w:docGrid w:linePitch="360"/>
        </w:sectPr>
      </w:body>
    </w:document>
  </xsl:template>
  
  <xsl:template match="cv:talenkennis">
    <w:p w:rsidR="002E2E53" w:rsidRDefault="002E2E53" w:rsidP="002271D3">
      <w:pPr>
        <w:pStyle w:val="Valori-tabel"/>
      </w:pPr>
      <w:r w:rsidRPr="002E2E53">
        <w:t><xsl:value-of select="cv:taal_NL" /></w:t>
        <w:tab/>
      </w:r>
      <w:r w:rsidR="00DE6855" w:rsidRPr="002271D3">
        <w:rPr>
          <w:rStyle w:val="Valori-niveau"/>
        </w:rPr>
        <w:t>
          <xsl:apply-templates select="cv:mondeling" mode="linguistics-level" />
        </w:t>
      </w:r>
    </w:p>
  </xsl:template>
  
  <xsl:template match="cv:branchekennis">
    <w:p w:rsidR="002E2E53" w:rsidRDefault="002E2E53" w:rsidP="00D63E1B">
      <w:pPr>
        <w:pStyle w:val="Valori-tabel"/>
      </w:pPr>
      <w:r>
        <w:t><xsl:value-of select="cv:omschrijving_NL" /></w:t>
        <w:tab/>
      </w:r>
      <w:r w:rsidR="00DE6855" w:rsidRPr="002271D3">
        <w:rPr>
          <w:rStyle w:val="Valori-niveau"/>
        </w:rPr>
        <xsl:call-template name="skill-level">
          <xsl:with-param name="level" select="cv:kennisniveau" />
        </xsl:call-template>
      </w:r>
    </w:p>
  </xsl:template>
  
  <xsl:template name="vaardigheden">
    <xsl:param name="categorie" />
    <xsl:param name="next_column" />
    <xsl:variable name="vaardigheden" select="//cv:vaardigheid[cv:categorie = $categorie]" />
    <xsl:if test="$vaardigheden">
      <w:p w:rsidR="002E2E53" w:rsidRPr="002E2E53" w:rsidRDefault="002E2E53" w:rsidP="0081312E">
        <w:pPr>
          <w:pStyle w:val="Kop2"/>
        </w:pPr>
        <w:r w:rsidRPr="002E2E53">
          <xsl:if test="$next_column">
            <w:br w:type="column"/>
          </xsl:if>
          <w:t><xsl:apply-templates select="$vaardigheden[1]/cv:categorie" mode="skill-category" /></w:t>
        </w:r>
      </w:p>
      <xsl:apply-templates select="$vaardigheden">
        <xsl:sort select="cv:kennisniveau" data-type="number" order="descending" />
        <xsl:sort select="cv:omschrijving" />
      </xsl:apply-templates>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="cv:vaardigheid">
    <w:p w:rsidR="002E2E53" w:rsidRDefault="002E2E53" w:rsidP="00D63E1B">
      <w:pPr>
        <w:pStyle w:val="Valori-tabel"/>
      </w:pPr>
      <w:r>
        <w:t><xsl:value-of select="cv:omschrijving" /></w:t>
        <w:tab/>
      </w:r>
      <w:r w:rsidR="00DE6855" w:rsidRPr="002271D3">
        <w:rPr>
          <w:rStyle w:val="Valori-niveau"/>
        </w:rPr>
        <xsl:call-template name="skill-level">
          <xsl:with-param name="level" select="cv:kennisniveau" />
        </xsl:call-template>
      </w:r>
    </w:p>
  </xsl:template>

  <xsl:template match="cv:opleiding">
    <w:tr w:rsidR="00902CB9" w:rsidRPr="00CE4E21" w:rsidTr="005E4B3F">
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="3261" w:type="dxa"/>
        </w:tcPr>
        <w:p w:rsidR="00902CB9" w:rsidRPr="00CE4E21" w:rsidRDefault="00902CB9" w:rsidP="00BA62E2">
          <w:r w:rsidRPr="00CE4E21">
            <w:t><xsl:value-of select="cv:naam_opleiding" /></w:t>
          </w:r>
        </w:p>
      </w:tc>
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="3118" w:type="dxa"/>
        </w:tcPr>
        <w:p w:rsidR="00902CB9" w:rsidRPr="00CE4E21" w:rsidRDefault="00902CB9" w:rsidP="00BA62E2">
          <w:r w:rsidRPr="00CE4E21">
            <w:t>
              <xsl:value-of select="cv:naam_instituut" />
              <xsl:text> </xsl:text>
              <xsl:value-of select="cv:plaats_instituut" />
            </w:t>
          </w:r>
        </w:p>
      </w:tc>
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="2967" w:type="dxa"/>
        </w:tcPr>
        <w:p w:rsidR="00902CB9" w:rsidRPr="00CE4E21" w:rsidRDefault="00902CB9" w:rsidP="00902CB9">
          <w:r>
            <w:t><xsl:value-of select="cv:jaar_diploma" /></w:t>
          </w:r>
          <xsl:choose>
            <xsl:when test="((not(cv:soort_opleiding) or cv:soort_opleiding = 0) and cv:diploma != 1)
                            or (cv:soort_opleiding > 0 and cv:diploma != 2)">
              <xsl:choose>
                <xsl:when test="cv:jaar_diploma">
                  <w:r w:rsidRPr="002271D3">
                    <w:rPr>
                      <w:rStyle w:val="Valori-geel"/>
                    </w:rPr>
                    <w:t xml:space="preserve"> // </w:t>
                  </w:r>
                </xsl:when>
              </xsl:choose>
              <w:r w:rsidRPr="00CE4E21">
                <w:t>
                  <xsl:choose>
                    <xsl:when test="cv:diploma = 0">
                      <xsl:text>niet voltooid</xsl:text>
                    </xsl:when>
                    <xsl:when test="cv:diploma = 1">
                      <xsl:text>diploma</xsl:text>
                    </xsl:when>
                    <xsl:when test="cv:diploma = 2">
                      <xsl:text>certificaat</xsl:text>
                    </xsl:when>
                    <xsl:when test="cv:diploma = 3">
                      <xsl:text>nvt</xsl:text>
                    </xsl:when>
                  </xsl:choose>
                </w:t>
              </w:r>
            </xsl:when>
          </xsl:choose>
        </w:p>
      </w:tc>
    </w:tr>
  </xsl:template>
  
  <xsl:template match="cv:publicatie">
    <w:tr w:rsidR="00902CB9" w:rsidRPr="00CE4E21" w:rsidTr="005E4B3F">
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="3261" w:type="dxa"/>
        </w:tcPr>
        <w:p w:rsidR="00902CB9" w:rsidRPr="00CE4E21" w:rsidRDefault="00902CB9" w:rsidP="00BA62E2">
          <w:r w:rsidRPr="00CE4E21">
            <w:rPr>
              <w:i/>
            </w:rPr>
            <w:t><xsl:value-of select="cv:titel" /></w:t>
          </w:r>
        </w:p>
      </w:tc>
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="3118" w:type="dxa"/>
        </w:tcPr>
        <w:p w:rsidR="00902CB9" w:rsidRPr="00CE4E21" w:rsidRDefault="00902CB9" w:rsidP="00BA62E2">
          <w:r w:rsidRPr="00CE4E21">
            <w:t><xsl:value-of select="cv:omschrijving_nl_NL" /></w:t>
          </w:r>
        </w:p>
      </w:tc>
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="2967" w:type="dxa"/>
        </w:tcPr>
        <w:p w:rsidR="00902CB9" w:rsidRPr="00CE4E21" w:rsidRDefault="00902CB9" w:rsidP="00902CB9">
          <w:r>
            <w:t><xsl:value-of select="cv:jaar" /></w:t>
          </w:r>
          <w:r w:rsidRPr="002271D3">
            <w:rPr>
              <w:rStyle w:val="Valori-geel"/>
            </w:rPr>
            <w:t xml:space="preserve"> // </w:t>
          </w:r>
          <w:r w:rsidRPr="00CE4E21">
            <w:t><xsl:value-of select="cv:media" /></w:t>
          </w:r>
        </w:p>
      </w:tc>
    </w:tr>
  </xsl:template>

  <xsl:template match="cv:interesses">
    <xsl:apply-templates select="." mode="markdown" />
  </xsl:template>
  
  <xsl:template match="cv:referentie">
    <w:p w:rsidR="00902CB9" w:rsidRPr="00902CB9" w:rsidRDefault="00902CB9" w:rsidP="0081312E">
      <w:pPr>
        <w:pStyle w:val="Kop2"/>
      </w:pPr>
      <w:r w:rsidRPr="00902CB9">
        <w:t>
          <xsl:value-of select="cv:naam_referent" />
          <xsl:text>, </xsl:text>
          <xsl:value-of select="cv:functie_referent_nl_NL" />
        </w:t>
      </w:r>
    </w:p>
    <xsl:apply-templates select="cv:omschrijving_nl_NL" mode="markdown" />
  </xsl:template>

  <xsl:template match="cv:werkopdracht" mode="opdrachtgever">
    <xsl:choose>
      <xsl:when test="normalize-space(cv:opdrachtgever)">
        <xsl:value-of select="normalize-space(cv:opdrachtgever)" />
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="normalize-space(cv:werkgever)" />
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="cv:werkopdracht" mode="overzicht">
    <xsl:variable name="werkervaring" select="cv:werkervaring[cv:locale = $locale]" />
    <w:tr w:rsidR="00CE4E21" w:rsidRPr="00CE4E21" w:rsidTr="005E4B3F">
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="3261" w:type="dxa"/>
        </w:tcPr>
        <w:p w:rsidR="00CE4E21" w:rsidRPr="00CE4E21" w:rsidRDefault="00CE4E21" w:rsidP="00CE4E21">
          <w:r w:rsidRPr="00CE4E21">
            <w:t>
              <xsl:apply-templates select="cv:periode_begin" mode="date-period" />
              <xsl:text xml:space="preserve"> – </xsl:text>
              <xsl:choose>
                <xsl:when test="cv:periode_eind">
                  <xsl:apply-templates select="cv:periode_eind" mode="date-period" />
                </xsl:when>
                <xsl:otherwise>heden</xsl:otherwise>
              </xsl:choose>
            </w:t>
          </w:r>
        </w:p>
      </w:tc>
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="3118" w:type="dxa"/>
        </w:tcPr>
        <w:p w:rsidR="00CE4E21" w:rsidRPr="00CE4E21" w:rsidRDefault="00CE4E21" w:rsidP="00CE4E21">
          <w:r w:rsidRPr="00CE4E21">
            <w:t><xsl:value-of select="$werkervaring/cv:rol" /></w:t>
          </w:r>
        </w:p>
      </w:tc>
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="2967" w:type="dxa"/>
        </w:tcPr>
        <w:p w:rsidR="00CE4E21" w:rsidRPr="00CE4E21" w:rsidRDefault="00CE4E21" w:rsidP="00CE4E21">
          <w:r w:rsidRPr="00CE4E21">
            <w:t><xsl:apply-templates select="." mode="opdrachtgever" /></w:t>
          </w:r>
        </w:p>
      </w:tc>
    </w:tr>
  </xsl:template>
  
  <xsl:template match="cv:werkopdracht" mode="detail">
    <xsl:variable name="werkervaring" select="cv:werkervaring[cv:locale = $locale]" />
    <w:tr w:rsidR="00EA114C" w:rsidRPr="00CE4E21" w:rsidTr="00936F5B">
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="2415" w:type="dxa"/>
        </w:tcPr>
        <w:p w:rsidR="00EA114C" w:rsidRPr="0081312E" w:rsidRDefault="00EA114C" w:rsidP="00EA114C">
          <w:pPr>
            <w:rPr>
              <w:color w:val="0A1C5C"/>
            </w:rPr>
          </w:pPr>
          <w:r w:rsidRPr="0081312E">
            <w:rPr>
              <w:color w:val="0A1C5C"/>
            </w:rPr>
            <w:t>
              <xsl:apply-templates select="cv:periode_begin" mode="date-period" />
              <xsl:text xml:space="preserve"> – </xsl:text>
              <xsl:choose>
                <xsl:when test="cv:periode_eind">
                  <xsl:apply-templates select="cv:periode_eind" mode="date-period" />
                </xsl:when>
                <xsl:otherwise>heden</xsl:otherwise>
              </xsl:choose>
            </w:t>
          </w:r>
        </w:p>
        <w:p w:rsidR="00EA114C" w:rsidRPr="0081312E" w:rsidRDefault="00EA114C" w:rsidP="00EA114C">
          <w:pPr>
            <w:rPr>
              <w:color w:val="F39900"/>
            </w:rPr>
          </w:pPr>
          <w:r w:rsidRPr="0081312E">
            <w:rPr>
              <w:color w:val="F39900"/>
            </w:rPr>
            <w:t><xsl:value-of select="$werkervaring/cv:rol" /></w:t>
          </w:r>
        </w:p>
        <w:p w:rsidR="00EA114C" w:rsidRPr="00EA114C" w:rsidRDefault="00EA114C" w:rsidP="00EA114C">
          <w:r w:rsidRPr="0081312E">
            <w:rPr>
              <w:color w:val="F39900"/>
            </w:rPr>
            <w:t><xsl:apply-templates select="." mode="opdrachtgever" /></w:t>
          </w:r>
        </w:p>
      </w:tc>
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="6946" w:type="dxa"/>
        </w:tcPr>
        <xsl:apply-templates select="$werkervaring/cv:opdrachtformulering" mode="markdown" />
        <xsl:if test="normalize-space($werkervaring/cv:werkzaamheden)">
          <w:p w:rsidR="00EA114C" w:rsidRDefault="00EA114C" w:rsidP="0081312E">
            <w:pPr>
              <w:pStyle w:val="Kop2"/>
              <w:outlineLvl w:val="1"/>
            </w:pPr>
            <w:r w:rsidRPr="00936F5B">
              <w:t>Taken en werkzaamheden</w:t>
            </w:r>
          </w:p>
          <xsl:apply-templates select="$werkervaring/cv:werkzaamheden" mode="markdown" />
        </xsl:if>
        <xsl:if test="normalize-space($werkervaring/cv:resultaat)">
          <w:p w:rsidR="00EA114C" w:rsidRDefault="00EA114C" w:rsidP="0081312E">
            <w:pPr>
              <w:pStyle w:val="Kop2"/>
              <w:outlineLvl w:val="1"/>
            </w:pPr>
            <w:r w:rsidRPr="00936F5B">
              <w:t>Resultaat</w:t>
            </w:r>
          </w:p>
          <xsl:apply-templates select="$werkervaring/cv:resultaat" mode="markdown" />
        </xsl:if>
        <xsl:if test="normalize-space($werkervaring/cv:steekwoorden)">
          <w:p w:rsidR="00EA114C" w:rsidRDefault="00EA114C" w:rsidP="0081312E">
            <w:pPr>
              <w:pStyle w:val="Kop2"/>
              <w:outlineLvl w:val="1"/>
            </w:pPr>
            <w:r w:rsidRPr="00936F5B">
              <w:t>Werkomgeving</w:t>
            </w:r>
          </w:p>
          <xsl:apply-templates select="$werkervaring/cv:steekwoorden" mode="markdown" />
        </xsl:if>
      </w:tc>
    </w:tr>
  </xsl:template>

</xsl:stylesheet>