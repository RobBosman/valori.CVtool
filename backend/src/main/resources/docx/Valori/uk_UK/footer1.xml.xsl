<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:cv="https://ns.bransom.nl/cerios/cv/v20110401"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
    exclude-result-prefixes="cv"
    version="1.0">

  <xsl:import href="common-per-locale.xsl" />

  <xsl:output method="xml" standalone="yes" encoding="UTF-8" indent="no" />

  <xsl:template match="/">
    <w:ftr mc:Ignorable="w14 w15 wp14">
      <w:p w:rsidR="00011166" w:rsidRPr="00011166" w:rsidRDefault="00011166" w:rsidP="003D53DB">
        <w:pPr>
          <w:tabs>
            <w:tab w:val="right" w:pos="9356"/>
          </w:tabs>
          <w:ind w:hanging="1276"/>
          <w:rPr>
            <w:caps/>
            <w:sz w:val="16"/>
            <w:szCs w:val="16"/>
          </w:rPr>
        </w:pPr>
        <w:r w:rsidRPr="00011166">
          <w:rPr>
            <w:rFonts w:ascii="Arial Narrow" w:hAnsi="Arial Narrow" w:cs="Microsoft Sans Serif"/>
            <w:b/>
            <w:caps/>
            <w:color w:val="F39900"/>
            <w:spacing w:val="40"/>
            <w:sz w:val="14"/>
            <w:szCs w:val="14"/>
          </w:rPr>
          <w:t>Building IT Quality</w:t>
        </w:r>
        <w:r>
          <w:rPr>
            <w:caps/>
            <w:sz w:val="16"/>
            <w:szCs w:val="16"/>
          </w:rPr>
          <w:tab/>
        </w:r>
        <w:r w:rsidR="00011166" w:rsidRPr="00DE7F23">
          <w:rPr>
            <w:caps/>
            <w:sz w:val="16"/>
            <w:szCs w:val="16"/>
          </w:rPr>
          <w:t>
            <xsl:text>Curriculum vitae of </xsl:text>
            <xsl:apply-templates select="//cv:persoonsgegevens" mode="full-name" />
          </w:t>
        </w:r>
        <w:r w:rsidR="00011166" w:rsidRPr="00DE7F23">
          <w:rPr>
            <w:rStyle w:val="Valori-geel"/>
            <w:sz w:val="16"/>
            <w:szCs w:val="16"/>
          </w:rPr>
          <w:t xml:space="preserve"> // </w:t>
        </w:r>
        <w:r w:rsidR="00011166" w:rsidRPr="00DE7F23">
          <w:rPr>
            <w:caps/>
            <w:sz w:val="16"/>
            <w:szCs w:val="16"/>
          </w:rPr>
          <w:t>Valori</w:t>
        </w:r>
        <w:r w:rsidR="00011166" w:rsidRPr="00DE7F23">
          <w:rPr>
            <w:rStyle w:val="Valori-geel"/>
            <w:sz w:val="16"/>
            <w:szCs w:val="16"/>
          </w:rPr>
          <w:t xml:space="preserve"> // </w:t>
        </w:r>
        <w:r w:rsidR="00011166" w:rsidRPr="00DE7F23">
          <w:rPr>
            <w:b/>
            <w:caps/>
            <w:sz w:val="16"/>
            <w:szCs w:val="16"/>
          </w:rPr>
          <w:fldChar w:fldCharType="begin"/>
        </w:r>
        <w:r w:rsidR="00011166" w:rsidRPr="00DE7F23">
          <w:rPr>
            <w:b/>
            <w:caps/>
            <w:sz w:val="16"/>
            <w:szCs w:val="16"/>
          </w:rPr>
          <w:instrText>PAGE   \* MERGEFORMAT</w:instrText>
        </w:r>
        <w:r w:rsidR="00011166" w:rsidRPr="00DE7F23">
          <w:rPr>
            <w:b/>
            <w:caps/>
            <w:sz w:val="16"/>
            <w:szCs w:val="16"/>
          </w:rPr>
          <w:fldChar w:fldCharType="separate"/>
        </w:r>
        <w:r w:rsidR="00DA4D6E">
          <w:rPr>
            <w:b/>
            <w:caps/>
            <w:noProof/>
            <w:sz w:val="16"/>
            <w:szCs w:val="16"/>
          </w:rPr>
          <w:t>1</w:t>
        </w:r>
        <w:r w:rsidR="00011166" w:rsidRPr="00DE7F23">
          <w:rPr>
            <w:b/>
            <w:caps/>
            <w:sz w:val="16"/>
            <w:szCs w:val="16"/>
          </w:rPr>
          <w:fldChar w:fldCharType="end"/>
        </w:r>
        <w:r w:rsidR="00011166" w:rsidRPr="00DE7F23">
          <w:rPr>
            <w:caps/>
            <w:sz w:val="16"/>
            <w:szCs w:val="16"/>
          </w:rPr>
          <w:t xml:space="preserve"> of </w:t>
        </w:r>
        <w:r w:rsidR="00011166" w:rsidRPr="00DE7F23">
          <w:rPr>
            <w:b/>
            <w:caps/>
            <w:sz w:val="16"/>
            <w:szCs w:val="16"/>
          </w:rPr>
          <w:fldChar w:fldCharType="begin"/>
        </w:r>
        <w:r w:rsidR="00011166" w:rsidRPr="00DE7F23">
          <w:rPr>
            <w:b/>
            <w:caps/>
            <w:sz w:val="16"/>
            <w:szCs w:val="16"/>
          </w:rPr>
          <w:instrText xml:space="preserve"> NUMPAGES   \* MERGEFORMAT </w:instrText>
        </w:r>
        <w:r w:rsidR="00011166" w:rsidRPr="00DE7F23">
          <w:rPr>
            <w:b/>
            <w:caps/>
            <w:sz w:val="16"/>
            <w:szCs w:val="16"/>
          </w:rPr>
          <w:fldChar w:fldCharType="separate"/>
        </w:r>
        <w:r w:rsidR="00DA4D6E">
          <w:rPr>
            <w:b/>
            <w:caps/>
            <w:noProof/>
            <w:sz w:val="16"/>
            <w:szCs w:val="16"/>
          </w:rPr>
          <w:t>2</w:t>
        </w:r>
        <w:r w:rsidR="00011166" w:rsidRPr="00DE7F23">
          <w:rPr>
            <w:b/>
            <w:caps/>
            <w:sz w:val="16"/>
            <w:szCs w:val="16"/>
          </w:rPr>
          <w:fldChar w:fldCharType="end"/>
        </w:r>
      </w:p>
    </w:ftr>
  </xsl:template>

</xsl:stylesheet>