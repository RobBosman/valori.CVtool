<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:cv="https://ns.bransom.nl/valori/cv/v20250808.xsd"
        exclude-result-prefixes="cv"
        version="1.0">

    <xsl:import href="../../../translations.xsl"/>

    <xsl:output method="xml" standalone="yes" encoding="UTF-8" indent="no"/>

    <xsl:template match="/cv:root">
        <w:ftr xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
               xmlns:r="http://purl.oclc.org/ooxml/officeDocument/relationships"
               xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
               xmlns:wp="http://purl.oclc.org/ooxml/drawingml/wordprocessingDrawing"
               xmlns:w="http://purl.oclc.org/ooxml/wordprocessingml/main"
               xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
               mc:Ignorable="w14 wp14">
            <w:p w14:paraId="7C80D9F2" w14:textId="0761B12A" w:rsidR="004F0464" w:rsidRPr="005815D4"
                 w:rsidRDefault="004F0464"
                 w:rsidP="005815D4">
                <w:pPr>
                    <w:pStyle w:val="Voettekst"/>
                    <w:tabs>
                        <w:tab w:val="clear" w:pos="225.65pt"/>
                        <w:tab w:val="clear" w:pos="451.30pt"/>
                        <w:tab w:val="start" w:pos="0pt"/>
                        <w:tab w:val="start" w:pos="120.50pt"/>
                        <w:tab w:val="start" w:pos="340.20pt"/>
                        <w:tab w:val="start" w:pos="418.20pt"/>
                    </w:tabs>
                    <w:ind w:end="-5.10pt"/>
                    <w:jc w:val="center"/>
                    <w:rPr>
                        <w:color w:val="FFFFFF" w:themeColor="background1"/>
                        <w:sz w:val="18"/>
                        <w:szCs w:val="18"/>
                    </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="002251BB">
                    <w:rPr>
                        <w:color w:val="FFFFFF" w:themeColor="background1"/>
                        <w:sz w:val="18"/>
                        <w:szCs w:val="18"/>
                    </w:rPr>
                    <w:drawing>
                        <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                   relativeHeight="251659264" behindDoc="1" locked="0" layoutInCell="1" allowOverlap="1"
                                   wp14:anchorId="668DF1E3" wp14:editId="203A40C9">
                            <wp:simplePos x="0" y="0"/>
                            <wp:positionH relativeFrom="page">
                                <wp:posOffset>-32491</wp:posOffset>
                            </wp:positionH>
                            <wp:positionV relativeFrom="page">
                                <wp:posOffset>10183724</wp:posOffset>
                            </wp:positionV>
                            <wp:extent cx="7596018" cy="510540"/>
                            <wp:effectExtent l="0" t="0" r="5080" b="3810"/>
                            <wp:wrapNone/>
                            <wp:docPr id="160917318" name="Picture 1"/>
                            <wp:cNvGraphicFramePr>
                                <a:graphicFrameLocks xmlns:a="http://purl.oclc.org/ooxml/drawingml/main"/>
                            </wp:cNvGraphicFramePr>
                            <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                <a:graphicData uri="http://purl.oclc.org/ooxml/drawingml/picture">
                                    <pic:pic xmlns:pic="http://purl.oclc.org/ooxml/drawingml/picture">
                                        <pic:nvPicPr>
                                            <pic:cNvPr id="160917318" name="Picture 1"/>
                                            <pic:cNvPicPr/>
                                        </pic:nvPicPr>
                                        <pic:blipFill rotWithShape="1">
                                            <a:blip r:embed="rId1"/>
                                            <a:srcRect l="-0.117%" t="20.419%" r="0.087%" b="44.809%"/>
                                            <a:stretch>
                                                <a:fillRect/>
                                            </a:stretch>
                                        </pic:blipFill>
                                        <pic:spPr bwMode="auto">
                                            <a:xfrm>
                                                <a:off x="0" y="0"/>
                                                <a:ext cx="7605479" cy="511176"/>
                                            </a:xfrm>
                                            <a:prstGeom prst="rect">
                                                <a:avLst/>
                                            </a:prstGeom>
                                            <a:ln>
                                                <a:noFill/>
                                            </a:ln>
                                            <a:extLst>
                                                <a:ext>
                                                    <xsl:attribute name="uri">
                                                        <xsl:value-of
                                                                select="'{53640926-AAD7-44D8-BBD7-CCE9431645EC}'"/>
                                                    </xsl:attribute>
                                                    <a14:shadowObscured
                                                            xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main"/>
                                                </a:ext>
                                            </a:extLst>
                                        </pic:spPr>
                                    </pic:pic>
                                </a:graphicData>
                            </a:graphic>
                            <wp14:sizeRelH relativeFrom="page">
                                <wp14:pctWidth>0%</wp14:pctWidth>
                            </wp14:sizeRelH>
                            <wp14:sizeRelV relativeFrom="page">
                                <wp14:pctHeight>0%</wp14:pctHeight>
                            </wp14:sizeRelV>
                        </wp:anchor>
                    </w:drawing>
                </w:r>
                <w:r w:rsidR="005815D4" w:rsidRPr="005815D4">
                    <w:rPr>
                        <w:color w:val="FFFFFF" w:themeColor="background1"/>
                        <w:sz w:val="18"/>
                        <w:szCs w:val="18"/>
                        <w:noProof/>
                    </w:rPr>
                    <w:t>
                        <xsl:call-template name="translate">
                            <xsl:with-param name="text" select="'CONTACTPERSOON'"/>
                        </xsl:call-template>
                    </w:t>
                    <w:tab/>
                    <w:t>
                        <xsl:value-of select="cv:businessUnit/cv:contactName"/>
                    </w:t>
                    <w:tab/>
                    <w:t>
                        <xsl:value-of select="cv:businessUnit/cv:contactPhone"/>
                    </w:t>
                    <w:tab/>
                </w:r>
                <w:hyperlink r:id="rId2" w:history="1">
                    <w:r w:rsidR="005815D4" w:rsidRPr="005815D4">
                        <w:rPr>
                            <w:rStyle w:val="Hyperlink"/>
                            <w:color w:val="FFFFFF" w:themeColor="background1"/>
                            <w:sz w:val="18"/>
                            <w:szCs w:val="18"/>
                            <w:noProof/>
                        </w:rPr>
                        <w:t>
                            <xsl:value-of select="cv:businessUnit/cv:contactEmail"/>
                        </w:t>
                    </w:r>
                </w:hyperlink>
            </w:p>
            <w:p w14:paraId="22292549" w14:textId="77777777" w:rsidR="004F0464" w:rsidRPr="004F0464"
                 w:rsidRDefault="004F0464"
                 w:rsidP="004F0464">
                <w:pPr>
                    <w:pStyle w:val="Voettekst"/>
                    <w:tabs>
                        <w:tab w:val="start" w:pos="0pt"/>
                    </w:tabs>
                </w:pPr>
            </w:p>
        </w:ftr>
    </xsl:template>

</xsl:stylesheet>