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
        <w:hdr xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex"
               xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex"
               xmlns:cx2="http://schemas.microsoft.com/office/drawing/2015/10/21/chartex"
               xmlns:cx3="http://schemas.microsoft.com/office/drawing/2016/5/9/chartex"
               xmlns:cx4="http://schemas.microsoft.com/office/drawing/2016/5/10/chartex"
               xmlns:cx5="http://schemas.microsoft.com/office/drawing/2016/5/11/chartex"
               xmlns:cx6="http://schemas.microsoft.com/office/drawing/2016/5/12/chartex"
               xmlns:cx7="http://schemas.microsoft.com/office/drawing/2016/5/13/chartex"
               xmlns:cx8="http://schemas.microsoft.com/office/drawing/2016/5/14/chartex"
               xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
               xmlns:aink="http://schemas.microsoft.com/office/drawing/2016/ink"
               xmlns:am3d="http://schemas.microsoft.com/office/drawing/2017/model3d"
               xmlns:o="urn:schemas-microsoft-com:office:office"
               xmlns:oel="http://schemas.microsoft.com/office/2019/extlst"
               xmlns:r="http://purl.oclc.org/ooxml/officeDocument/relationships"
               xmlns:m="http://purl.oclc.org/ooxml/officeDocument/math"
               xmlns:v="urn:schemas-microsoft-com:vml"
               xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
               xmlns:wp="http://purl.oclc.org/ooxml/drawingml/wordprocessingDrawing"
               xmlns:w10="urn:schemas-microsoft-com:office:word"
               xmlns:w="http://purl.oclc.org/ooxml/wordprocessingml/main"
               xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
               xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml"
               xmlns:w16cex="http://schemas.microsoft.com/office/word/2018/wordml/cex"
               xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid"
               xmlns:w16="http://schemas.microsoft.com/office/word/2018/wordml"
               xmlns:w16du="http://schemas.microsoft.com/office/word/2023/wordml/word16du"
               xmlns:w16sdtdh="http://schemas.microsoft.com/office/word/2020/wordml/sdtdatahash"
               xmlns:w16sdtfl="http://schemas.microsoft.com/office/word/2024/wordml/sdtformatlock"
               xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex"
               xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk"
               xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml"
               mc:Ignorable="w14 w15 w16se w16cid w16 w16cex w16sdtdh w16sdtfl w16du wne wp14">
            <w:p w14:paraId="257F922B" w14:textId="7A268496" w:rsidR="00D51FD7" w:rsidRDefault="00D51FD7" w:rsidP="00D51FD7">
                <w:pPr>
                    <w:pStyle w:val="Koptekst"/>
                    <w:jc w:val="end"/>
                </w:pPr>
                <w:r>
                    <w:rPr>
                        <w:noProof/>
                    </w:rPr>
                    <w:drawing>
                        <wp:inline distT="0" distB="0" distL="0" distR="0" wp14:anchorId="32B95DFD" wp14:editId="119DA304">
                            <wp:extent cx="1371600" cy="431800"/>
                            <wp:effectExtent l="0" t="0" r="0" b="0"/>
                            <wp:docPr id="1713759036" name="Graphic 15"/>
                            <wp:cNvGraphicFramePr>
                                <a:graphicFrameLocks xmlns:a="http://purl.oclc.org/ooxml/drawingml/main" noChangeAspect="1"/>
                            </wp:cNvGraphicFramePr>
                            <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                <a:graphicData uri="http://purl.oclc.org/ooxml/drawingml/picture">
                                    <pic:pic xmlns:pic="http://purl.oclc.org/ooxml/drawingml/picture">
                                        <pic:nvPicPr>
                                            <pic:cNvPr id="1895402170" name="Graphic 1895402170"/>
                                            <pic:cNvPicPr/>
                                        </pic:nvPicPr>
                                        <pic:blipFill>
                                            <a:blip r:embed="rId1">
                                                <a:extLst>
                                                    <a:ext><xsl:attribute name="uri"><xsl:value-of select="'{96DAC541-7B7A-43D3-8B79-37D633B846F1}'"/></xsl:attribute>
                                                        <asvg:svgBlip
                                                                xmlns:asvg="http://schemas.microsoft.com/office/drawing/2016/SVG/main"
                                                                r:embed="rId2"/>
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