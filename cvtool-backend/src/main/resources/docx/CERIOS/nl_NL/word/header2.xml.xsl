<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:cv="https://ns.bransom.nl/valori/cv/v20201130.xsd"
        exclude-result-prefixes="cv"
        version="1.0">

    <xsl:import href="../common-nl_NL.xsl"/>

    <xsl:output method="xml" standalone="yes" encoding="UTF-8" indent="no"/>

    <xsl:template match="/">
        <xsl:apply-templates select="cv:root"/>
    </xsl:template>

    <xsl:template match="cv:root">
        <w:hdr
                xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
                xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
                xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
               xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
                xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
               xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
                mc:Ignorable="w14 w15 w16se w16cid w16 w16cex w16sdtdh w16sdtfl w16du wp14">
            <w:p w14:paraId="691869DD" w14:textId="77777777" w:rsidR="00B97911" w:rsidRDefault="00000000"
                 w:rsidP="00D51FD7">
                <w:pPr>
                    <w:pStyle w:val="Koptekst"/>
                    <w:jc w:val="right"/>
                </w:pPr>
                <w:r>
                    <w:rPr>
                        <w:noProof/>
                    </w:rPr>
                    <w:drawing>
                        <wp:inline distT="0" distB="0" distL="0" distR="0" wp14:anchorId="31FE7B5D"
                                   wp14:editId="0ACF5EB4">
                            <wp:extent cx="1371600" cy="431800"/>
                            <wp:effectExtent l="0" t="0" r="0" b="0"/>
                            <wp:docPr id="1713759036" name="Graphic 15"/>
                            <wp:cNvGraphicFramePr>
                                <a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
                                                     noChangeAspect="1"/>
                            </wp:cNvGraphicFramePr>
                            <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
                                <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                                    <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
                                        <pic:nvPicPr>
                                            <pic:cNvPr id="1895402170" name="Graphic 1895402170"/>
                                            <pic:cNvPicPr/>
                                        </pic:nvPicPr>
                                        <pic:blipFill>
                                            <a:blip r:embed="rId1">
                                                <a:extLst>
                                                    <a:ext>
                                                        <xsl:attribute name="uri">
                                                            <xsl:text>{96DAC541-7B7A-43D3-8B79-37D633B846F1}</xsl:text>
                                                        </xsl:attribute>
                                                        <asvg:svgBlip r:embed="rId2"
                                                                      xmlns:asvg="http://schemas.microsoft.com/office/drawing/2016/SVG/main"
                                                                      xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
                                                                      xmlns=""/>
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
                                                <a:ext cx="1371600" cy="431800"/>
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