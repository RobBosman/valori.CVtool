<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:cv="https://ns.bransom.nl/valori/cv/v20201022.xsd"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
    xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
    exclude-result-prefixes="cv"
    version="1.0">

  <xsl:import href="../common-per-locale.xsl" />

  <xsl:output method="xml" standalone="yes" encoding="UTF-8" indent="no" />

  <xsl:template match="/">
    <xsl:apply-templates select="cv:root/cv:account"/>
  </xsl:template>

  <xsl:template match="cv:account">
    <w:ftr mc:Ignorable="w14">
      <w:sdt>
        <w:sdtPr>
          <w:rPr>
            <w:szCs w:val="16"/>
          </w:rPr>
          <w:id w:val="-1113437201"/>
          <w:docPartObj>
            <w:docPartGallery w:val="Page Numbers (Bottom of Page)"/>
            <w:docPartUnique/>
          </w:docPartObj>
        </w:sdtPr>
        <w:sdtEndPr/>
        <w:sdtContent>
          <w:p w14:paraId="422E78FA" w14:textId="64E6A217" w:rsidR="00940ACC" w:rsidRPr="00F05A03" w:rsidRDefault="00C97881" w:rsidP="00F05A03">
            <w:pPr>
              <w:pStyle w:val="Voettekst"/>
              <w:jc w:val="center"/>
              <w:rPr>
                <w:szCs w:val="16"/>
              </w:rPr>
            </w:pPr>
            <w:r>
              <w:rPr>
                <w:szCs w:val="16"/>
              </w:rPr>
              <w:t>Curriculum vitae van <xsl:value-of select="cv:name"/></w:t>
            </w:r>
            <w:r w:rsidRPr="00F63003">
              <w:rPr>
                <w:color w:val="F39900"/>
                <w:szCs w:val="16"/>
              </w:rPr>
              <w:t xml:space="preserve"> // </w:t>
            </w:r>
            <w:r>
              <w:rPr>
                <w:szCs w:val="16"/>
              </w:rPr>
              <w:t>VALORI</w:t>
            </w:r>
            <w:r w:rsidRPr="00F63003">
              <w:rPr>
                <w:color w:val="F39900"/>
                <w:szCs w:val="16"/>
              </w:rPr>
              <w:t xml:space="preserve"> //</w:t>
              <w:tab/>
            </w:r>
            <w:sdt>
              <w:sdtPr>
                <w:rPr>
                  <w:szCs w:val="16"/>
                </w:rPr>
                <w:id w:val="1381835335"/>
                <w:docPartObj>
                  <w:docPartGallery w:val="Page Numbers (Top of Page)"/>
                  <w:docPartUnique/>
                </w:docPartObj>
              </w:sdtPr>
              <w:sdtEndPr/>
              <w:sdtContent>
                <w:r w:rsidRPr="0080064E">
                  <w:rPr>
                    <w:b/>
                    <w:bCs/>
                    <w:szCs w:val="16"/>
                  </w:rPr>
                  <w:fldChar w:fldCharType="begin"/>
                  <w:instrText>PAGE</w:instrText>
                  <w:fldChar w:fldCharType="separate"/>
                  <w:t>1</w:t>
                  <w:fldChar w:fldCharType="end"/>
                  <w:t xml:space="preserve"> van </w:t>
                  <w:fldChar w:fldCharType="begin"/>
                  <w:instrText>NUMPAGES</w:instrText>
                  <w:fldChar w:fldCharType="separate"/>
                  <w:t>3</w:t>
                  <w:fldChar w:fldCharType="end"/>
                </w:r>
              </w:sdtContent>
            </w:sdt>
          </w:p>
        </w:sdtContent>
      </w:sdt>
    </w:ftr>
  </xsl:template>

</xsl:stylesheet>