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

  <xsl:import href="../common-per-locale.xsl" />

  <xsl:output method="xml" standalone="yes" encoding="UTF-8" indent="no" />

  <xsl:template match="/">
    <xsl:apply-templates select="cv:root"/>
  </xsl:template>

  <xsl:template match="cv:root">
    <w:document mc:Ignorable="w14">
      <w:body>
        <w:tbl>
          <w:tblPr>
            <w:tblStyle w:val="Tabelraster"/>
            <w:tblW w:w="9498" w:type="dxa"/>
            <w:tblBorders>
              <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
            </w:tblBorders>
            <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
          </w:tblPr>
          <w:tblGrid>
            <w:gridCol w:w="9498"/>
          </w:tblGrid>
          <w:tr w:rsidR="00C97881" w14:paraId="422E7796" w14:textId="77777777" w:rsidTr="00F63003">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="9498" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F39900"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E7795" w14:textId="77777777" w:rsidR="00C97881" w:rsidRPr="009D3B92" w:rsidRDefault="00C97881" w:rsidP="00CA50C8">
                <w:pPr>
                  <w:pStyle w:val="Stijl1"/>
                  <w:rPr>
                    <w:b/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="009D3B92">
                  <w:rPr>
                    <w:b/>
                  </w:rPr>
                  <w:t>Profielschets</w:t>
                </w:r>
              </w:p>
            </w:tc>
          </w:tr>
          <w:tr w:rsidR="00C97881" w14:paraId="422E779A" w14:textId="77777777" w:rsidTr="00F63003">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="9498" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="single" w:sz="4" w:space="0" w:color="F39900"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E7797" w14:textId="77777777" w:rsidR="00C97881" w:rsidRDefault="00C97881" w:rsidP="00B13743"/>
              <w:p w14:paraId="422E7799" w14:textId="11773C42" w:rsidR="00C97881" w:rsidRDefault="00241B19" w:rsidP="007C28F4">
                <w:r>
                  <w:t><xsl:value-of select="cv:cv/cv:profile"/></w:t>
                </w:r>
              </w:p>
            </w:tc>
          </w:tr>
        </w:tbl>
        <w:p w14:paraId="422E779B" w14:textId="77777777" w:rsidR="004706F5" w:rsidRDefault="004706F5" w:rsidP="0080064E"/>
        <w:p w14:paraId="422E77A7" w14:textId="77777777" w:rsidR="005F1B7E" w:rsidRDefault="005F1B7E" w:rsidP="0080064E"/>

        <!--
        SKILL
        -->
        <w:tbl>
          <w:tblPr>
            <w:tblStyle w:val="Tabelraster"/>
            <w:tblW w:w="9498" w:type="dxa"/>
            <w:tblBorders>
              <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
            </w:tblBorders>
            <w:tblLayout w:type="fixed"/>
            <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
          </w:tblPr>
          <w:tblGrid>
            <w:gridCol w:w="2268"/>
            <w:gridCol w:w="800"/>
            <w:gridCol w:w="2461"/>
            <w:gridCol w:w="754"/>
            <w:gridCol w:w="2364"/>
            <w:gridCol w:w="851"/>
          </w:tblGrid>
          <w:tr w:rsidR="00814E35" w14:paraId="422E77A9" w14:textId="77777777" w:rsidTr="55ED3856">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="9498" w:type="dxa"/>
                <w:gridSpan w:val="6"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F39900" w:themeColor="text2"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77A8" w14:textId="77777777" w:rsidR="00814E35" w:rsidRPr="009D3B92" w:rsidRDefault="00814E35" w:rsidP="007A7825">
                <w:pPr>
                  <w:pStyle w:val="Stijl1"/>
                  <w:rPr>
                    <w:b/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="009D3B92">
                  <w:rPr>
                    <w:b/>
                  </w:rPr>
                  <w:t>Kennis &amp; vaardigheden</w:t>
                </w:r>
              </w:p>
            </w:tc>
          </w:tr>
          <w:tr w:rsidR="00F137DF" w14:paraId="422E77B0" w14:textId="77777777" w:rsidTr="55ED3856">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2268" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="single" w:sz="4" w:space="0" w:color="F39900" w:themeColor="text2"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77AA" w14:textId="77777777" w:rsidR="00A64FC2" w:rsidRPr="009153D7" w:rsidRDefault="00A64FC2" w:rsidP="007A7825">
                <w:pPr>
                  <w:rPr>
                    <w:color w:val="002060"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="800" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="single" w:sz="4" w:space="0" w:color="F39900" w:themeColor="text2"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77AB" w14:textId="77777777" w:rsidR="00A64FC2" w:rsidRPr="009153D7" w:rsidRDefault="00A64FC2" w:rsidP="007A7825">
                <w:pPr>
                  <w:rPr>
                    <w:color w:val="002060"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2461" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="single" w:sz="4" w:space="0" w:color="F39900" w:themeColor="text2"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77AC" w14:textId="77777777" w:rsidR="00A64FC2" w:rsidRPr="00C21213" w:rsidRDefault="00A64FC2" w:rsidP="007A7825">
                <w:pPr>
                  <w:rPr>
                    <w:color w:val="002060"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="754" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="single" w:sz="4" w:space="0" w:color="F39900" w:themeColor="text2"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77AD" w14:textId="77777777" w:rsidR="00A64FC2" w:rsidRDefault="00A64FC2" w:rsidP="007A7825"/>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2364" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="single" w:sz="4" w:space="0" w:color="F39900" w:themeColor="text2"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77AE" w14:textId="77777777" w:rsidR="00A64FC2" w:rsidRDefault="00A64FC2" w:rsidP="007A7825"/>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="851" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="single" w:sz="4" w:space="0" w:color="F39900" w:themeColor="text2"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77AF" w14:textId="77777777" w:rsidR="00A64FC2" w:rsidRDefault="00A64FC2" w:rsidP="007A7825"/>
            </w:tc>
          </w:tr>
          <w:tr w:rsidR="00F137DF" w:rsidRPr="00A64FC2" w14:paraId="422E77B7" w14:textId="77777777" w:rsidTr="55ED3856">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2268" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77B1" w14:textId="77777777" w:rsidR="00A64FC2" w:rsidRPr="00F63003" w:rsidRDefault="00A64FC2" w:rsidP="007A7825">
                <w:pPr>
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                  <w:t>Talen</w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="800" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77B2" w14:textId="77777777" w:rsidR="00A64FC2" w:rsidRPr="00F63003" w:rsidRDefault="00A64FC2" w:rsidP="007A7825">
                <w:pPr>
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2461" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77B3" w14:textId="77777777" w:rsidR="00A64FC2" w:rsidRPr="00F63003" w:rsidRDefault="00057059" w:rsidP="007A7825">
                <w:pPr>
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                  <w:t>Databases</w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="754" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77B4" w14:textId="77777777" w:rsidR="00A64FC2" w:rsidRPr="00F63003" w:rsidRDefault="00A64FC2" w:rsidP="007A7825">
                <w:pPr>
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2364" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77B5" w14:textId="77777777" w:rsidR="00A64FC2" w:rsidRPr="00F63003" w:rsidRDefault="00A64FC2" w:rsidP="007A7825">
                <w:pPr>
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                  <w:t>Programmeren</w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="851" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77B6" w14:textId="77777777" w:rsidR="00A64FC2" w:rsidRPr="00F63003" w:rsidRDefault="00A64FC2" w:rsidP="007A7825">
                <w:pPr>
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
          </w:tr>
          <w:tr w:rsidR="00244516" w14:paraId="422E77BE" w14:textId="77777777" w:rsidTr="55ED3856">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2268" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77B8" w14:textId="1317CDD2" w:rsidR="00244516" w:rsidRPr="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                </w:pPr>
                <w:proofErr w:type="spellStart"/>
                <w:r>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t>SKILL_description</w:t>
                </w:r>
                <w:proofErr w:type="spellEnd"/>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t xml:space="preserve"> </w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="800" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77B9" w14:textId="7C86DD46" w:rsidR="00244516" w:rsidRPr="00B75B87" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:hAnsi="Wingdings"/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t></w:t>
                </w:r>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t></w:t>
                </w:r>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t></w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2461" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77BA" w14:textId="2263C547" w:rsidR="00244516" w:rsidRPr="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                </w:pPr>
                <w:r>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t>SKILL_description</w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="754" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77BB" w14:textId="04308FBA" w:rsidR="00244516" w:rsidRPr="00B75B87" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:hAnsi="Wingdings"/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t></w:t>
                </w:r>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t></w:t>
                </w:r>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t></w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2364" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77BC" w14:textId="10954A76" w:rsidR="00244516" w:rsidRPr="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                </w:pPr>
                <w:r>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t>SKILL_description</w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="851" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77BD" w14:textId="51FB3B6C" w:rsidR="00244516" w:rsidRPr="00B75B87" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:hAnsi="Wingdings"/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t></w:t>
                </w:r>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t></w:t>
                </w:r>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t></w:t>
                </w:r>
              </w:p>
            </w:tc>
          </w:tr>
          <w:tr w:rsidR="00244516" w14:paraId="422E77DA" w14:textId="77777777" w:rsidTr="55ED3856">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2268" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77D4" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="800" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77D5" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00B75B87" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:hAnsi="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2461" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77D6" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="754" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77D7" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00B75B87" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:hAnsi="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2364" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77D8" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="851" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77D9" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00B75B87" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:hAnsi="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
          </w:tr>
          <w:tr w:rsidR="00244516" w:rsidRPr="00A64FC2" w14:paraId="422E77E1" w14:textId="77777777" w:rsidTr="55ED3856">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2268" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77DB" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                  <w:t>Branches</w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="800" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77DC" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00B75B87" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:hAnsi="Wingdings"/>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2461" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77DD" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                  <w:t>Applicaties</w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="754" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77DE" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00B75B87" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:hAnsi="Wingdings"/>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2364" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77DF" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                  <w:t>Methodes</w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="851" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77E0" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00B75B87" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:hAnsi="Wingdings"/>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
          </w:tr>
          <w:tr w:rsidR="00244516" w:rsidRPr="00A64FC2" w14:paraId="422E77E8" w14:textId="77777777" w:rsidTr="55ED3856">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2268" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77E2" w14:textId="7E99CCEB" w:rsidR="00244516" w:rsidRPr="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                </w:pPr>
                <w:r>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t>SKILL_description</w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="800" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77E3" w14:textId="4FDDB643" w:rsidR="00244516" w:rsidRPr="00B75B87" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:hAnsi="Wingdings"/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t></w:t>
                </w:r>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t></w:t>
                </w:r>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t></w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2461" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77E4" w14:textId="77E0691C" w:rsidR="00244516" w:rsidRPr="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:color w:val="0A1C5C" w:themeColor="text1"/>
                  </w:rPr>
                </w:pPr>
                <w:r>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t>SKILL_description</w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="754" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77E5" w14:textId="7FFD5841" w:rsidR="00244516" w:rsidRPr="00B75B87" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:hAnsi="Wingdings"/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t></w:t>
                </w:r>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t></w:t>
                </w:r>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t></w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2364" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77E6" w14:textId="6BA268F7" w:rsidR="00244516" w:rsidRPr="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:color w:val="0A1C5C" w:themeColor="text1"/>
                  </w:rPr>
                </w:pPr>
                <w:r>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t>SKILL_description</w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="851" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77E7" w14:textId="2071F1B5" w:rsidR="00244516" w:rsidRPr="00B75B87" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:hAnsi="Wingdings"/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t></w:t>
                </w:r>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t></w:t>
                </w:r>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t></w:t>
                </w:r>
              </w:p>
            </w:tc>
          </w:tr>
          <w:tr w:rsidR="00244516" w14:paraId="422E7804" w14:textId="77777777" w:rsidTr="55ED3856">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2268" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77FE" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="800" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E77FF" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00B75B87" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:hAnsi="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2461" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E7800" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="754" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E7801" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00B75B87" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:hAnsi="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2364" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E7802" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="851" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E7803" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00B75B87" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:hAnsi="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
          </w:tr>
          <w:tr w:rsidR="00244516" w:rsidRPr="00A64FC2" w14:paraId="422E780B" w14:textId="77777777" w:rsidTr="55ED3856">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2268" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E7805" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                  <w:t>Expertises</w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="800" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E7806" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00B75B87" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:hAnsi="Wingdings"/>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2461" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E7807" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                  <w:t>Tools</w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="754" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E7808" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00B75B87" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:hAnsi="Wingdings"/>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2364" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E7809" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                  <w:t>Certificeringen</w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="851" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E780A" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00B75B87" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:hAnsi="Wingdings"/>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
          </w:tr>
          <w:tr w:rsidR="00244516" w:rsidRPr="00F63003" w14:paraId="422E7812" w14:textId="77777777" w:rsidTr="55ED3856">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2268" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E780C" w14:textId="49286BD8" w:rsidR="00244516" w:rsidRPr="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:color w:val="0A1B5C"/>
                  </w:rPr>
                </w:pPr>
                <w:r>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t>SKILL_description</w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="800" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E780D" w14:textId="093DD2E6" w:rsidR="00244516" w:rsidRPr="00B75B87" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:hAnsi="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t></w:t>
                </w:r>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t></w:t>
                </w:r>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t></w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2461" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E780E" w14:textId="3338305F" w:rsidR="00244516" w:rsidRPr="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                </w:pPr>
                <w:r>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t>SKILL_description</w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="754" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E780F" w14:textId="1200A4BC" w:rsidR="00244516" w:rsidRPr="00B75B87" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:hAnsi="Wingdings"/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t></w:t>
                </w:r>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t></w:t>
                </w:r>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t></w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2364" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E7810" w14:textId="18BBFA76" w:rsidR="00244516" w:rsidRPr="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                </w:pPr>
                <w:r>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t>SKILL_description</w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="851" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E7811" w14:textId="29FC2F41" w:rsidR="00244516" w:rsidRPr="00B75B87" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:hAnsi="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
          </w:tr>
          <w:tr w:rsidR="00244516" w:rsidRPr="00F63003" w14:paraId="422E782E" w14:textId="77777777" w:rsidTr="55ED3856">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2268" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E7828" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="800" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E7829" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2461" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E782A" w14:textId="01760788" w:rsidR="00244516" w:rsidRPr="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="754" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E782B" w14:textId="64E2548B" w:rsidR="00244516" w:rsidRPr="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
                    <w:color w:val="0A1C5C" w:themeColor="text1"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2364" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E782C" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="851" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="nil"/>
                  <w:bottom w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E782D" w14:textId="77777777" w:rsidR="00244516" w:rsidRPr="00B75B87" w:rsidRDefault="00244516" w:rsidP="00244516">
                <w:pPr>
                  <w:rPr>
                    <w:rFonts w:ascii="Wingdings" w:hAnsi="Wingdings"/>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                </w:pPr>
              </w:p>
            </w:tc>
          </w:tr>
        </w:tbl>
        <w:p w14:paraId="53D0C375" w14:textId="77777777" w:rsidR="00244516" w:rsidRDefault="00244516" w:rsidP="00244516">
          <w:pPr>
            <w:numPr>
              <w:ilvl w:val="0"/>
              <w:numId w:val="0"/>
            </w:numPr>
            <w:rPr>
              <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
              <w:color w:val="0A1C5C"/>
            </w:rPr>
          </w:pPr>
        </w:p>
        <w:p w14:paraId="6C7C904F" w14:textId="5EF331B9" w:rsidR="00F63003" w:rsidRDefault="00244516" w:rsidP="00244516">
          <w:pPr>
            <w:numPr>
              <w:ilvl w:val="0"/>
              <w:numId w:val="0"/>
            </w:numPr>
          </w:pPr>
          <w:r w:rsidRPr="00F63003">
            <w:rPr>
              <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
              <w:color w:val="0A1C5C"/>
            </w:rPr>
            <w:t></w:t>
          </w:r>
          <w:r w:rsidRPr="00F63003">
            <w:rPr>
              <w:color w:val="0A1C5C"/>
            </w:rPr>
            <w:t xml:space="preserve"> foundation  </w:t>
          </w:r>
          <w:r w:rsidRPr="00F63003">
            <w:rPr>
              <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
              <w:color w:val="0A1C5C"/>
            </w:rPr>
            <w:t></w:t>
          </w:r>
          <w:r w:rsidRPr="00F63003">
            <w:rPr>
              <w:color w:val="0A1C5C"/>
            </w:rPr>
            <w:t xml:space="preserve"> advanced  </w:t>
          </w:r>
          <w:r w:rsidRPr="00F63003">
            <w:rPr>
              <w:rFonts w:ascii="Wingdings" w:eastAsia="Wingdings" w:hAnsi="Wingdings" w:cs="Wingdings"/>
              <w:color w:val="0A1C5C"/>
            </w:rPr>
            <w:t></w:t>
          </w:r>
          <w:r w:rsidRPr="00F63003">
            <w:rPr>
              <w:color w:val="0A1C5C"/>
            </w:rPr>
            <w:t xml:space="preserve"> expert</w:t>
          </w:r>
          <w:r w:rsidR="00F63003" w:rsidRPr="00360F7D">
            <w:br w:type="page"/>
          </w:r>
        </w:p>

        <!--
        EXPERIENCE - OVERVIEW
        -->
        <w:tbl>
          <w:tblPr>
            <w:tblStyle w:val="Tabelraster"/>
            <w:tblW w:w="9498" w:type="dxa"/>
            <w:tblBorders>
              <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
            </w:tblBorders>
            <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
          </w:tblPr>
          <w:tblGrid>
            <w:gridCol w:w="3073"/>
            <w:gridCol w:w="3073"/>
            <w:gridCol w:w="3352"/>
          </w:tblGrid>
          <w:tr w:rsidR="00AA01B7" w:rsidRPr="009D3B92" w14:paraId="2ADC19DB" w14:textId="77777777" w:rsidTr="00F63003">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="9498" w:type="dxa"/>
                <w:gridSpan w:val="3"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F39900"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="6E1B5D6D" w14:textId="545F70F0" w:rsidR="00AA01B7" w:rsidRPr="009D3B92" w:rsidRDefault="00AA01B7" w:rsidP="00AE0F8D">
                <w:pPr>
                  <w:pStyle w:val="Stijl1"/>
                  <w:rPr>
                    <w:b/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="009D3B92">
                  <w:rPr>
                    <w:b/>
                  </w:rPr>
                  <w:lastRenderedPageBreak/>
                  <w:t>WERKERVARING</w:t>
                </w:r>
              </w:p>
            </w:tc>
          </w:tr>
          <w:tr w:rsidR="00AA01B7" w:rsidRPr="00297BAF" w14:paraId="7462B8E8" w14:textId="77777777" w:rsidTr="00F63003">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="3073" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="single" w:sz="4" w:space="0" w:color="F39900"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="dashed" w:sz="4" w:space="0" w:color="F6F6F6"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="58D8B8C1" w14:textId="77777777" w:rsidR="00AA01B7" w:rsidRPr="00F63003" w:rsidRDefault="00AA01B7" w:rsidP="00AE0F8D">
                <w:pPr>
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                  <w:t>Periode</w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="3073" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="single" w:sz="4" w:space="0" w:color="F39900"/>
                  <w:left w:val="dashed" w:sz="4" w:space="0" w:color="F6F6F6"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="dashed" w:sz="4" w:space="0" w:color="F6F6F6"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="0D34A7EC" w14:textId="77777777" w:rsidR="00AA01B7" w:rsidRPr="00F63003" w:rsidRDefault="00AA01B7" w:rsidP="00AE0F8D">
                <w:pPr>
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                  <w:t>Rol</w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="3352" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="single" w:sz="4" w:space="0" w:color="F39900"/>
                  <w:left w:val="dashed" w:sz="4" w:space="0" w:color="F6F6F6"/>
                  <w:bottom w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="381ABA1D" w14:textId="77777777" w:rsidR="00AA01B7" w:rsidRPr="00F63003" w:rsidRDefault="00AA01B7" w:rsidP="00AE0F8D">
                <w:pPr>
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                  <w:t>Opdrachtgever</w:t>
                </w:r>
              </w:p>
            </w:tc>
          </w:tr>

          <xsl:apply-templates select="cv:experience" mode="overview"/>

        </w:tbl>
        <w:p w14:paraId="6F0C9091" w14:textId="1C6350A0" w:rsidR="00AA01B7" w:rsidRDefault="00AA01B7">
          <w:pPr>
            <w:rPr>
              <w:caps/>
            </w:rPr>
          </w:pPr>
        </w:p>

        <!--
        EDUCATION
        -->
        <w:tbl>
          <w:tblPr>
            <w:tblStyle w:val="Tabelraster"/>
            <w:tblW w:w="9498" w:type="dxa"/>
            <w:tblBorders>
              <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
            </w:tblBorders>
            <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
          </w:tblPr>
          <w:tblGrid>
            <w:gridCol w:w="3073"/>
            <w:gridCol w:w="3073"/>
            <w:gridCol w:w="3352"/>
          </w:tblGrid>
          <w:tr w:rsidR="00AA01B7" w14:paraId="2B25A77A" w14:textId="77777777" w:rsidTr="7A67F1BE">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="9498" w:type="dxa"/>
                <w:gridSpan w:val="3"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F39900" w:themeColor="text2"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="121783BD" w14:textId="77777777" w:rsidR="00AA01B7" w:rsidRPr="009D3B92" w:rsidRDefault="00AA01B7" w:rsidP="00AE0F8D">
                <w:pPr>
                  <w:pStyle w:val="Stijl1"/>
                  <w:rPr>
                    <w:b/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="009D3B92">
                  <w:rPr>
                    <w:b/>
                  </w:rPr>
                  <w:t>Opleidingen</w:t>
                </w:r>
              </w:p>
            </w:tc>
          </w:tr>
          <w:tr w:rsidR="00AA01B7" w:rsidRPr="00297BAF" w14:paraId="0CD6C632" w14:textId="77777777" w:rsidTr="7A67F1BE">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="3073" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="single" w:sz="4" w:space="0" w:color="F39900" w:themeColor="text2"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="dashed" w:sz="4" w:space="0" w:color="F6F6F6" w:themeColor="background1"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="5E96C78A" w14:textId="77777777" w:rsidR="00AA01B7" w:rsidRPr="00F63003" w:rsidRDefault="00AA01B7" w:rsidP="00AE0F8D">
                <w:pPr>
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                  <w:t>Opleiding</w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="3073" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="single" w:sz="4" w:space="0" w:color="F39900" w:themeColor="text2"/>
                  <w:left w:val="dashed" w:sz="4" w:space="0" w:color="F6F6F6" w:themeColor="background1"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="dashed" w:sz="4" w:space="0" w:color="F6F6F6" w:themeColor="background1"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="5971D944" w14:textId="1FB0EFC9" w:rsidR="00AA01B7" w:rsidRPr="00F63003" w:rsidRDefault="7A67F1BE" w:rsidP="7A67F1BE">
                <w:pPr>
                  <w:rPr>
                    <w:b/>
                    <w:bCs/>
                    <w:color w:val="F39900" w:themeColor="text2"/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="7A67F1BE">
                  <w:rPr>
                    <w:b/>
                    <w:bCs/>
                    <w:color w:val="F39900" w:themeColor="text2"/>
                  </w:rPr>
                  <w:t>Onderwijsinstelling</w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="3352" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="single" w:sz="4" w:space="0" w:color="F39900" w:themeColor="text2"/>
                  <w:left w:val="dashed" w:sz="4" w:space="0" w:color="F6F6F6" w:themeColor="background1"/>
                  <w:bottom w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="7FA8E143" w14:textId="77777777" w:rsidR="00AA01B7" w:rsidRPr="00F63003" w:rsidRDefault="00AA01B7" w:rsidP="00AE0F8D">
                <w:pPr>
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                  <w:t>Diploma</w:t>
                </w:r>
              </w:p>
            </w:tc>
          </w:tr>

          <xsl:apply-templates select="cv:education[cv:type = 'EDUCATION']"/>

        </w:tbl>
        <w:p w14:paraId="2918BDFA" w14:textId="77777777" w:rsidR="00AA01B7" w:rsidRDefault="00AA01B7">
          <w:pPr>
            <w:rPr>
              <w:caps/>
            </w:rPr>
          </w:pPr>
        </w:p>

        <!--
        TRAINING
        -->
        <w:tbl>
          <w:tblPr>
            <w:tblStyle w:val="Tabelraster"/>
            <w:tblpPr w:leftFromText="141" w:rightFromText="141" w:vertAnchor="text" w:horzAnchor="margin" w:tblpY="77"/>
            <w:tblW w:w="9498" w:type="dxa"/>
            <w:tblBorders>
              <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
            </w:tblBorders>
            <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
          </w:tblPr>
          <w:tblGrid>
            <w:gridCol w:w="3073"/>
            <w:gridCol w:w="3073"/>
            <w:gridCol w:w="3352"/>
          </w:tblGrid>
          <w:tr w:rsidR="00AA01B7" w14:paraId="69ABAF28" w14:textId="77777777" w:rsidTr="7A67F1BE">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="9498" w:type="dxa"/>
                <w:gridSpan w:val="3"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F39900" w:themeColor="text2"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="6F995DAD" w14:textId="0CF91645" w:rsidR="00AA01B7" w:rsidRPr="009D3B92" w:rsidRDefault="54284890" w:rsidP="54284890">
                <w:pPr>
                  <w:pStyle w:val="Stijl1"/>
                  <w:rPr>
                    <w:b/>
                    <w:bCs/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="54284890">
                  <w:rPr>
                    <w:b/>
                    <w:bCs/>
                  </w:rPr>
                  <w:t>TRAININGEN</w:t>
                </w:r>
              </w:p>
            </w:tc>
          </w:tr>
          <w:tr w:rsidR="00AA01B7" w:rsidRPr="00297BAF" w14:paraId="1D67D44F" w14:textId="77777777" w:rsidTr="7A67F1BE">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="3073" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="single" w:sz="4" w:space="0" w:color="F39900" w:themeColor="text2"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="dashed" w:sz="4" w:space="0" w:color="F6F6F6" w:themeColor="background1"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="7A6B6E5D" w14:textId="5316C728" w:rsidR="00AA01B7" w:rsidRPr="00F63003" w:rsidRDefault="7A67F1BE" w:rsidP="7A67F1BE">
                <w:pPr>
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="7A67F1BE">
                  <w:rPr>
                    <w:b/>
                    <w:bCs/>
                    <w:color w:val="F39900" w:themeColor="text2"/>
                  </w:rPr>
                  <w:t>Training</w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="3073" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="single" w:sz="4" w:space="0" w:color="F39900" w:themeColor="text2"/>
                  <w:left w:val="dashed" w:sz="4" w:space="0" w:color="F6F6F6" w:themeColor="background1"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="dashed" w:sz="4" w:space="0" w:color="F6F6F6" w:themeColor="background1"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="0675E804" w14:textId="340ED3F4" w:rsidR="00AA01B7" w:rsidRPr="00F63003" w:rsidRDefault="7A67F1BE" w:rsidP="7A67F1BE">
                <w:pPr>
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="7A67F1BE">
                  <w:rPr>
                    <w:b/>
                    <w:bCs/>
                    <w:color w:val="F39900" w:themeColor="text2"/>
                  </w:rPr>
                  <w:t>Opleidingsinstituut</w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="3352" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="single" w:sz="4" w:space="0" w:color="F39900" w:themeColor="text2"/>
                  <w:left w:val="dashed" w:sz="4" w:space="0" w:color="F6F6F6" w:themeColor="background1"/>
                  <w:bottom w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="7452893D" w14:textId="77777777" w:rsidR="00AA01B7" w:rsidRPr="00F63003" w:rsidRDefault="00AA01B7" w:rsidP="00AA01B7">
                <w:pPr>
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                  <w:t>Certificaat</w:t>
                </w:r>
              </w:p>
            </w:tc>
          </w:tr>

          <w:tr w:rsidR="00AA01B7" w14:paraId="433A7857" w14:textId="77777777" w:rsidTr="7A67F1BE">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="3073" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="dashed" w:sz="4" w:space="0" w:color="F6F6F6" w:themeColor="background1"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="3348AAF3" w14:textId="6EC0B993" w:rsidR="00AA01B7" w:rsidRDefault="00EA128A" w:rsidP="00EA128A">
                <w:r>
                  <w:t><xsl:value-of select="cv:education/cv:name"/></w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="3073" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="dashed" w:sz="4" w:space="0" w:color="F6F6F6" w:themeColor="background1"/>
                  <w:bottom w:val="nil"/>
                  <w:right w:val="dashed" w:sz="4" w:space="0" w:color="F6F6F6" w:themeColor="background1"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="05D2F45D" w14:textId="404B7A29" w:rsidR="00AA01B7" w:rsidRDefault="00EA128A" w:rsidP="00EA128A">
                <w:r>
                  <w:t><xsl:value-of select="cv:education/cv:institution"/></w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="3352" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:left w:val="dashed" w:sz="4" w:space="0" w:color="F6F6F6" w:themeColor="background1"/>
                  <w:bottom w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="08F53D39" w14:textId="31CC8A18" w:rsidR="00AA01B7" w:rsidRDefault="00EA128A" w:rsidP="00AA01B7">
                <w:r>
                  <w:t><xsl:value-of select="cv:education/cv:yearFrom"/> - <xsl:value-of select="cv:education/cv:yearTo"/></w:t>
                </w:r>
                <w:r w:rsidRPr="00F63003">
                  <w:rPr>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                  <w:t xml:space="preserve"> // </w:t>
                </w:r>
                <w:r>
                  <w:t><xsl:value-of select="cv:education/cv:result"/></w:t>
                </w:r>
              </w:p>
            </w:tc>
          </w:tr>

        </w:tbl>
        <w:p w14:paraId="5FE16C0D" w14:textId="77777777" w:rsidR="00AA01B7" w:rsidRDefault="00AA01B7">
          <w:pPr>
            <w:rPr>
              <w:caps/>
            </w:rPr>
          </w:pPr>
        </w:p>

        <!--
        INTERESTS
        -->
        <w:tbl>
          <w:tblPr>
            <w:tblStyle w:val="Tabelraster"/>
            <w:tblpPr w:leftFromText="141" w:rightFromText="141" w:vertAnchor="text" w:horzAnchor="margin" w:tblpY="54"/>
            <w:tblW w:w="9498" w:type="dxa"/>
            <w:tblBorders>
              <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
            </w:tblBorders>
            <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
          </w:tblPr>
          <w:tblGrid>
            <w:gridCol w:w="9498"/>
          </w:tblGrid>
          <w:tr w:rsidR="00AA01B7" w14:paraId="345577A6" w14:textId="77777777" w:rsidTr="00F63003">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="9498" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F39900"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="465E8D09" w14:textId="77777777" w:rsidR="00AA01B7" w:rsidRPr="009D3B92" w:rsidRDefault="00AA01B7" w:rsidP="00AA01B7">
                <w:pPr>
                  <w:pStyle w:val="Stijl1"/>
                  <w:rPr>
                    <w:b/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="009D3B92">
                  <w:rPr>
                    <w:b/>
                  </w:rPr>
                  <w:t>Interesses</w:t>
                </w:r>
              </w:p>
            </w:tc>
          </w:tr>
          <w:tr w:rsidR="00AA01B7" w14:paraId="7F4A775F" w14:textId="77777777" w:rsidTr="00F63003">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="9498" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="single" w:sz="4" w:space="0" w:color="F39900"/>
                  <w:right w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="08F6CE06" w14:textId="38885E26" w:rsidR="00AA01B7" w:rsidRDefault="00EA128A" w:rsidP="00EA128A">
                <w:r>
                  <w:t><xsl:value-of select="cv:cv/cv:interests"/></w:t>
                </w:r>
              </w:p>
            </w:tc>
          </w:tr>
        </w:tbl>
        <w:p w14:paraId="422E7833" w14:textId="69E7570C" w:rsidR="00233ED9" w:rsidRDefault="00233ED9"/>

        <!--
        PUBLICATION
        -->

        <!--
        REFERENCE
        -->
        <w:tbl>
          <w:tblPr>
            <w:tblStyle w:val="Tabelraster"/>
            <w:tblpPr w:leftFromText="141" w:rightFromText="141" w:vertAnchor="text" w:horzAnchor="margin" w:tblpY="77"/>
            <w:tblW w:w="9498" w:type="dxa"/>
            <w:tblBorders>
              <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
            </w:tblBorders>
            <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
          </w:tblPr>
          <w:tblGrid>
            <w:gridCol w:w="9498"/>
          </w:tblGrid>
          <w:tr w:rsidR="007D1F36" w14:paraId="5CB0D252" w14:textId="77777777" w:rsidTr="00D8540B">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="9498" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F39900"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="4EA9A1CB" w14:textId="035657EC" w:rsidR="007D1F36" w:rsidRPr="009D3B92" w:rsidRDefault="007D1F36" w:rsidP="00D8540B">
                <w:pPr>
                  <w:pStyle w:val="Stijl1"/>
                  <w:rPr>
                    <w:b/>
                  </w:rPr>
                </w:pPr>
                <w:r>
                  <w:rPr>
                    <w:b/>
                  </w:rPr>
                  <w:t>REFERENTIES</w:t>
                </w:r>
              </w:p>
            </w:tc>
          </w:tr>

          <w:tr w:rsidR="007D1F36" w:rsidRPr="00297BAF" w14:paraId="089E30A7" w14:textId="77777777" w:rsidTr="00D423D4">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="9498" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="single" w:sz="4" w:space="0" w:color="F39900"/>
                  <w:bottom w:val="nil"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="5BE2031C" w14:textId="18CC5370" w:rsidR="007D1F36" w:rsidRPr="00F63003" w:rsidRDefault="00EA128A" w:rsidP="00EA128A">
                <w:pPr>
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
                <w:r>
                  <w:rPr>
                    <w:b/>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                  <w:t>REFERENCE_referentName REFERENCE_referentFunction</w:t>
                </w:r>
              </w:p>
            </w:tc>
          </w:tr>
          <w:tr w:rsidR="008D538D" w14:paraId="5625DC0E" w14:textId="77777777" w:rsidTr="00917136">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="9498" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:bottom w:val="dashed" w:sz="4" w:space="0" w:color="F6F6F6" w:themeColor="background1"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="3A61D49A" w14:textId="541D9D1B" w:rsidR="008D538D" w:rsidRDefault="00EA128A" w:rsidP="00EA128A">
                <w:r>
                  <w:t>REFERENCE_description</w:t>
                </w:r>
              </w:p>
            </w:tc>
          </w:tr>

        </w:tbl>
        <w:p w14:paraId="422E787B" w14:textId="55333B6C" w:rsidR="00CA50C8" w:rsidRDefault="00CA50C8">
          <w:r>
            <w:br w:type="page"/>
          </w:r>
        </w:p>

        <!--
        EXPERIENCE
        -->
        <w:tbl>
          <w:tblPr>
            <w:tblStyle w:val="Tabelraster"/>
            <w:tblW w:w="9498" w:type="dxa"/>
            <w:tblBorders>
              <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>
              <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
            </w:tblBorders>
            <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
          </w:tblPr>
          <w:tblGrid>
            <w:gridCol w:w="2684"/>
            <w:gridCol w:w="6814"/>
          </w:tblGrid>
          <w:tr w:rsidR="00D23D04" w14:paraId="422E787D" w14:textId="77777777" w:rsidTr="7A67F1BE">
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="9498" w:type="dxa"/>
                <w:gridSpan w:val="2"/>
                <w:tcBorders>
                  <w:top w:val="nil"/>
                  <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F39900" w:themeColor="text2"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E787C" w14:textId="77777777" w:rsidR="00D23D04" w:rsidRPr="009D3B92" w:rsidRDefault="00D23D04" w:rsidP="006E0130">
                <w:pPr>
                  <w:pStyle w:val="Stijl1"/>
                  <w:rPr>
                    <w:b/>
                  </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="009D3B92">
                  <w:rPr>
                    <w:b/>
                  </w:rPr>
                  <w:lastRenderedPageBreak/>
                  <w:t>Werkervaring</w:t>
                </w:r>
              </w:p>
            </w:tc>
          </w:tr>

          <w:tr w:rsidR="00C36158" w14:paraId="422E7883" w14:textId="77777777" w:rsidTr="7A67F1BE">
            <w:trPr>
              <w:trHeight w:val="1890"/>
            </w:trPr>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="2261" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="single" w:sz="4" w:space="0" w:color="F39900" w:themeColor="text2"/>
                  <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F39900" w:themeColor="text2"/>
                  <w:right w:val="dashed" w:sz="4" w:space="0" w:color="F39900" w:themeColor="text2"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E787E" w14:textId="0E6D4381" w:rsidR="00C36158" w:rsidRPr="00F63003" w:rsidRDefault="009A2060" w:rsidP="006E0130">
                <w:pPr>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                </w:pPr>
                <w:r>
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t>EXPERIENCE_periodBegin</w:t>
                </w:r>
                <w:r w:rsidR="005C301C">
                  <w:rPr>
                    <w:color w:val="0A1C5C"/>
                  </w:rPr>
                  <w:t xml:space="preserve"> - EXPERIENCE_periodEnd</w:t>
                </w:r>
              </w:p>
              <w:p w14:paraId="422E787F" w14:textId="7D7D1FC3" w:rsidR="00C36158" w:rsidRPr="00F63003" w:rsidRDefault="005C301C" w:rsidP="006E0130">
                <w:pPr>
                  <w:rPr>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                </w:pPr>
                <w:r>
                  <w:rPr>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                  <w:t>EXPERIENCE_role</w:t>
                </w:r>
              </w:p>
              <w:p w14:paraId="422E7880" w14:textId="1AFDDA5B" w:rsidR="00C36158" w:rsidRDefault="005C301C" w:rsidP="005C301C">
                <w:r>
                  <w:rPr>
                    <w:color w:val="F39900"/>
                  </w:rPr>
                  <w:t>EXPERIENCE_client</w:t>
                </w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="7237" w:type="dxa"/>
                <w:tcBorders>
                  <w:top w:val="single" w:sz="4" w:space="0" w:color="F39900" w:themeColor="text2"/>
                  <w:left w:val="dashed" w:sz="4" w:space="0" w:color="F39900" w:themeColor="text2"/>
                  <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F39900" w:themeColor="text2"/>
                </w:tcBorders>
              </w:tcPr>
              <w:p w14:paraId="422E7881" w14:textId="168A1571" w:rsidR="00C36158" w:rsidRDefault="005C301C" w:rsidP="006E0130">
                <w:r>
                  <w:t>EXPERIENCE_assignment</w:t>
                </w:r>
              </w:p>
              <w:p w14:paraId="4C9ADDF3" w14:textId="77777777" w:rsidR="00C36158" w:rsidRDefault="00C36158" w:rsidP="006E0130"/>
              <w:p w14:paraId="6C7C0125" w14:textId="0486E462" w:rsidR="00C36158" w:rsidRDefault="005C301C" w:rsidP="006E0130">
                <w:r>
                  <w:t>EXPERIENCE_activities:</w:t>
                </w:r>
              </w:p>
              <w:p w14:paraId="6C44E8CB" w14:textId="77777777" w:rsidR="00C36158" w:rsidRDefault="00C36158" w:rsidP="006E0130">
                <w:pPr>
                  <w:pStyle w:val="Lijstalinea"/>
                  <w:numPr>
                    <w:ilvl w:val="0"/>
                    <w:numId w:val="9"/>
                  </w:numPr>
                </w:pPr>
                <w:r>
                  <w:t>…</w:t>
                </w:r>
              </w:p>
              <w:p w14:paraId="2AA3936E" w14:textId="20EF2808" w:rsidR="00C36158" w:rsidRPr="00C97881" w:rsidRDefault="005C301C" w:rsidP="00C97881">
                <w:r>
                  <w:t>EXPERIENCE_results:</w:t>
                </w:r>
              </w:p>
              <w:p w14:paraId="605BBB26" w14:textId="77777777" w:rsidR="00C36158" w:rsidRDefault="00C36158" w:rsidP="00C97881">
                <w:pPr>
                  <w:pStyle w:val="Lijstalinea"/>
                  <w:numPr>
                    <w:ilvl w:val="0"/>
                    <w:numId w:val="9"/>
                  </w:numPr>
                </w:pPr>
                <w:r>
                  <w:t>…</w:t>
                </w:r>
              </w:p>
              <w:p w14:paraId="3A2798FE" w14:textId="4CEC370A" w:rsidR="00C36158" w:rsidRDefault="005C301C" w:rsidP="00C97881">
                <w:r>
                  <w:t>EXPERIENCE_keywords</w:t>
                </w:r>
                <w:r w:rsidR="00C36158">
                  <w:t>:</w:t>
                </w:r>
              </w:p>
              <w:p w14:paraId="422E7882" w14:textId="1C25093D" w:rsidR="00C36158" w:rsidRDefault="00C36158" w:rsidP="00C97881">
                <w:pPr>
                  <w:pStyle w:val="Lijstalinea"/>
                  <w:numPr>
                    <w:ilvl w:val="0"/>
                    <w:numId w:val="9"/>
                  </w:numPr>
                </w:pPr>
                <w:r>
                  <w:t>…</w:t>
                </w:r>
              </w:p>
            </w:tc>
          </w:tr>
        </w:tbl>
        <w:p w14:paraId="422E78E8" w14:textId="77777777" w:rsidR="009C0A9D" w:rsidRPr="0080064E" w:rsidRDefault="009C0A9D" w:rsidP="00F05A03"/>
        <w:sectPr w:rsidR="009C0A9D" w:rsidRPr="0080064E" w:rsidSect="006D3439">
          <w:headerReference w:type="default" r:id="rId7"/>
          <w:footerReference w:type="default" r:id="rId8"/>
          <w:headerReference w:type="first" r:id="rId9"/>
          <w:footerReference w:type="first" r:id="rId10"/>
          <w:pgSz w:w="11906" w:h="16838" w:code="9"/>
          <w:pgMar w:top="1843" w:right="1985" w:bottom="1701" w:left="1701" w:header="714" w:footer="641" w:gutter="0"/>
          <w:cols w:space="708"/>
          <w:titlePg/>
          <w:docGrid w:linePitch="360"/>
        </w:sectPr>
      </w:body>
    </w:document>
  </xsl:template>
  
  <xsl:template match="cv:education">
    <w:tr w:rsidR="00AA01B7" w14:paraId="50D34FBD" w14:textId="77777777" w:rsidTr="7A67F1BE">
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="3073" w:type="dxa"/>
          <w:tcBorders>
            <w:top w:val="nil"/>
            <w:bottom w:val="nil"/>
            <w:right w:val="dashed" w:sz="4" w:space="0" w:color="F6F6F6" w:themeColor="background1"/>
          </w:tcBorders>
        </w:tcPr>
        <w:p w14:paraId="267E3393" w14:textId="54675297" w:rsidR="00AA01B7" w:rsidRDefault="00EA128A" w:rsidP="00EA128A">
          <w:r>
            <w:t><xsl:value-of select="cv:name"/></w:t>
          </w:r>
        </w:p>
      </w:tc>
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="3073" w:type="dxa"/>
          <w:tcBorders>
            <w:top w:val="nil"/>
            <w:left w:val="dashed" w:sz="4" w:space="0" w:color="F6F6F6" w:themeColor="background1"/>
            <w:bottom w:val="nil"/>
            <w:right w:val="dashed" w:sz="4" w:space="0" w:color="F6F6F6" w:themeColor="background1"/>
          </w:tcBorders>
        </w:tcPr>
        <w:p w14:paraId="528D45D9" w14:textId="0DFCE66D" w:rsidR="00AA01B7" w:rsidRDefault="00EA128A" w:rsidP="00EA128A">
          <w:r>
            <w:t><xsl:value-of select="cv:institution"/></w:t>
          </w:r>
        </w:p>
      </w:tc>
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="3352" w:type="dxa"/>
          <w:tcBorders>
            <w:top w:val="nil"/>
            <w:left w:val="dashed" w:sz="4" w:space="0" w:color="F6F6F6" w:themeColor="background1"/>
            <w:bottom w:val="nil"/>
          </w:tcBorders>
        </w:tcPr>
        <w:p w14:paraId="10BD7F8F" w14:textId="0F1AB388" w:rsidR="00AA01B7" w:rsidRDefault="00EA128A" w:rsidP="00EA128A">
          <w:r>
            <w:t><xsl:value-of select="cv:yearFrom"/> - <xsl:value-of select="cv:yearTo"/></w:t>
          </w:r>
          <w:r w:rsidR="00AA01B7" w:rsidRPr="00F63003">
            <w:rPr>
              <w:color w:val="F39900"/>
            </w:rPr>
            <w:t xml:space="preserve"> // </w:t>
          </w:r>
          <w:r>
            <w:t><xsl:value-of select="cv:result"/></w:t>
          </w:r>
        </w:p>
      </w:tc>
    </w:tr>
  </xsl:template>

  <xsl:template match="cv:experience" mode="overview">
    <w:tr w:rsidR="00AA01B7" w14:paraId="161EF383" w14:textId="77777777" w:rsidTr="00C44A77">
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="3073" w:type="dxa"/>
          <w:tcBorders>
            <w:top w:val="nil"/>
            <w:bottom w:val="nil"/>
            <w:right w:val="dashed" w:sz="4" w:space="0" w:color="F6F6F6"/>
          </w:tcBorders>
        </w:tcPr>
        <w:p w14:paraId="0A5C9C56" w14:textId="739C5181" w:rsidR="00AA01B7" w:rsidRDefault="00EA128A" w:rsidP="00AE0F8D">
          <w:r>
            <w:t>EXPERIENCE_periodBegin - EXPERIENCE_periodEnd</w:t>
          </w:r>
        </w:p>
      </w:tc>
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="3073" w:type="dxa"/>
          <w:tcBorders>
            <w:top w:val="nil"/>
            <w:left w:val="dashed" w:sz="4" w:space="0" w:color="F6F6F6"/>
            <w:bottom w:val="nil"/>
            <w:right w:val="dashed" w:sz="4" w:space="0" w:color="F6F6F6"/>
          </w:tcBorders>
        </w:tcPr>
        <w:p w14:paraId="1DE6530E" w14:textId="0838A226" w:rsidR="00AA01B7" w:rsidRDefault="00EA128A" w:rsidP="00EA128A">
          <w:r>
            <w:t>EXPERIENCE_role</w:t>
          </w:r>
        </w:p>
      </w:tc>
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="3352" w:type="dxa"/>
          <w:tcBorders>
            <w:top w:val="nil"/>
            <w:left w:val="dashed" w:sz="4" w:space="0" w:color="F6F6F6"/>
            <w:bottom w:val="nil"/>
          </w:tcBorders>
        </w:tcPr>
        <w:p w14:paraId="280D0253" w14:textId="4EEFBC4C" w:rsidR="00AA01B7" w:rsidRDefault="00EA128A" w:rsidP="00EA128A">
          <w:r>
            <w:t>EXPERIENCE_client</w:t>
          </w:r>
        </w:p>
      </w:tc>
    </w:tr>
  </xsl:template>

</xsl:stylesheet>