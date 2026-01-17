<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:cv="https://ns.bransom.nl/cerios/cv/v20250808.xsd"
        exclude-result-prefixes="cv"
        version="1.0">

    <xsl:import href="../../../mappings.xsl"/>

    <xsl:output method="xml" standalone="yes" encoding="UTF-8" indent="no"/>

    <xsl:template match="/cv:root">
        <w:hdr xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
               xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
               xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
               xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
               xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
               xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
               xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
               xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main"
               xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"
               mc:Ignorable="w14 wp14">
            <w:p w14:paraId="422E78F8" w14:textId="3E9FE7A8" w:rsidR="006E0130" w:rsidRPr="00585C2D"
                 w:rsidRDefault="00585C2D" w:rsidP="007C6954">
                <w:pPr>
                    <w:pStyle w:val="Titel"/>
                    <w:jc w:val="right"/>
                </w:pPr>
                <xsl:if test="cv:account/cv:photo and (cv:characteristics[cv:includeInCv = 'true']/cv:includePhotoInCv = 'true')">
                    <w:r>
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251663872"
                                       behindDoc="1" locked="0" layoutInCell="1" allowOverlap="1"
                                       wp14:anchorId="58102F43"
                                       wp14:editId="5EBD1D5B">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="margin">
                                    <wp:posOffset>4421505</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>-440690</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="1430655" cy="1430655"/>
                                <wp:effectExtent l="0" t="0" r="0" b="0"/>
                                <wp:wrapSquare wrapText="bothSides"/>
                                <wp:docPr id="1076116984" name="pasfoto" descr="pasfoto"/>
                                <wp:cNvGraphicFramePr>
                                    <a:graphicFrameLocks noChangeAspect="1"/>
                                </wp:cNvGraphicFramePr>
                                <a:graphic>
                                    <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                                        <pic:pic>
                                            <pic:nvPicPr>
                                                <pic:cNvPr id="1076116984" name="pasfoto" descr="pasfoto"/>
                                                <pic:cNvPicPr/>
                                            </pic:nvPicPr>
                                            <pic:blipFill>
                                                <a:blip r:embed="rId3">
                                                    <a:extLst>
                                                        <a:ext>
                                                            <xsl:attribute name="uri">
                                                                <xsl:value-of
                                                                        select="'{28A0092B-C50C-407E-A947-70E740481C1C}'"/>
                                                            </xsl:attribute>
                                                            <a14:useLocalDpi val="0"/>
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
                                                    <a:ext cx="1430655" cy="1430655"/>
                                                </a:xfrm>
                                                <a:prstGeom prst="rect">
                                                    <a:avLst/>
                                                </a:prstGeom>
                                            </pic:spPr>
                                        </pic:pic>
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
                </xsl:if>
                <w:r w:rsidR="00A2340C" w:rsidRPr="00FD53E1">
                    <w:rPr>
                        <w:noProof/>
                    </w:rPr>
                    <w:drawing>
                        <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                   relativeHeight="251662848"
                                   behindDoc="1" locked="0" layoutInCell="1" allowOverlap="1" wp14:anchorId="3BED597A"
                                   wp14:editId="69F6AAF1">
                            <wp:simplePos x="0" y="0"/>
                            <wp:positionH relativeFrom="margin">
                                <wp:posOffset>165735</wp:posOffset>
                            </wp:positionH>
                            <wp:positionV relativeFrom="paragraph">
                                <wp:posOffset>-154305</wp:posOffset>
                            </wp:positionV>
                            <wp:extent cx="1224915" cy="166256"/>
                            <wp:effectExtent l="0" t="0" r="0" b="5715"/>
                            <wp:wrapNone/>
                            <wp:docPr id="2" name="Afbeelding 2"/>
                            <wp:cNvGraphicFramePr>
                                <a:graphicFrameLocks noChangeAspect="1"/>
                            </wp:cNvGraphicFramePr>
                            <a:graphic>
                                <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                                    <pic:pic>
                                        <pic:nvPicPr>
                                            <pic:cNvPr id="1" name="pay-off.gif"/>
                                            <pic:cNvPicPr/>
                                        </pic:nvPicPr>
                                        <pic:blipFill>
                                            <a:blip r:embed="rId2">
                                                <a:extLst>
                                                    <a:ext>
                                                        <xsl:attribute name="uri">
                                                            <xsl:value-of
                                                                    select="'{28A0092B-C50C-407E-A947-70E740481C1C}'"/>
                                                        </xsl:attribute>
                                                        <a14:useLocalDpi val="0"/>
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
                                                <a:ext cx="1224915" cy="166256"/>
                                            </a:xfrm>
                                            <a:prstGeom prst="rect">
                                                <a:avLst/>
                                            </a:prstGeom>
                                        </pic:spPr>
                                    </pic:pic>
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
                <w:r w:rsidR="004229AA" w:rsidRPr="00FD53E1">
                    <w:rPr>
                        <w:noProof/>
                    </w:rPr>
                    <w:drawing>
                        <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                   relativeHeight="251659776"
                                   behindDoc="1" locked="0" layoutInCell="1" allowOverlap="1" wp14:anchorId="09903F99"
                                   wp14:editId="563A367D">
                            <wp:simplePos x="0" y="0"/>
                            <wp:positionH relativeFrom="page">
                                <wp:posOffset>360045</wp:posOffset>
                            </wp:positionH>
                            <wp:positionV relativeFrom="page">
                                <wp:posOffset>360045</wp:posOffset>
                            </wp:positionV>
                            <wp:extent cx="720000" cy="720000"/>
                            <wp:effectExtent l="0" t="0" r="4445" b="4445"/>
                            <wp:wrapNone/>
                            <wp:docPr id="3" name="Afbeelding 3"/>
                            <wp:cNvGraphicFramePr>
                                <a:graphicFrameLocks noChangeAspect="1"/>
                            </wp:cNvGraphicFramePr>
                            <a:graphic>
                                <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                                    <pic:pic>
                                        <pic:nvPicPr>
                                            <pic:cNvPr id="1" name="Cerios - digitaal gebruik.jpg"/>
                                            <pic:cNvPicPr/>
                                        </pic:nvPicPr>
                                        <pic:blipFill>
                                            <a:blip r:embed="rId1" cstate="print">
                                                <a:extLst>
                                                    <a:ext>
                                                        <xsl:attribute name="uri">
                                                            <xsl:value-of
                                                                    select="'{28A0092B-C50C-407E-A947-70E740481C1C}'"/>
                                                        </xsl:attribute>
                                                        <a14:useLocalDpi val="0"/>
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
                            <wp14:sizeRelH relativeFrom="margin">
                                <wp14:pctWidth>0</wp14:pctWidth>
                            </wp14:sizeRelH>
                            <wp14:sizeRelV relativeFrom="margin">
                                <wp14:pctHeight>0</wp14:pctHeight>
                            </wp14:sizeRelV>
                        </wp:anchor>
                    </w:drawing>
                </w:r>
                <w:r w:rsidR="00D94787" w:rsidRPr="00585C2D">
                    <w:t>
                        <xsl:value-of select="cv:account/cv:name"/>
                    </w:t>
                </w:r>
            </w:p>
            <w:p w14:paraId="3EE983D6" w14:textId="01CA2A7A" w:rsidR="007C6954" w:rsidRPr="00585C2D"
                 w:rsidRDefault="007C6954" w:rsidP="007C6954">
                <w:pPr>
                    <w:pStyle w:val="Subtitel"/>
                    <w:jc w:val="right"/>
                </w:pPr>
                <w:r w:rsidRPr="00585C2D">
                    <w:t>
                        <xsl:value-of select="cv:characteristics[cv:includeInCv = 'true']/cv:role"/>
                    </w:t>
                </w:r>
                <w:r w:rsidRPr="00585C2D">
                    <w:rPr>
                        <w:rStyle w:val="Cerios-geel"/>
                    </w:rPr>
                    <w:t xml:space="preserve">&#xA0;// </w:t>
                </w:r>
                <w:r w:rsidRPr="00585C2D">
                    <w:t>
                        <xsl:apply-templates select="cv:account/cv:dateOfBirth" mode="date-numeric"/>
                    </w:t>
                </w:r>
                <w:r w:rsidRPr="00585C2D">
                    <w:rPr>
                        <w:rStyle w:val="Cerios-geel"/>
                    </w:rPr>
                    <w:t xml:space="preserve">&#xA0;// </w:t>
                </w:r>
                <w:r>
                    <w:t>
                        <xsl:value-of select="cv:account/cv:residence"/>
                    </w:t>
                </w:r>
                <w:r w:rsidRPr="00585C2D">
                    <w:rPr>
                        <w:rStyle w:val="Cerios-geel"/>
                    </w:rPr>
                    <w:t xml:space="preserve">&#xA0;//</w:t>
                </w:r>
            </w:p>
        </w:hdr>
    </xsl:template>

</xsl:stylesheet>