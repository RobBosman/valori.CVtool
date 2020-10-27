<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:cv="https://ns.bransom.nl/valori/cv/v20201022.xsd"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
    xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
    xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
    exclude-result-prefixes="cv"
    version="1.0">

  <xsl:import href="../../common.xsl"/>
  <xsl:import href="../common-nl_NL.xsl"/>

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
        <w:p w14:paraId="3BF04214" w14:textId="77777777" w:rsidR="00D55949" w:rsidRDefault="00D55949" w:rsidP="00D55949">
          <w:pPr>
            <w:pStyle w:val="Kop1"/>
          </w:pPr>
          <w:r w:rsidRPr="00D55949">
            <w:t>Profielschets</w:t>
          </w:r>
        </w:p>
        <xsl:apply-templates select="cv:cv/cv:profile/cv:nl_NL" mode="markdown"/>
        <!--

        SKILLS

        -->
        <w:p w14:paraId="6DD8B0DA" w14:textId="3ABD36DD" w:rsidR="00475635" w:rsidRDefault="00BF29B7" w:rsidP="00302F10">
          <w:pPr>
            <w:pStyle w:val="Kop1"/>
          </w:pPr>
          <w:r>
            <w:t>Kennis &amp; vaardigheden</w:t>
          </w:r>
        </w:p>
        <w:p w14:paraId="295EA1F8" w14:textId="77777777" w:rsidR="00BF29B7" w:rsidRDefault="00BF29B7" w:rsidP="00BB35DE">
          <w:pPr>
            <w:sectPr w:rsidR="00BF29B7" w:rsidSect="000A5FCA">
              <w:headerReference w:type="default" r:id="rId7"/>
              <w:footerReference w:type="default" r:id="rId8"/>
              <w:headerReference w:type="first" r:id="rId9"/>
              <w:footerReference w:type="first" r:id="rId10"/>
              <w:pgSz w:w="11906" w:h="16838" w:code="9"/>
              <w:pgMar w:top="2835" w:right="707" w:bottom="1701" w:left="1701" w:header="1276" w:footer="641" w:gutter="0"/>
              <w:cols w:space="708"/>
              <w:titlePg/>
              <w:docGrid w:linePitch="360"/>
            </w:sectPr>
          </w:pPr>
        </w:p>
        <!-- LANGUAGES -->
        <xsl:call-template name="skill-section">
          <xsl:with-param name="category">LANGUAGES</xsl:with-param>
          <xsl:with-param name="appendColumnBreak">false</xsl:with-param>
        </xsl:call-template>
        <!-- BRANCHES -->
        <xsl:call-template name="skill-section">
          <xsl:with-param name="category">BRANCHES</xsl:with-param>
          <xsl:with-param name="appendColumnBreak">false</xsl:with-param>
        </xsl:call-template>
        <!-- EXPERTISE -->
        <xsl:call-template name="skill-section">
          <xsl:with-param name="category">EXPERTISE</xsl:with-param>
          <xsl:with-param name="appendColumnBreak">true</xsl:with-param>
        </xsl:call-template>
        <!-- DATABASES -->
        <xsl:call-template name="skill-section">
          <xsl:with-param name="category">DATABASES</xsl:with-param>
          <xsl:with-param name="appendColumnBreak">false</xsl:with-param>
        </xsl:call-template>
        <!-- APPLICATIONS -->
        <xsl:call-template name="skill-section">
          <xsl:with-param name="category">APPLICATIONS</xsl:with-param>
          <xsl:with-param name="appendColumnBreak">false</xsl:with-param>
        </xsl:call-template>
        <!-- TOOLS -->
        <xsl:call-template name="skill-section">
          <xsl:with-param name="category">TOOLS</xsl:with-param>
          <xsl:with-param name="appendColumnBreak">true</xsl:with-param>
        </xsl:call-template>
        <!-- PROGRAMMING -->
        <xsl:call-template name="skill-section">
          <xsl:with-param name="category">PROGRAMMING</xsl:with-param>
          <xsl:with-param name="appendColumnBreak">false</xsl:with-param>
        </xsl:call-template>
        <!-- METHODS -->
        <xsl:call-template name="skill-section">
          <xsl:with-param name="category">METHODS</xsl:with-param>
          <xsl:with-param name="appendColumnBreak">false</xsl:with-param>
        </xsl:call-template>
        <!-- OS_NETWORKS -->
        <xsl:call-template name="skill-section">
          <xsl:with-param name="category">OS_NETWORKS</xsl:with-param>
          <xsl:with-param name="appendColumnBreak">false</xsl:with-param>
        </xsl:call-template>
        <w:p w14:paraId="68712A30" w14:textId="77777777" w:rsidR="00660A7D" w:rsidRDefault="00660A7D" w:rsidP="00666ED6">
          <w:pPr>
            <w:sectPr w:rsidR="00660A7D" w:rsidSect="00660A7D">
              <w:type w:val="continuous"/>
              <w:pgSz w:w="11906" w:h="16838" w:code="9"/>
              <w:pgMar w:top="1843" w:right="707" w:bottom="1701" w:left="1701" w:header="714" w:footer="641" w:gutter="0"/>
              <w:cols w:num="3" w:space="238"/>
              <w:titlePg/>
              <w:docGrid w:linePitch="360"/>
            </w:sectPr>
          </w:pPr>
        </w:p>
        <w:p w14:paraId="6C7C904F" w14:textId="5AB055EC" w:rsidR="00F63003" w:rsidRDefault="00C14BDE" w:rsidP="00FD53E1"/>
        <w:p w14:paraId="6C7C904F" w14:textId="5AB055EC" w:rsidR="00F63003" w:rsidRDefault="00C14BDE" w:rsidP="00FD53E1">
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
            <w:t>foundation</w:t>
          </w:r>
          <w:r w:rsidRPr="00C14BDE">
            <w:rPr>
              <w:rStyle w:val="Valori-niveau"/>
            </w:rPr>
            <w:t xml:space="preserve">      </w:t>
          </w:r>
          <w:r w:rsidRPr="00C14BDE">
            <w:t>advanced</w:t>
          </w:r>
          <w:r w:rsidRPr="00C14BDE">
            <w:rPr>
              <w:rStyle w:val="Valori-niveau"/>
            </w:rPr>
            <w:t xml:space="preserve">     </w:t>
          </w:r>
          <w:r w:rsidRPr="00C14BDE">
            <w:t>expert</w:t>
          </w:r>
          <w:r w:rsidR="00F63003" w:rsidRPr="00360F7D">
            <w:br w:type="page"/>
          </w:r>
        </w:p>
        <!--

        EXPERIENCE - OVERVIEW

        -->
        <w:p w14:paraId="6B721967" w14:textId="392E381D" w:rsidR="00F15DA6" w:rsidRDefault="00F15DA6" w:rsidP="00F15DA6">
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
            <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
          </w:tblPr>
          <w:tblGrid>
            <w:gridCol w:w="3164"/>
            <w:gridCol w:w="3164"/>
            <w:gridCol w:w="3164"/>
          </w:tblGrid>
          <w:tr w:rsidR="00F15DA6" w14:paraId="2666AACC" w14:textId="77777777" w:rsidTr="001860B4">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="3164" w:type="dxa"/>
              </w:tcPr>
              <w:p w14:paraId="0BF044E4" w14:textId="0D364EF6" w:rsidR="00F15DA6" w:rsidRDefault="00F15DA6" w:rsidP="00F15DA6">
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
                <w:tcW w:w="3164" w:type="dxa"/>
              </w:tcPr>
              <w:p w14:paraId="1B8FA0EB" w14:textId="06FE1258" w:rsidR="00F15DA6" w:rsidRDefault="00F15DA6" w:rsidP="00F15DA6">
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
                <w:tcW w:w="3164" w:type="dxa"/>
              </w:tcPr>
              <w:p w14:paraId="701D12C9" w14:textId="71E2D10A" w:rsidR="00F15DA6" w:rsidRDefault="00F15DA6" w:rsidP="00F15DA6">
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
        <xsl:variable name="education" select="cv:education[cv:type = 'EDUCATION']"/>
        <xsl:if test="$education">
          <w:p w14:paraId="6C209D83" w14:textId="48D9D99D" w:rsidR="001860B4" w:rsidRDefault="001860B4" w:rsidP="001860B4">
            <w:pPr>
              <w:pStyle w:val="Kop1"/>
            </w:pPr>
            <w:r>
              <w:t>Opleiding</w:t>
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
              <w:gridCol w:w="3164"/>
              <w:gridCol w:w="3164"/>
              <w:gridCol w:w="3164"/>
            </w:tblGrid>
            <w:tr w:rsidR="001860B4" w14:paraId="0B48CA77" w14:textId="77777777" w:rsidTr="000B7B5E">
              <w:tc>
                <w:tcPr>
                  <w:tcW w:w="3164" w:type="dxa"/>
                </w:tcPr>
                <w:p w14:paraId="3A478FD2" w14:textId="4AEE9AAE" w:rsidR="001860B4" w:rsidRDefault="001860B4" w:rsidP="000B7B5E">
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
                  <w:tcW w:w="3164" w:type="dxa"/>
                </w:tcPr>
                <w:p w14:paraId="66652E0C" w14:textId="2130757E" w:rsidR="001860B4" w:rsidRDefault="001860B4"
                     w:rsidP="000B7B5E">
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
                  <w:tcW w:w="3164" w:type="dxa"/>
                </w:tcPr>
                <w:p w14:paraId="52A47C7E" w14:textId="4A1C98C1" w:rsidR="001860B4" w:rsidRDefault="001860B4"
                     w:rsidP="000B7B5E">
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
            <xsl:apply-templates select="$education">
              <xsl:sort select="cv:yearTo" data-type="number" order="descending"/>
            </xsl:apply-templates>
          </w:tbl>
        </xsl:if>
        <!--

        TRAINING

        -->
        <xsl:variable name="training" select="cv:education[cv:type = 'TRAINING']"/>
        <xsl:if test="$training">
          <w:p w14:paraId="6600C847" w14:textId="2432E297" w:rsidR="001860B4" w:rsidRDefault="001860B4" w:rsidP="001860B4">
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
              <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
            </w:tblPr>
            <w:tblGrid>
              <w:gridCol w:w="3164"/>
              <w:gridCol w:w="3164"/>
              <w:gridCol w:w="3164"/>
            </w:tblGrid>
            <w:tr w:rsidR="001860B4" w14:paraId="185231E8" w14:textId="77777777" w:rsidTr="000B7B5E">
              <w:tc>
                <w:tcPr>
                  <w:tcW w:w="3164" w:type="dxa"/>
                </w:tcPr>
                <w:p w14:paraId="47102961" w14:textId="549871FC" w:rsidR="001860B4" w:rsidRDefault="001860B4" w:rsidP="000B7B5E">
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
                  <w:tcW w:w="3164" w:type="dxa"/>
                </w:tcPr>
                <w:p w14:paraId="5210430E" w14:textId="77777777" w:rsidR="001860B4" w:rsidRDefault="001860B4" w:rsidP="000B7B5E">
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
                  <w:tcW w:w="3164" w:type="dxa"/>
                </w:tcPr>
                <w:p w14:paraId="54E9619A" w14:textId="45D64A8B" w:rsidR="001860B4" w:rsidRDefault="001860B4" w:rsidP="000B7B5E">
                  <w:pPr>
                    <w:pStyle w:val="Kop2"/>
                    <w:outlineLvl w:val="1"/>
                  </w:pPr>
                  <w:r>
                    <w:t>Certificaten</w:t>
                  </w:r>
                </w:p>
              </w:tc>
            </w:tr>
            <xsl:apply-templates select="$training">
              <xsl:sort select="cv:yearTo" data-type="number" order="descending"/>
            </xsl:apply-templates>
          </w:tbl>
        </xsl:if>
        <!--

        PUBLICATIONS

        -->
        <xsl:variable name="publications" select="cv:publication"/>
        <xsl:if test="$publications">
          <w:p w14:paraId="409CC56D" w14:textId="55003D82" w:rsidR="001860B4" w:rsidRDefault="001860B4" w:rsidP="001860B4">
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
              <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
            </w:tblPr>
            <w:tblGrid>
              <w:gridCol w:w="708"/>
              <w:gridCol w:w="2410"/>
              <w:gridCol w:w="3119"/>
              <w:gridCol w:w="3261"/>
            </w:tblGrid>
            <w:tr w:rsidR="001860B4" w14:paraId="6575444B" w14:textId="77777777" w:rsidTr="001860B4">
              <w:tc>
                <w:tcPr>
                  <w:tcW w:w="708" w:type="dxa"/>
                </w:tcPr>
                <w:p w14:paraId="0B2114F9" w14:textId="30FD0186" w:rsidR="001860B4" w:rsidRDefault="001860B4" w:rsidP="001860B4">
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
                  <w:tcW w:w="2410" w:type="dxa"/>
                </w:tcPr>
                <w:p w14:paraId="3E786C01" w14:textId="6055BD31" w:rsidR="001860B4" w:rsidRDefault="001860B4" w:rsidP="000B7B5E">
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
                  <w:tcW w:w="3119" w:type="dxa"/>
                </w:tcPr>
                <w:p w14:paraId="594EC8C1" w14:textId="30B63790" w:rsidR="001860B4" w:rsidRDefault="001860B4" w:rsidP="000B7B5E">
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
                  <w:tcW w:w="3261" w:type="dxa"/>
                </w:tcPr>
                <w:p w14:paraId="2CD43EAD" w14:textId="13C86D98" w:rsidR="001860B4" w:rsidRDefault="001860B4" w:rsidP="001860B4">
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
        <xsl:variable name="interests" select="cv:cv/cv:interests/cv:nl_NL"/>
        <xsl:if test="$interests">
          <w:p w14:paraId="1227FA0A" w14:textId="1961BDE8" w:rsidR="001860B4" w:rsidRDefault="001860B4" w:rsidP="001860B4">
            <w:pPr>
              <w:pStyle w:val="Kop1"/>
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
          <w:p w14:paraId="33B477DB" w14:textId="1CC053B4" w:rsidR="001860B4" w:rsidRDefault="001860B4" w:rsidP="001860B4">
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
              <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
            </w:tblPr>
            <w:tblGrid>
              <w:gridCol w:w="9498"/>
            </w:tblGrid>
            <xsl:apply-templates select="$references"/>
          </w:tbl>
        </xsl:if>
        <!--

        EXPERIENCE

        -->
        <w:p w14:paraId="422E787B" w14:textId="55333B6C" w:rsidR="00CA50C8" w:rsidRDefault="00CA50C8" w:rsidP="00BB35DE">
          <w:r>
            <w:br w:type="page"/>
          </w:r>
        </w:p>
        <w:p w14:paraId="21955C12" w14:textId="009E8DC2" w:rsidR="00BF3AD1" w:rsidRPr="008C7521" w:rsidRDefault="00BF3AD1" w:rsidP="008C7521">
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
              <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F19100"/>
              <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:insideH w:val="single" w:sz="4" w:space="0" w:color="F19100"/>
              <w:insideV w:val="dashed" w:sz="4" w:space="0" w:color="F19100"/>
            </w:tblBorders>
            <w:tblLayout w:type="fixed"/>
            <w:tblCellMar>
              <w:left w:w="0" w:type="dxa"/>
              <w:bottom w:w="113" w:type="dxa"/>
              <w:right w:w="0" w:type="dxa"/>
            </w:tblCellMar>
            <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
          </w:tblPr>
          <w:tblGrid>
            <w:gridCol w:w="2098"/>
            <w:gridCol w:w="7400"/>
          </w:tblGrid>
          <xsl:apply-templates select="cv:experience[cv:includeInCv = 'true']">
            <xsl:sort select="cv:sortIndex" data-type="number"/>
          </xsl:apply-templates>
        </w:tbl>
        <w:p w14:paraId="258AC442" w14:textId="77777777" w:rsidR="00A52C14" w:rsidRDefault="00A52C14" w:rsidP="00A52C14"/>
        <w:sectPr w:rsidR="00A52C14" w:rsidSect="004D5885">
          <w:type w:val="continuous"/>
          <w:pgSz w:w="11906" w:h="16838" w:code="9"/>
          <w:pgMar w:top="1843" w:right="707" w:bottom="1701" w:left="1701" w:header="714" w:footer="641" w:gutter="0"/>
          <w:cols w:space="708"/>
          <w:titlePg/>
          <w:docGrid w:linePitch="360"/>
        </w:sectPr>
      </w:body>
    </w:document>
  </xsl:template>

  <!-- SKILL SECTION -->
  <xsl:template name="skill-section">
    <xsl:param name="category"/>
    <xsl:param name="appendColumnBreak"/>
    <xsl:variable name="skills" select="cv:skill[cv:category = $category]"/>
    <xsl:choose>
      <xsl:when test="$skills">
        <w:p w14:paraId="6097DCCD" w14:textId="4767636E" w:rsidR="00BF29B7" w:rsidRPr="00C14BDE" w:rsidRDefault="008317EA" w:rsidP="00C14BDE">
          <w:pPr>
            <w:pStyle w:val="Kop2"/>
          </w:pPr>
          <w:r>
            <w:t><xsl:apply-templates select="$skills[1]/cv:category" mode="skill-category"/></w:t>
          </w:r>
        </w:p>
        <xsl:apply-templates select="$skills">
          <xsl:with-param name="appendColumnBreak"><xsl:value-of select="$appendColumnBreak"/></xsl:with-param>
        </xsl:apply-templates>
      </xsl:when>
      <xsl:when test="$appendColumnBreak = 'true'">
        <w:p w14:paraId="0F728A97" w14:textId="77777777" w:rsidR="000A5FCA" w:rsidRDefault="000A5FCA" w:rsidP="000A5FCA">
          <w:r>
            <w:br w:type="column"/>
          </w:r>
        </w:p>
      </xsl:when>
    </xsl:choose>
  </xsl:template>

  <!-- SKILL -->
  <xsl:template match="cv:skill">
    <xsl:param name="appendColumnBreak">false</xsl:param>
    <w:p w14:paraId="0F728A97" w14:textId="77777777" w:rsidR="000A5FCA" w:rsidRDefault="000A5FCA" w:rsidP="000A5FCA">
      <w:pPr>
        <w:pStyle w:val="Valori-blauw"/>
        <w:tabs>
          <w:tab w:val="clear" w:pos="2835"/>
          <w:tab w:val="right" w:pos="2977"/>
        </w:tabs>
        <w:rPr>
          <w:rStyle w:val="Valori-niveau"/>
        </w:rPr>
      </w:pPr>
      <w:r w:rsidRPr="00752D43">
        <w:rPr>
          <w:rStyle w:val="Valori-skillChar"/>
        </w:rPr>
        <w:t><xsl:value-of select="cv:description/cv:nl_NL"/></w:t>
        <w:tab/>
      </w:r>
      <w:r w:rsidRPr="00C14BDE">
        <w:rPr>
          <w:rStyle w:val="Valori-niveau"/>
        </w:rPr>
        <w:t><xsl:apply-templates select="cv:skillLevel" mode="skill-level"/></w:t>
        <xsl:if test="$appendColumnBreak = 'true' and position() = last()">
          <w:br w:type="column"/>
        </xsl:if>
      </w:r>
    </w:p>
  </xsl:template>

  <!-- EXPERIENCE - OVERVIEW -->
  <xsl:template match="cv:experience" mode="overview">
    <w:tr w:rsidR="00F15DA6" w14:paraId="6F0C0FFB" w14:textId="77777777" w:rsidTr="001860B4">
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="3164" w:type="dxa"/>
        </w:tcPr>
        <w:p w14:paraId="4BB31EAA" w14:textId="681AB43A" w:rsidR="00F15DA6" w:rsidRDefault="00F15DA6" w:rsidP="001860B4">
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
          <w:tcW w:w="3164" w:type="dxa"/>
        </w:tcPr>
        <w:p w14:paraId="31AC2F55" w14:textId="399AB44B" w:rsidR="00F15DA6" w:rsidRDefault="001860B4" w:rsidP="001860B4">
          <w:r>
            <w:t><xsl:value-of select="cv:role/cv:nl_NL"/></w:t>
          </w:r>
        </w:p>
      </w:tc>
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="3164" w:type="dxa"/>
        </w:tcPr>
        <w:p w14:paraId="35A0A5F9" w14:textId="7A864B0E" w:rsidR="00F15DA6" w:rsidRDefault="001860B4" w:rsidP="001860B4">
          <w:r>
            <w:t><xsl:value-of select="cv:client"/></w:t>
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
          <w:tcW w:w="3164" w:type="dxa"/>
        </w:tcPr>
        <w:p w14:paraId="028BDECC" w14:textId="0BDF33E7" w:rsidR="000A5FCA" w:rsidRDefault="000A5FCA" w:rsidP="000B7B5E">
          <w:r>
            <w:t><xsl:value-of select="cv:name/cv:nl_NL"/></w:t>
          </w:r>
        </w:p>
      </w:tc>
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="3164" w:type="dxa"/>
        </w:tcPr>
        <w:p w14:paraId="4AEEE7FD" w14:textId="373E4A48" w:rsidR="001860B4" w:rsidRDefault="001860B4" w:rsidP="000B7B5E">
          <w:r>
            <w:t><xsl:value-of select="cv:institution"/></w:t>
          </w:r>
        </w:p>
      </w:tc>
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="3164" w:type="dxa"/>
        </w:tcPr>
        <w:p w14:paraId="4A46B160" w14:textId="391ADBDB" w:rsidR="001860B4" w:rsidRDefault="001860B4" w:rsidP="000B7B5E">
          <w:r>
            <xsl:variable name="yearFrom" select="cv:yearFrom"/>
            <xsl:variable name="yearTo" select="cv:yearTo"/>
            <w:t>
              <xsl:if test="$yearFrom">
                <xsl:value-of select="$yearFrom"/>
                <xsl:text> – </xsl:text>
              </xsl:if>
              <xsl:choose>
                <xsl:when test="$yearTo"><xsl:value-of select="$yearTo"/></xsl:when>
                <xsl:otherwise>heden</xsl:otherwise>
              </xsl:choose>
            </w:t>
          </w:r>
          <w:r w:rsidRPr="001860B4">
            <w:rPr>
              <w:rStyle w:val="Valori-geel"/>
            </w:rPr>
            <w:t xml:space="preserve"> // </w:t>
          </w:r>
          <w:r w:rsidRPr="00666ED6">
            <w:t><xsl:apply-templates select="cv:result" mode="education-result"/></w:t>
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
          <w:tcW w:w="708" w:type="dxa"/>
        </w:tcPr>
        <w:p w14:paraId="7CD275C5" w14:textId="2B1B7994" w:rsidR="001860B4" w:rsidRDefault="001860B4" w:rsidP="000B7B5E">
          <w:r>
            <w:t><xsl:value-of select="cv:year"/></w:t>
          </w:r>
        </w:p>
      </w:tc>
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="2410" w:type="dxa"/>
        </w:tcPr>
        <w:p w14:paraId="010D5F50" w14:textId="215C545B" w:rsidR="001860B4" w:rsidRDefault="001860B4" w:rsidP="000B7B5E">
          <w:r>
            <w:t><xsl:value-of select="cv:media"/></w:t>
          </w:r>
        </w:p>
      </w:tc>
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="3119" w:type="dxa"/>
        </w:tcPr>
        <w:p w14:paraId="5EC9DC18" w14:textId="73E77901" w:rsidR="001860B4" w:rsidRDefault="000A5FCA" w:rsidP="000B7B5E">
          <w:r>
            <w:t><xsl:value-of select="cv:title/cv:nl_NL"/></w:t>
          </w:r>
        </w:p>
      </w:tc>
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="3261" w:type="dxa"/>
        </w:tcPr>
        <w:p w14:paraId="790E2453" w14:textId="0F2E4324" w:rsidR="001860B4" w:rsidRDefault="001860B4" w:rsidP="000B7B5E">
          <w:r>
            <w:t><xsl:value-of select="cv:description/cv:nl_NL"/></w:t>
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
          <w:tcW w:w="9498" w:type="dxa"/>
        </w:tcPr>
        <w:p w14:paraId="2D66D278" w14:textId="68175263" w:rsidR="001860B4" w:rsidRPr="00666ED6" w:rsidRDefault="001860B4" w:rsidP="00666ED6">
          <w:pPr>
            <w:pStyle w:val="Kop2"/>
            <w:outlineLvl w:val="1"/>
          </w:pPr>
          <w:r w:rsidRPr="00666ED6">
            <w:t xml:space="preserve"><xsl:value-of select="cv:referentName"/> <xsl:value-of select="cv:referentFunction/cv:nl_NL"/></w:t>
          </w:r>
        </w:p>
      </w:tc>
    </w:tr>
    <w:tr w:rsidR="001860B4" w14:paraId="18A8EE06" w14:textId="77777777" w:rsidTr="001860B4">
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="9498" w:type="dxa"/>
        </w:tcPr>
        <w:p w14:paraId="3BE4A452" w14:textId="20C5834B" w:rsidR="001860B4" w:rsidRDefault="001860B4" w:rsidP="000B7B5E">
          <w:proofErr w:type="spellStart"/>
          <w:r>
            <w:t><xsl:value-of select="cv:description/cv:nl_NL"/></w:t>
          </w:r>
        </w:p>
      </w:tc>
    </w:tr>
  </xsl:template>

  <!-- EXPERIENCE -->
  <xsl:template match="cv:experience">
    <w:tr w:rsidR="00A52C14" w14:paraId="480B31F7" w14:textId="77777777" w:rsidTr="004D5885">
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="2098" w:type="dxa"/>
        </w:tcPr>
        <w:p w14:paraId="1F9BB23A" w14:textId="5CBB339A" w:rsidR="00A52C14" w:rsidRDefault="00A52C14" w:rsidP="00666ED6">
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
        <w:p w14:paraId="2AD5877B" w14:textId="77777777" w:rsidR="00A52C14" w:rsidRPr="00A52C14" w:rsidRDefault="00A52C14" w:rsidP="00666ED6">
          <w:pPr>
            <w:rPr>
              <w:rStyle w:val="Valori-geel"/>
            </w:rPr>
          </w:pPr>
          <w:r w:rsidRPr="00A52C14">
            <w:rPr>
              <w:rStyle w:val="Valori-geel"/>
            </w:rPr>
            <w:t><xsl:value-of select="cv:role/cv:nl_NL"/></w:t>
          </w:r>
        </w:p>
        <w:p w14:paraId="533DCC22" w14:textId="190759EB" w:rsidR="00A52C14" w:rsidRDefault="00A52C14" w:rsidP="00666ED6">
          <w:r w:rsidRPr="00A52C14">
            <w:rPr>
              <w:rStyle w:val="Valori-geel"/>
            </w:rPr>
            <w:t><xsl:value-of select="cv:client"/></w:t>
          </w:r>
        </w:p>
      </w:tc>
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="7400" w:type="dxa"/>
        </w:tcPr>
        <xsl:apply-templates select="cv:assignment/cv:nl_NL" mode="markdown"/>
        <w:p w14:paraId="5C3DDAF9" w14:textId="77777777" w:rsidR="00A52C14" w:rsidRDefault="00A52C14" w:rsidP="00A52C14"/>
        <xsl:variable name="activities" select="cv:activities/cv:nl_NL"/>
        <xsl:if test="$activities">
          <w:p w14:paraId="4C066476" w14:textId="77777777" w:rsidR="00A52C14" w:rsidRDefault="00A52C14" w:rsidP="00A52C14">
            <w:r>
              <w:t>Taken/werkzaamheden:</w:t>
            </w:r>
          </w:p>
          <xsl:apply-templates select="$activities" mode="markdown"/>
        </xsl:if>
        <xsl:variable name="results" select="cv:results/cv:nl_NL"/>
        <xsl:if test="$results">
          <w:p w14:paraId="05A636A2" w14:textId="77777777" w:rsidR="00A52C14" w:rsidRPr="00C97881" w:rsidRDefault="00A52C14" w:rsidP="00A52C14">
            <w:r>
              <w:t>Resultaat:</w:t>
            </w:r>
          </w:p>
          <xsl:apply-templates select="$results" mode="markdown"/>
        </xsl:if>
        <xsl:variable name="keywords" select="cv:keywords/cv:nl_NL"/>
        <xsl:if test="$keywords">
          <w:p w14:paraId="62A3EFF7" w14:textId="77777777" w:rsidR="00A52C14" w:rsidRPr="00C97881" w:rsidRDefault="00A52C14" w:rsidP="00A52C14">
            <w:r>
              <w:t>Werkomgeving:</w:t>
            </w:r>
            <w:r w:rsidRPr="00C97881">
              <w:t xml:space="preserve"> </w:t>
            </w:r>
          </w:p>
          <xsl:apply-templates select="$keywords" mode="markdown"/>
        </xsl:if>
      </w:tc>
    </w:tr>
  </xsl:template>

</xsl:stylesheet>