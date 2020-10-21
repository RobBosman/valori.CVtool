<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:cv="https://ns.bransom.nl/cerios/cv/v20110401"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
    xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
    xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
    xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
    exclude-result-prefixes="cv"
    version="1.0">

  <xsl:import href="common-per-locale.xsl" />

  <xsl:param name="layout"/>

  <xsl:output method="xml" standalone="yes" encoding="UTF-8" indent="no" />

  <xsl:template match="/">
    <w:hdr mc:Ignorable="w14 w15 wp14">
      <w:p w:rsidR="00011166" w:rsidRDefault="00011166" w:rsidP="00D450FA">
        <w:pPr>
          <w:ind w:left="142" w:hanging="142"/>
          <w:jc w:val="right"/>
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:noProof/>
            <w:lang w:eastAsia="nl-NL"/>
          </w:rPr>
          <w:drawing>
            <wp:inline distT="0" distB="0" distL="0" distR="0" wp14:anchorId="488A3A1E" wp14:editId="79E465F0">
              <wp:extent cx="720000" cy="720000"/>
              <wp:effectExtent l="0" t="0" r="4445" b="4445"/>
              <wp:docPr id="1" name="Afbeelding 1"/>
              <wp:cNvGraphicFramePr>
                <a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/>
              </wp:cNvGraphicFramePr>
              <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
                <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                  <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
                    <pic:nvPicPr>
                      <pic:cNvPr id="1" name="Valori - digitaal gebruik.jpg"/>
                      <pic:cNvPicPr/>
                    </pic:nvPicPr>
                    <pic:blipFill>
                      <a:blip r:embed="rId1" cstate="print">
                        <a:extLst>
                          <a:ext>
                            <xsl:attribute name="uri">{28A0092B-C50C-407E-A947-70E740481C1C}</xsl:attribute>
                            <a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/>
                          </a:ext>
                        </a:extLst>
                      </a:blip>
                      <a:stretch>
                        <a:fillRect/>
                      </a:stretch>
                    </pic:blipFill>
                    <pic:spPr>
                      <a:xfrm>
                        <a:off x="0" y="0"/>
                        <a:ext cx="720000" cy="720000"/>
                      </a:xfrm>
                      <a:prstGeom prst="rect">
                        <a:avLst/>
                      </a:prstGeom>
                    </pic:spPr>
                  </pic:pic>
                </a:graphicData>
              </a:graphic>
            </wp:inline>
          </w:drawing>
        </w:r>
      </w:p>
    </w:hdr>
  </xsl:template>

</xsl:stylesheet>