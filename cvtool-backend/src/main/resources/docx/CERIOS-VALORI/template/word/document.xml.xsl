<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:cv="https://ns.bransom.nl/valori/cv/v20250808.xsd" exclude-result-prefixes="cv" version="1.0">

    <xsl:import href="../../../common.xsl"/>
    <xsl:import href="../../../translations.xsl"/>
    <xsl:import href="../../../mappings.xsl"/>
    <xsl:import href="../../fragments.xsl"/>

    <xsl:output method="xml" standalone="yes" encoding="UTF-8" indent="no"/>

    <xsl:template match="/cv:root">
        <xsl:variable name="characteristics" select="cv:characteristics[cv:includeInCv = 'true']"/>
        <xsl:variable name="profile" select="$characteristics/cv:profile"/>
        <xsl:variable name="educations" select="cv:education[cv:includeInCv = 'true']"/>
        <xsl:variable name="trainings" select="cv:training[cv:includeInCv = 'true']"/>
        <xsl:variable name="experiences" select="cv:experience[cv:includeInCv = 'true']"/>
        <xsl:variable name="experienceOverviewItems" select="cv:experience[cv:includeInOverview = 'true']"/>
        <xsl:variable name="publications" select="cv:publication[cv:includeInCv = 'true']"/>
        <xsl:variable name="references" select="cv:reference[cv:includeInCv = 'true']"/>

        <w:document xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
                    xmlns:r="http://purl.oclc.org/ooxml/officeDocument/relationships"
                    xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
                    xmlns:wp="http://purl.oclc.org/ooxml/drawingml/wordprocessingDrawing"
                    xmlns:w="http://purl.oclc.org/ooxml/wordprocessingml/main"
                    xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
                    xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" mc:Ignorable="w14 wne wp14"
                    w:conformance="strict">
            <w:body>
                <!--

                HEADING

                -->
                <w:p w14:paraId="56438C05" w14:textId="16136407" w:rsidR="00B11653" w:rsidRDefault="00A14A52">
                    <w:r>
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251678720" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1" wp14:anchorId="41AA082E" wp14:editId="49EFE7C3">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>675386</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>-457200</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="922611" cy="692375"/>
                                <wp:effectExtent l="0" t="0" r="5080" b="0"/>
                                <wp:wrapNone/>
                                <wp:docPr id="1727648750" name="Graphic 10"/>
                                <wp:cNvGraphicFramePr>
                                    <a:graphicFrameLocks xmlns:a="http://purl.oclc.org/ooxml/drawingml/main"
                                                         noChangeAspect="1"/>
                                </wp:cNvGraphicFramePr>
                                <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                    <a:graphicData uri="http://purl.oclc.org/ooxml/drawingml/picture">
                                        <pic:pic xmlns:pic="http://purl.oclc.org/ooxml/drawingml/picture">
                                            <pic:nvPicPr>
                                                <pic:cNvPr id="1727648750" name="Graphic 10"/>
                                                <pic:cNvPicPr/>
                                            </pic:nvPicPr>
                                            <pic:blipFill>
                                                <a:blip r:embed="rId8">
                                                    <a:extLst>
                                                        <a:ext>
                                                            <xsl:attribute name="uri">
                                                                <xsl:value-of
                                                                        select="'{96DAC541-7B7A-43D3-8B79-37D633B846F1}'"/>
                                                            </xsl:attribute>
                                                            <asvg:svgBlip
                                                                    xmlns:asvg="http://schemas.microsoft.com/office/drawing/2016/SVG/main"
                                                                    r:embed="rId9"/>
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
                                                    <a:ext cx="927881" cy="696330"/>
                                                </a:xfrm>
                                                <a:prstGeom prst="rect">
                                                    <a:avLst/>
                                                </a:prstGeom>
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
                    <w:r w:rsidR="00DF7C37" w:rsidRPr="00B11653">
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251656190" behindDoc="1" locked="0" layoutInCell="1"
                                       allowOverlap="1" wp14:anchorId="72854C67" wp14:editId="666B755E">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>-712701</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="page">
                                    <wp:posOffset>-1561292</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="7787640" cy="5116195"/>
                                <wp:effectExtent l="0" t="0" r="0" b="1905"/>
                                <wp:wrapNone/>
                                <wp:docPr id="704115198" name="Picture 1"/>
                                <wp:cNvGraphicFramePr>
                                    <a:graphicFrameLocks xmlns:a="http://purl.oclc.org/ooxml/drawingml/main"
                                                         noChangeAspect="1"/>
                                </wp:cNvGraphicFramePr>
                                <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                    <a:graphicData uri="http://purl.oclc.org/ooxml/drawingml/picture">
                                        <pic:pic xmlns:pic="http://purl.oclc.org/ooxml/drawingml/picture">
                                            <pic:nvPicPr>
                                                <pic:cNvPr id="704115198" name="Picture 1"/>
                                                <pic:cNvPicPr/>
                                            </pic:nvPicPr>
                                            <pic:blipFill rotWithShape="1">
                                                <a:blip r:embed="rId10"/>
                                                <a:srcRect l="-1.601%" t="-11.668%" r="1.601%" b="45.972%"/>
                                                <a:stretch>
                                                    <a:fillRect/>
                                                </a:stretch>
                                            </pic:blipFill>
                                            <pic:spPr bwMode="auto">
                                                <a:xfrm>
                                                    <a:off x="0" y="0"/>
                                                    <a:ext cx="7787640" cy="5116195"/>
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
                    <w:r w:rsidR="00521384">
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251668480" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1" wp14:anchorId="413458E8" wp14:editId="04B1FF26">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>4994910</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>995045</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="1506855" cy="1180465"/>
                                <wp:effectExtent l="0" t="0" r="0" b="0"/>
                                <wp:wrapSquare wrapText="bothSides"/>
                                <wp:docPr id="816635374" name="Text Box 1"/>
                                <wp:cNvGraphicFramePr/>
                                <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                    <a:graphicData
                                            uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                        <wp:wsp>
                                            <wp:cNvSpPr txBox="1"/>
                                            <wp:spPr>
                                                <a:xfrm>
                                                    <a:off x="0" y="0"/>
                                                    <a:ext cx="1506855" cy="1180465"/>
                                                </a:xfrm>
                                                <a:prstGeom prst="rect">
                                                    <a:avLst/>
                                                </a:prstGeom>
                                                <a:noFill/>
                                                <a:ln w="6350">
                                                    <a:noFill/>
                                                </a:ln>
                                            </wp:spPr>
                                            <wp:txbx>
                                                <wne:txbxContent>
                                                    <w:p w14:paraId="747EC210" w14:textId="0CE16F5D" w:rsidR="0004532F"
                                                         w:rsidRPr="000E5868" w:rsidRDefault="0004532F"
                                                         w:rsidP="000E5868">
                                                        <w:pPr>
                                                            <w:spacing w:after="6pt" w:line="12pt" w:lineRule="auto"/>
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:color w:val="FFFFFF" w:themeColor="background1"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="000E5868">
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:color w:val="FFFFFF" w:themeColor="background1"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t>
                                                                <xsl:call-template name="translate">
                                                                    <xsl:with-param name="text"
                                                                                    select="'GEBOORTEDATUM'"/>
                                                                </xsl:call-template>
                                                            </w:t>
                                                        </w:r>
                                                    </w:p>
                                                    <w:p w14:paraId="4633CB24" w14:textId="3E1F5B64" w:rsidR="0004532F"
                                                         w:rsidRPr="000E5868" w:rsidRDefault="0004532F"
                                                         w:rsidP="000E5868">
                                                        <w:pPr>
                                                            <w:spacing w:after="6pt" w:line="12pt" w:lineRule="auto"/>
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:color w:val="FFFFFF" w:themeColor="background1"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="000E5868">
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:color w:val="FFFFFF" w:themeColor="background1"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t>
                                                                <xsl:apply-templates select="cv:account/cv:dateOfBirth"
                                                                                     mode="date-numeric"/>
                                                            </w:t>
                                                        </w:r>
                                                    </w:p>
                                                </wne:txbxContent>
                                            </wp:txbx>
                                            <wp:bodyPr rot="0" spcFirstLastPara="0" vertOverflow="overflow"
                                                       horzOverflow="overflow" vert="horz" wrap="square" lIns="91440"
                                                       tIns="45720" rIns="91440" bIns="45720" numCol="1" spcCol="0"
                                                       rtlCol="0" fromWordArt="0" anchor="t" anchorCtr="0" forceAA="0"
                                                       compatLnSpc="1">
                                                <a:prstTxWarp prst="textNoShape">
                                                    <a:avLst/>
                                                </a:prstTxWarp>
                                                <a:noAutofit/>
                                            </wp:bodyPr>
                                        </wp:wsp>
                                    </a:graphicData>
                                </a:graphic>
                                <wp14:sizeRelH relativeFrom="margin">
                                    <wp14:pctWidth>0%</wp14:pctWidth>
                                </wp14:sizeRelH>
                                <wp14:sizeRelV relativeFrom="margin">
                                    <wp14:pctHeight>0%</wp14:pctHeight>
                                </wp14:sizeRelV>
                            </wp:anchor>
                        </w:drawing>
                    </w:r>
                    <w:r w:rsidR="00AB1904">
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251660288" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1" wp14:anchorId="24CE036A" wp14:editId="00F1111A">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>-140540</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>608965</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="2616200" cy="2616200"/>
                                <wp:effectExtent l="0" t="0" r="0" b="0"/>
                                <wp:wrapNone/>
                                <wp:docPr id="2015815561" name="Oval 4"/>
                                <wp:cNvGraphicFramePr/>
                                <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                    <a:graphicData
                                            uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                        <wp:wsp>
                                            <wp:cNvSpPr/>
                                            <wp:spPr>
                                                <a:xfrm>
                                                    <a:off x="0" y="0"/>
                                                    <a:ext cx="2616200" cy="2616200"/>
                                                </a:xfrm>
                                                <a:prstGeom prst="ellipse">
                                                    <a:avLst/>
                                                </a:prstGeom>
                                                <a:blipFill dpi="0" rotWithShape="1">
                                                    <a:blip r:embed="rId11">
                                                        <a:extLst>
                                                            <a:ext>
                                                                <xsl:attribute name="uri">
                                                                    <xsl:value-of
                                                                            select="'{28A0092B-C50C-407E-A947-70E740481C1C}'"/>
                                                                </xsl:attribute>
                                                                <a14:useLocalDpi
                                                                        xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main"
                                                                        val="0"/>
                                                            </a:ext>
                                                        </a:extLst>
                                                    </a:blip>
                                                    <a:srcRect/>
                                                    <a:stretch>
                                                        <a:fillRect l="-0.453%" t="-1.876%" r="-1.876%" b="-0.453%"/>
                                                    </a:stretch>
                                                </a:blipFill>
                                                <a:ln>
                                                    <a:noFill/>
                                                </a:ln>
                                            </wp:spPr>
                                            <wp:style>
                                                <a:lnRef idx="2">
                                                    <a:schemeClr val="accent1">
                                                        <a:shade val="15%"/>
                                                    </a:schemeClr>
                                                </a:lnRef>
                                                <a:fillRef idx="1">
                                                    <a:schemeClr val="accent1"/>
                                                </a:fillRef>
                                                <a:effectRef idx="0">
                                                    <a:schemeClr val="accent1"/>
                                                </a:effectRef>
                                                <a:fontRef idx="minor">
                                                    <a:schemeClr val="lt1"/>
                                                </a:fontRef>
                                            </wp:style>
                                            <wp:bodyPr rot="0" spcFirstLastPara="0" vertOverflow="overflow"
                                                       horzOverflow="overflow" vert="horz" wrap="square" lIns="91440"
                                                       tIns="45720" rIns="91440" bIns="45720" numCol="1" spcCol="0"
                                                       rtlCol="0" fromWordArt="0" anchor="ctr" anchorCtr="0" forceAA="0"
                                                       compatLnSpc="1">
                                                <a:prstTxWarp prst="textNoShape">
                                                    <a:avLst/>
                                                </a:prstTxWarp>
                                                <a:noAutofit/>
                                            </wp:bodyPr>
                                        </wp:wsp>
                                    </a:graphicData>
                                </a:graphic>
                                <wp14:sizeRelH relativeFrom="margin">
                                    <wp14:pctWidth>0%</wp14:pctWidth>
                                </wp14:sizeRelH>
                                <wp14:sizeRelV relativeFrom="margin">
                                    <wp14:pctHeight>0%</wp14:pctHeight>
                                </wp14:sizeRelV>
                            </wp:anchor>
                        </w:drawing>
                    </w:r>
                    <w:r w:rsidR="005918E4">
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251666432" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1" wp14:anchorId="114F53A9" wp14:editId="19F0D31E">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>3280410</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>990600</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="1714500" cy="1464310"/>
                                <wp:effectExtent l="0" t="0" r="0" b="0"/>
                                <wp:wrapSquare wrapText="bothSides"/>
                                <wp:docPr id="3271020" name="Text Box 1"/>
                                <wp:cNvGraphicFramePr/>
                                <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                    <a:graphicData
                                            uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                        <wp:wsp>
                                            <wp:cNvSpPr txBox="1"/>
                                            <wp:spPr>
                                                <a:xfrm>
                                                    <a:off x="0" y="0"/>
                                                    <a:ext cx="1714500" cy="1464310"/>
                                                </a:xfrm>
                                                <a:prstGeom prst="rect">
                                                    <a:avLst/>
                                                </a:prstGeom>
                                                <a:noFill/>
                                                <a:ln w="6350">
                                                    <a:noFill/>
                                                </a:ln>
                                            </wp:spPr>
                                            <wp:txbx>
                                                <wne:txbxContent>
                                                    <w:p w14:paraId="284689E7" w14:textId="3630B969" w:rsidR="0004532F"
                                                         w:rsidRPr="000E5868" w:rsidRDefault="0004532F"
                                                         w:rsidP="000E5868">
                                                        <w:pPr>
                                                            <w:spacing w:after="6pt" w:line="13.80pt"
                                                                       w:lineRule="auto"/>
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:color w:val="FFFFFF" w:themeColor="background1"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="000E5868">
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:color w:val="FFFFFF" w:themeColor="background1"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t>
                                                                <xsl:call-template name="translate">
                                                                    <xsl:with-param name="text" select="'FUNCTIE'"/>
                                                                </xsl:call-template>
                                                            </w:t>
                                                        </w:r>
                                                    </w:p>
                                                    <w:p w14:paraId="53EF3592" w14:textId="1EEB775D" w:rsidR="0004532F"
                                                         w:rsidRPr="000E5868" w:rsidRDefault="0004532F"
                                                         w:rsidP="000E5868">
                                                        <w:pPr>
                                                            <w:spacing w:after="6pt" w:line="13.80pt"
                                                                       w:lineRule="auto"/>
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:color w:val="FFFFFF" w:themeColor="background1"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="000E5868">
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:color w:val="FFFFFF" w:themeColor="background1"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t>
                                                                <xsl:value-of select="cv:characteristics/cv:role"/>
                                                            </w:t>
                                                        </w:r>
                                                    </w:p>
                                                    <w:p w14:paraId="4ED6E054" w14:textId="77777777" w:rsidR="0004532F"
                                                         w:rsidRPr="000E5868" w:rsidRDefault="0004532F"
                                                         w:rsidP="000E5868">
                                                        <w:pPr>
                                                            <w:spacing w:after="0pt" w:line="13.80pt"
                                                                       w:lineRule="auto"/>
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:color w:val="FFFFFF" w:themeColor="background1"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                        </w:pPr>
                                                    </w:p>
                                                    <w:p w14:paraId="29798280" w14:textId="488A69ED" w:rsidR="0004532F"
                                                         w:rsidRPr="000E5868" w:rsidRDefault="0004532F"
                                                         w:rsidP="000E5868">
                                                        <w:pPr>
                                                            <w:spacing w:after="6pt" w:line="13.80pt"
                                                                       w:lineRule="auto"/>
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:color w:val="FFFFFF" w:themeColor="background1"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="000E5868">
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:color w:val="FFFFFF" w:themeColor="background1"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t>
                                                                <xsl:call-template name="translate">
                                                                    <xsl:with-param name="text" select="'WOONPLAATS'"/>
                                                                </xsl:call-template>
                                                            </w:t>
                                                        </w:r>
                                                    </w:p>
                                                    <w:p w14:paraId="27B0411B" w14:textId="0DBC4122" w:rsidR="0004532F"
                                                         w:rsidRPr="000E5868" w:rsidRDefault="0004532F"
                                                         w:rsidP="000E5868">
                                                        <w:pPr>
                                                            <w:spacing w:after="6pt" w:line="13.80pt"
                                                                       w:lineRule="auto"/>
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:color w:val="FFFFFF" w:themeColor="background1"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="000E5868">
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:color w:val="FFFFFF" w:themeColor="background1"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t>
                                                                <xsl:value-of select="$characteristics/cv:residence"/>
                                                            </w:t>
                                                        </w:r>
                                                    </w:p>
                                                </wne:txbxContent>
                                            </wp:txbx>
                                            <wp:bodyPr rot="0" spcFirstLastPara="0" vertOverflow="overflow"
                                                       horzOverflow="overflow" vert="horz" wrap="square" lIns="91440"
                                                       tIns="45720" rIns="91440" bIns="45720" numCol="1" spcCol="0"
                                                       rtlCol="0" fromWordArt="0" anchor="t" anchorCtr="0" forceAA="0"
                                                       compatLnSpc="1">
                                                <a:prstTxWarp prst="textNoShape">
                                                    <a:avLst/>
                                                </a:prstTxWarp>
                                                <a:noAutofit/>
                                            </wp:bodyPr>
                                        </wp:wsp>
                                    </a:graphicData>
                                </a:graphic>
                                <wp14:sizeRelH relativeFrom="margin">
                                    <wp14:pctWidth>0%</wp14:pctWidth>
                                </wp14:sizeRelH>
                                <wp14:sizeRelV relativeFrom="margin">
                                    <wp14:pctHeight>0%</wp14:pctHeight>
                                </wp14:sizeRelV>
                            </wp:anchor>
                        </w:drawing>
                    </w:r>
                    <w:r w:rsidR="005918E4">
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251664384" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1" wp14:anchorId="1541F9EA" wp14:editId="4A4B71BC">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>3280410</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>-15240</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="3656965" cy="811530"/>
                                <wp:effectExtent l="0" t="0" r="0" b="0"/>
                                <wp:wrapNone/>
                                <wp:docPr id="1382255691" name="Text Box 5"/>
                                <wp:cNvGraphicFramePr/>
                                <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                    <a:graphicData
                                            uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                        <wp:wsp>
                                            <wp:cNvSpPr txBox="1"/>
                                            <wp:spPr>
                                                <a:xfrm>
                                                    <a:off x="0" y="0"/>
                                                    <a:ext cx="3656965" cy="811530"/>
                                                </a:xfrm>
                                                <a:prstGeom prst="rect">
                                                    <a:avLst/>
                                                </a:prstGeom>
                                                <a:noFill/>
                                                <a:ln w="6350">
                                                    <a:noFill/>
                                                </a:ln>
                                            </wp:spPr>
                                            <wp:txbx>
                                                <wne:txbxContent>
                                                    <w:p w14:paraId="2A955DE2" w14:textId="6F32DDA5" w:rsidR="00B11653"
                                                         w:rsidRPr="000E5868" w:rsidRDefault="00B11653"
                                                         w:rsidP="000E5868">
                                                        <w:pPr>
                                                            <w:spacing w:line="12pt" w:lineRule="auto"/>
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:color w:val="FFFFFF" w:themeColor="background1"/>
                                                                <w:sz w:val="58"/>
                                                                <w:szCs w:val="58"/>
                                                            </w:rPr>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="000E5868">
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:color w:val="FFFFFF" w:themeColor="background1"/>
                                                                <w:sz w:val="58"/>
                                                                <w:szCs w:val="58"/>
                                                            </w:rPr>
                                                            <w:t>
                                                                <xsl:value-of select="cv:account/cv:name"/>
                                                            </w:t>
                                                        </w:r>
                                                    </w:p>
                                                    <w:p w14:paraId="0ECEF8ED" w14:textId="77777777" w:rsidR="0004532F"
                                                         w:rsidRPr="000E5868" w:rsidRDefault="0004532F"
                                                         w:rsidP="000E5868">
                                                        <w:pPr>
                                                            <w:spacing w:line="12pt" w:lineRule="auto"/>
                                                            <w:rPr>
                                                                <w:color w:val="FFFFFF" w:themeColor="background1"/>
                                                            </w:rPr>
                                                        </w:pPr>
                                                    </w:p>
                                                </wne:txbxContent>
                                            </wp:txbx>
                                            <wp:bodyPr rot="0" spcFirstLastPara="0" vertOverflow="overflow"
                                                       horzOverflow="overflow" vert="horz" wrap="square" lIns="91440"
                                                       tIns="45720" rIns="91440" bIns="45720" numCol="1" spcCol="0"
                                                       rtlCol="0" fromWordArt="0" anchor="t" anchorCtr="0" forceAA="0"
                                                       compatLnSpc="1">
                                                <a:prstTxWarp prst="textNoShape">
                                                    <a:avLst/>
                                                </a:prstTxWarp>
                                                <a:noAutofit/>
                                            </wp:bodyPr>
                                        </wp:wsp>
                                    </a:graphicData>
                                </a:graphic>
                                <wp14:sizeRelH relativeFrom="margin">
                                    <wp14:pctWidth>0%</wp14:pctWidth>
                                </wp14:sizeRelH>
                                <wp14:sizeRelV relativeFrom="margin">
                                    <wp14:pctHeight>0%</wp14:pctHeight>
                                </wp14:sizeRelV>
                            </wp:anchor>
                        </w:drawing>
                    </w:r>
                    <w:r w:rsidR="00B11653">
                        <w:br/>
                        <w:br/>
                        <w:br/>
                        <w:br/>
                    </w:r>
                </w:p>
                <w:p w14:paraId="1F42E1CF" w14:textId="020B6771" w:rsidR="0004532F" w:rsidRDefault="0004532F">
                    <w:pPr>
                        <w:sectPr w:rsidR="0004532F" w:rsidSect="00F87D02">
                            <w:headerReference w:type="even" r:id="rId12"/>
                            <w:headerReference w:type="default" r:id="rId13"/>
                            <w:footerReference w:type="even" r:id="rId14"/>
                            <w:footerReference w:type="default" r:id="rId15"/>
                            <w:headerReference w:type="first" r:id="rId16"/>
                            <w:footerReference w:type="first" r:id="rId17"/>
                            <w:pgSz w:w="595.30pt" w:h="841.90pt"/>
                            <w:pgMar w:top="72pt" w:right="31.10pt" w:bottom="72pt" w:left="39.70pt" w:header="35.45pt"
                                     w:footer="19.85pt" w:gutter="0pt"/>
                            <w:cols w:space="35.40pt"/>
                            <w:titlePg/>
                            <w:docGrid w:linePitch="360"/>
                        </w:sectPr>
                    </w:pPr>
                </w:p>
                <w:p w14:paraId="0245734B" w14:textId="76F38735" w:rsidR="00B11653" w:rsidRDefault="00521384">
                    <w:r>
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251689984" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1" wp14:anchorId="1ECB61F0" wp14:editId="04CE6F15">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>4669155</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>983615</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="1859915" cy="479425"/>
                                <wp:effectExtent l="0" t="0" r="0" b="0"/>
                                <wp:wrapNone/>
                                <wp:docPr id="1136429579" name="Graphic 15"/>
                                <wp:cNvGraphicFramePr>
                                    <a:graphicFrameLocks xmlns:a="http://purl.oclc.org/ooxml/drawingml/main"
                                                         noChangeAspect="1"/>
                                </wp:cNvGraphicFramePr>
                                <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                    <a:graphicData uri="http://purl.oclc.org/ooxml/drawingml/picture">
                                        <pic:pic xmlns:pic="http://purl.oclc.org/ooxml/drawingml/picture">
                                            <pic:nvPicPr>
                                                <pic:cNvPr id="1136429579" name="Graphic 1136429579"/>
                                                <pic:cNvPicPr/>
                                            </pic:nvPicPr>
                                            <pic:blipFill>
                                                <a:blip r:embed="rId18">
                                                    <a:extLst>
                                                        <a:ext>
                                                            <xsl:attribute name="uri">
                                                                <xsl:value-of
                                                                        select="'{96DAC541-7B7A-43D3-8B79-37D633B846F1}'"/>
                                                            </xsl:attribute>
                                                            <asvg:svgBlip
                                                                    xmlns:asvg="http://schemas.microsoft.com/office/drawing/2016/SVG/main"
                                                                    r:embed="rId19"/>
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
                                                    <a:ext cx="1859915" cy="479425"/>
                                                </a:xfrm>
                                                <a:prstGeom prst="rect">
                                                    <a:avLst/>
                                                </a:prstGeom>
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
                    <w:r w:rsidR="009A0322">
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251694080" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1" wp14:anchorId="7CFBF048" wp14:editId="74BDD271">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>-440711</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>5950835</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="818463" cy="0"/>
                                <wp:effectExtent l="0" t="12700" r="20320" b="12700"/>
                                <wp:wrapNone/>
                                <wp:docPr id="798517348" name="Straight Connector 15"/>
                                <wp:cNvGraphicFramePr/>
                                <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                    <a:graphicData
                                            uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                        <wp:wsp>
                                            <wp:cNvCnPr/>
                                            <wp:spPr>
                                                <a:xfrm>
                                                    <a:off x="0" y="0"/>
                                                    <a:ext cx="818463" cy="0"/>
                                                </a:xfrm>
                                                <a:prstGeom prst="line">
                                                    <a:avLst/>
                                                </a:prstGeom>
                                                <a:ln>
                                                    <a:solidFill>
                                                        <a:srgbClr val="F6A10A"/>
                                                    </a:solidFill>
                                                </a:ln>
                                            </wp:spPr>
                                            <wp:style>
                                                <a:lnRef idx="2">
                                                    <a:schemeClr val="accent6"/>
                                                </a:lnRef>
                                                <a:fillRef idx="0">
                                                    <a:schemeClr val="accent6"/>
                                                </a:fillRef>
                                                <a:effectRef idx="1">
                                                    <a:schemeClr val="accent6"/>
                                                </a:effectRef>
                                                <a:fontRef idx="minor">
                                                    <a:schemeClr val="tx1"/>
                                                </a:fontRef>
                                            </wp:style>
                                            <wp:bodyPr/>
                                        </wp:wsp>
                                    </a:graphicData>
                                </a:graphic>
                                <wp14:sizeRelH relativeFrom="margin">
                                    <wp14:pctWidth>0%</wp14:pctWidth>
                                </wp14:sizeRelH>
                                <wp14:sizeRelV relativeFrom="margin">
                                    <wp14:pctHeight>0%</wp14:pctHeight>
                                </wp14:sizeRelV>
                            </wp:anchor>
                        </w:drawing>
                    </w:r>
                    <w:r w:rsidR="009A0322">
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251692032" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1" wp14:anchorId="0FBC6806" wp14:editId="4C22F92B">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>-440055</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>2681574</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="1453515" cy="0"/>
                                <wp:effectExtent l="0" t="12700" r="19685" b="12700"/>
                                <wp:wrapNone/>
                                <wp:docPr id="1864530245" name="Straight Connector 15"/>
                                <wp:cNvGraphicFramePr/>
                                <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                    <a:graphicData
                                            uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                        <wp:wsp>
                                            <wp:cNvCnPr/>
                                            <wp:spPr>
                                                <a:xfrm>
                                                    <a:off x="0" y="0"/>
                                                    <a:ext cx="1453515" cy="0"/>
                                                </a:xfrm>
                                                <a:prstGeom prst="line">
                                                    <a:avLst/>
                                                </a:prstGeom>
                                                <a:ln>
                                                    <a:solidFill>
                                                        <a:srgbClr val="F6A10A"/>
                                                    </a:solidFill>
                                                </a:ln>
                                            </wp:spPr>
                                            <wp:style>
                                                <a:lnRef idx="2">
                                                    <a:schemeClr val="accent6"/>
                                                </a:lnRef>
                                                <a:fillRef idx="0">
                                                    <a:schemeClr val="accent6"/>
                                                </a:fillRef>
                                                <a:effectRef idx="1">
                                                    <a:schemeClr val="accent6"/>
                                                </a:effectRef>
                                                <a:fontRef idx="minor">
                                                    <a:schemeClr val="tx1"/>
                                                </a:fontRef>
                                            </wp:style>
                                            <wp:bodyPr/>
                                        </wp:wsp>
                                    </a:graphicData>
                                </a:graphic>
                                <wp14:sizeRelH relativeFrom="margin">
                                    <wp14:pctWidth>0%</wp14:pctWidth>
                                </wp14:sizeRelH>
                            </wp:anchor>
                        </w:drawing>
                    </w:r>
                    <w:r w:rsidR="00B635D4" w:rsidRPr="00D52540">
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251655165" behindDoc="1" locked="0" layoutInCell="1"
                                       allowOverlap="1" wp14:anchorId="52B7CF1E" wp14:editId="14224408">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>3372485</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>5727800</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="3945589" cy="4047098"/>
                                <wp:effectExtent l="0" t="0" r="4445" b="4445"/>
                                <wp:wrapNone/>
                                <wp:docPr id="1274544615" name="Picture 1"/>
                                <wp:cNvGraphicFramePr>
                                    <a:graphicFrameLocks xmlns:a="http://purl.oclc.org/ooxml/drawingml/main"
                                                         noChangeAspect="1"/>
                                </wp:cNvGraphicFramePr>
                                <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                    <a:graphicData uri="http://purl.oclc.org/ooxml/drawingml/picture">
                                        <pic:pic xmlns:pic="http://purl.oclc.org/ooxml/drawingml/picture">
                                            <pic:nvPicPr>
                                                <pic:cNvPr id="1274544615" name=""/>
                                                <pic:cNvPicPr/>
                                            </pic:nvPicPr>
                                            <pic:blipFill>
                                                <a:blip r:embed="rId20">
                                                    <a:alphaModFix amt="20%"/>
                                                </a:blip>
                                                <a:stretch>
                                                    <a:fillRect/>
                                                </a:stretch>
                                            </pic:blipFill>
                                            <pic:spPr>
                                                <a:xfrm>
                                                    <a:off x="0" y="0"/>
                                                    <a:ext cx="3945589" cy="4047098"/>
                                                </a:xfrm>
                                                <a:prstGeom prst="rect">
                                                    <a:avLst/>
                                                </a:prstGeom>
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
                    <!--

                    PROFILE

                    -->
                    <w:r w:rsidR="001A7313">
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251669504" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1" wp14:anchorId="5A312803" wp14:editId="114E646B">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>-545123</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>2364106</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="3240000" cy="2848708"/>
                                <wp:effectExtent l="0" t="0" r="0" b="0"/>
                                <wp:wrapNone/>
                                <wp:docPr id="1227867030" name="Text Box 6"/>
                                <wp:cNvGraphicFramePr/>
                                <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                    <a:graphicData
                                            uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                        <wp:wsp>
                                            <wp:cNvSpPr txBox="1"/>
                                            <wp:spPr>
                                                <a:xfrm>
                                                    <a:off x="0" y="0"/>
                                                    <a:ext cx="3240000" cy="2848708"/>
                                                </a:xfrm>
                                                <a:prstGeom prst="rect">
                                                    <a:avLst/>
                                                </a:prstGeom>
                                                <a:noFill/>
                                                <a:ln w="6350">
                                                    <a:noFill/>
                                                </a:ln>
                                            </wp:spPr>
                                            <wp:txbx id="4">
                                                <wne:txbxContent>
                                                    <w:p w14:paraId="4B1C264A" w14:textId="11F5CF82" w:rsidR="000E5868"
                                                         w:rsidRPr="00AB1904" w:rsidRDefault="00D52540"
                                                         w:rsidP="00160C07">
                                                        <w:pPr>
                                                            <w:pStyle w:val="Titel1"/>
                                                            <w:rPr>
                                                                <w:u w:val="none"/>
                                                                <w:lang w:val="nl-NL"/>
                                                            </w:rPr>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="00AB1904">
                                                            <w:rPr>
                                                                <w:u w:val="none"/>
                                                                <w:lang w:val="nl-NL"/>
                                                            </w:rPr>
                                                            <w:t>
                                                                <xsl:call-template name="translate">
                                                                    <xsl:with-param name="text"
                                                                                    select="'Persoonlijk profiel'"/>
                                                                </xsl:call-template>
                                                            </w:t>
                                                        </w:r>
                                                    </w:p>
                                                    <w:p w14:paraId="1E4DCC74" w14:textId="190F3819" w:rsidR="0004532F"
                                                         w:rsidRDefault="0004532F" w:rsidP="000E5868">
                                                        <w:pPr>
                                                            <w:pStyle w:val="BasicParagraph"/>
                                                            <w:suppressAutoHyphens/>
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="PlusJakartaSans-Regular"
                                                                          w:hAnsi="PlusJakartaSans-Regular"
                                                                          w:cs="PlusJakartaSans-Regular"/>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                        </w:pPr>
                                                    </w:p>
                                                    <xsl:apply-templates select="$profile" mode="markdown"/>
                                                </wne:txbxContent>
                                            </wp:txbx>
                                            <wp:bodyPr rot="0" spcFirstLastPara="0" vertOverflow="overflow"
                                                       horzOverflow="overflow" vert="horz" wrap="square" lIns="91440"
                                                       tIns="45720" rIns="91440" bIns="45720" numCol="1" spcCol="0"
                                                       rtlCol="0" fromWordArt="0" anchor="t" anchorCtr="0" forceAA="0"
                                                       compatLnSpc="1">
                                                <a:prstTxWarp prst="textNoShape">
                                                    <a:avLst/>
                                                </a:prstTxWarp>
                                                <a:noAutofit/>
                                            </wp:bodyPr>
                                        </wp:wsp>
                                    </a:graphicData>
                                </a:graphic>
                                <wp14:sizeRelH relativeFrom="margin">
                                    <wp14:pctWidth>0%</wp14:pctWidth>
                                </wp14:sizeRelH>
                                <wp14:sizeRelV relativeFrom="margin">
                                    <wp14:pctHeight>0%</wp14:pctHeight>
                                </wp14:sizeRelV>
                            </wp:anchor>
                        </w:drawing>
                    </w:r>
                    <xsl:if test="$characteristics/cv:interests">
                        <w:r w:rsidR="001A7313">
                            <w:rPr>
                                <w:noProof/>
                            </w:rPr>
                            <w:drawing>
                                <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                           relativeHeight="251671552" behindDoc="0" locked="0" layoutInCell="1"
                                           allowOverlap="1" wp14:anchorId="6159BDFF" wp14:editId="357C47DF">
                                    <wp:simplePos x="0" y="0"/>
                                    <wp:positionH relativeFrom="column">
                                        <wp:posOffset>2840355</wp:posOffset>
                                    </wp:positionH>
                                    <wp:positionV relativeFrom="paragraph">
                                        <wp:posOffset>2750185</wp:posOffset>
                                    </wp:positionV>
                                    <wp:extent cx="3240000" cy="2402732"/>
                                    <wp:effectExtent l="0" t="0" r="0" b="0"/>
                                    <wp:wrapNone/>
                                    <wp:docPr id="2053133036" name="Text Box 6"/>
                                    <wp:cNvGraphicFramePr/>
                                    <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                        <a:graphicData
                                                uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                            <wp:wsp>
                                                <wp:cNvSpPr txBox="1"/>
                                                <wp:spPr>
                                                    <a:xfrm>
                                                        <a:off x="0" y="0"/>
                                                        <a:ext cx="3240000" cy="2402732"/>
                                                    </a:xfrm>
                                                    <a:prstGeom prst="rect">
                                                        <a:avLst/>
                                                    </a:prstGeom>
                                                    <a:noFill/>
                                                    <a:ln w="6350">
                                                        <a:noFill/>
                                                    </a:ln>
                                                </wp:spPr>
                                                <wp:linkedTxbx id="4" seq="1"/>
                                                <wp:bodyPr rot="0" spcFirstLastPara="0" vertOverflow="overflow"
                                                           horzOverflow="overflow" vert="horz" wrap="square"
                                                           lIns="91440"
                                                           tIns="45720" rIns="91440" bIns="45720" numCol="1" spcCol="0"
                                                           rtlCol="0" fromWordArt="0" anchor="t" anchorCtr="0"
                                                           forceAA="0"
                                                           compatLnSpc="1">
                                                    <a:prstTxWarp prst="textNoShape">
                                                        <a:avLst/>
                                                    </a:prstTxWarp>
                                                    <a:noAutofit/>
                                                </wp:bodyPr>
                                            </wp:wsp>
                                        </a:graphicData>
                                    </a:graphic>
                                    <wp14:sizeRelH relativeFrom="margin">
                                        <wp14:pctWidth>0%</wp14:pctWidth>
                                    </wp14:sizeRelH>
                                    <wp14:sizeRelV relativeFrom="margin">
                                        <wp14:pctHeight>0%</wp14:pctHeight>
                                    </wp14:sizeRelV>
                                </wp:anchor>
                            </w:drawing>
                        </w:r>
                        <w:r w:rsidR="000E5868">
                            <w:rPr>
                                <w:noProof/>
                            </w:rPr>
                            <w:drawing>
                                <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                           relativeHeight="251674624" behindDoc="0" locked="0" layoutInCell="1"
                                           allowOverlap="1" wp14:anchorId="783536A8" wp14:editId="7BDDF852">
                                    <wp:simplePos x="0" y="0"/>
                                    <wp:positionH relativeFrom="column">
                                        <wp:posOffset>-546100</wp:posOffset>
                                    </wp:positionH>
                                    <wp:positionV relativeFrom="paragraph">
                                        <wp:posOffset>5584825</wp:posOffset>
                                    </wp:positionV>
                                    <wp:extent cx="3318933" cy="774700"/>
                                    <wp:effectExtent l="0" t="0" r="0" b="0"/>
                                    <wp:wrapNone/>
                                    <wp:docPr id="1844881255" name="Rectangle 7"/>
                                    <wp:cNvGraphicFramePr/>
                                    <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                        <a:graphicData
                                                uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                            <wp:wsp>
                                                <wp:cNvSpPr/>
                                                <wp:spPr>
                                                    <a:xfrm>
                                                        <a:off x="0" y="0"/>
                                                        <a:ext cx="3318933" cy="774700"/>
                                                    </a:xfrm>
                                                    <a:prstGeom prst="rect">
                                                        <a:avLst/>
                                                    </a:prstGeom>
                                                    <a:solidFill>
                                                        <a:srgbClr val="FAFAFA"/>
                                                    </a:solidFill>
                                                    <a:ln>
                                                        <a:noFill/>
                                                    </a:ln>
                                                </wp:spPr>
                                                <wp:style>
                                                    <a:lnRef idx="2">
                                                        <a:schemeClr val="accent1">
                                                            <a:shade val="15%"/>
                                                        </a:schemeClr>
                                                    </a:lnRef>
                                                    <a:fillRef idx="1">
                                                        <a:schemeClr val="accent1"/>
                                                    </a:fillRef>
                                                    <a:effectRef idx="0">
                                                        <a:schemeClr val="accent1"/>
                                                    </a:effectRef>
                                                    <a:fontRef idx="minor">
                                                        <a:schemeClr val="lt1"/>
                                                    </a:fontRef>
                                                </wp:style>
                                                <wp:txbx>
                                                    <wne:txbxContent>
                                                        <w:p w14:paraId="26ED557F" w14:textId="578660EB"
                                                             w:rsidR="00D52540"
                                                             w:rsidRPr="00D52540" w:rsidRDefault="00D52540"
                                                             w:rsidP="00D52540"/>
                                                    </wne:txbxContent>
                                                </wp:txbx>
                                                <wp:bodyPr rot="0" spcFirstLastPara="0" vertOverflow="overflow"
                                                           horzOverflow="overflow" vert="horz" wrap="square"
                                                           lIns="91440"
                                                           tIns="45720" rIns="91440" bIns="45720" numCol="1" spcCol="0"
                                                           rtlCol="0" fromWordArt="0" anchor="ctr" anchorCtr="0"
                                                           forceAA="0"
                                                           compatLnSpc="1">
                                                    <a:prstTxWarp prst="textNoShape">
                                                        <a:avLst/>
                                                    </a:prstTxWarp>
                                                    <a:noAutofit/>
                                                </wp:bodyPr>
                                            </wp:wsp>
                                        </a:graphicData>
                                    </a:graphic>
                                    <wp14:sizeRelH relativeFrom="margin">
                                        <wp14:pctWidth>0%</wp14:pctWidth>
                                    </wp14:sizeRelH>
                                    <wp14:sizeRelV relativeFrom="margin">
                                        <wp14:pctHeight>0%</wp14:pctHeight>
                                    </wp14:sizeRelV>
                                </wp:anchor>
                            </w:drawing>
                        </w:r>
                        <w:r w:rsidR="000E5868">
                            <w:rPr>
                                <w:noProof/>
                            </w:rPr>
                            <w:drawing>
                                <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                           relativeHeight="251668991" behindDoc="0" locked="0" layoutInCell="1"
                                           allowOverlap="1" wp14:anchorId="3D5826BC" wp14:editId="0D8C587B">
                                    <wp:simplePos x="0" y="0"/>
                                    <wp:positionH relativeFrom="column">
                                        <wp:posOffset>-546735</wp:posOffset>
                                    </wp:positionH>
                                    <wp:positionV relativeFrom="paragraph">
                                        <wp:posOffset>2297430</wp:posOffset>
                                    </wp:positionV>
                                    <wp:extent cx="6832600" cy="3075263"/>
                                    <wp:effectExtent l="0" t="0" r="0" b="0"/>
                                    <wp:wrapNone/>
                                    <wp:docPr id="1156227614" name="Rectangle 7"/>
                                    <wp:cNvGraphicFramePr/>
                                    <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                        <a:graphicData
                                                uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                            <wp:wsp>
                                                <wp:cNvSpPr/>
                                                <wp:spPr>
                                                    <a:xfrm>
                                                        <a:off x="0" y="0"/>
                                                        <a:ext cx="6832600" cy="3075263"/>
                                                    </a:xfrm>
                                                    <a:prstGeom prst="rect">
                                                        <a:avLst/>
                                                    </a:prstGeom>
                                                    <a:solidFill>
                                                        <a:srgbClr val="FAFAFA"/>
                                                    </a:solidFill>
                                                    <a:ln>
                                                        <a:noFill/>
                                                    </a:ln>
                                                </wp:spPr>
                                                <wp:style>
                                                    <a:lnRef idx="2">
                                                        <a:schemeClr val="accent1">
                                                            <a:shade val="15%"/>
                                                        </a:schemeClr>
                                                    </a:lnRef>
                                                    <a:fillRef idx="1">
                                                        <a:schemeClr val="accent1"/>
                                                    </a:fillRef>
                                                    <a:effectRef idx="0">
                                                        <a:schemeClr val="accent1"/>
                                                    </a:effectRef>
                                                    <a:fontRef idx="minor">
                                                        <a:schemeClr val="lt1"/>
                                                    </a:fontRef>
                                                </wp:style>
                                                <wp:bodyPr rot="0" spcFirstLastPara="0" vertOverflow="overflow"
                                                           horzOverflow="overflow" vert="horz" wrap="square"
                                                           lIns="91440"
                                                           tIns="45720" rIns="91440" bIns="45720" numCol="1" spcCol="0"
                                                           rtlCol="0" fromWordArt="0" anchor="ctr" anchorCtr="0"
                                                           forceAA="0"
                                                           compatLnSpc="1">
                                                    <a:prstTxWarp prst="textNoShape">
                                                        <a:avLst/>
                                                    </a:prstTxWarp>
                                                    <a:noAutofit/>
                                                </wp:bodyPr>
                                            </wp:wsp>
                                        </a:graphicData>
                                    </a:graphic>
                                    <wp14:sizeRelV relativeFrom="margin">
                                        <wp14:pctHeight>0%</wp14:pctHeight>
                                    </wp14:sizeRelV>
                                </wp:anchor>
                            </w:drawing>
                        </w:r>
                        <w:r w:rsidR="000E5868">
                            <w:rPr>
                                <w:noProof/>
                            </w:rPr>
                            <w:drawing>
                                <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                           relativeHeight="251675648" behindDoc="0" locked="0" layoutInCell="1"
                                           allowOverlap="1" wp14:anchorId="4527B553" wp14:editId="56F8B96B">
                                    <wp:simplePos x="0" y="0"/>
                                    <wp:positionH relativeFrom="column">
                                        <wp:posOffset>-546100</wp:posOffset>
                                    </wp:positionH>
                                    <wp:positionV relativeFrom="paragraph">
                                        <wp:posOffset>5646420</wp:posOffset>
                                    </wp:positionV>
                                    <wp:extent cx="3352800" cy="660400"/>
                                    <wp:effectExtent l="0" t="0" r="0" b="0"/>
                                    <wp:wrapNone/>
                                    <wp:docPr id="754747958" name="Text Box 9"/>
                                    <wp:cNvGraphicFramePr/>
                                    <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                        <a:graphicData
                                                uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                            <wp:wsp>
                                                <wp:cNvSpPr txBox="1"/>
                                                <wp:spPr>
                                                    <a:xfrm>
                                                        <a:off x="0" y="0"/>
                                                        <a:ext cx="3352800" cy="660400"/>
                                                    </a:xfrm>
                                                    <a:prstGeom prst="rect">
                                                        <a:avLst/>
                                                    </a:prstGeom>
                                                    <a:noFill/>
                                                    <a:ln w="6350">
                                                        <a:noFill/>
                                                    </a:ln>
                                                </wp:spPr>
                                                <wp:txbx>
                                                    <wne:txbxContent>
                                                        <w:p w14:paraId="76C9C377" w14:textId="77777777"
                                                             w:rsidR="000E5868"
                                                             w:rsidRPr="00AB1904" w:rsidRDefault="00D52540"
                                                             w:rsidP="00160C07">
                                                            <w:pPr>
                                                                <w:pStyle w:val="Titel1"/>
                                                                <w:rPr>
                                                                    <w:u w:val="none"/>
                                                                    <w:lang w:val="nl-NL"/>
                                                                </w:rPr>
                                                            </w:pPr>
                                                            <w:r w:rsidRPr="00AB1904">
                                                                <w:rPr>
                                                                    <w:u w:val="none"/>
                                                                    <w:lang w:val="nl-NL"/>
                                                                </w:rPr>
                                                                <w:t>
                                                                    <xsl:call-template name="translate">
                                                                        <xsl:with-param name="text"
                                                                                        select="'Interesses'"/>
                                                                    </xsl:call-template>
                                                                </w:t>
                                                            </w:r>
                                                        </w:p>
                                                        <w:p w14:paraId="62C664D3" w14:textId="2DD59BE1"
                                                             w:rsidR="00D52540"
                                                             w:rsidRPr="000E5868" w:rsidRDefault="00D52540"
                                                             w:rsidP="000E5868">
                                                            <w:pPr>
                                                                <w:spacing w:before="12pt"/>
                                                                <w:rPr>
                                                                    <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                              w:hAnsi="Plus Jakarta Sans"/>
                                                                    <w:sz w:val="18"/>
                                                                    <w:szCs w:val="18"/>
                                                                </w:rPr>
                                                            </w:pPr>
                                                            <w:r w:rsidRPr="000E5868">
                                                                <w:rPr>
                                                                    <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                              w:hAnsi="Plus Jakarta Sans"/>
                                                                    <w:sz w:val="18"/>
                                                                    <w:szCs w:val="18"/>
                                                                </w:rPr>
                                                                <w:t>
                                                                    <xsl:value-of
                                                                            select="$characteristics/cv:interests"/>
                                                                </w:t>
                                                            </w:r>
                                                        </w:p>
                                                    </wne:txbxContent>
                                                </wp:txbx>
                                                <wp:bodyPr rot="0" spcFirstLastPara="0" vertOverflow="overflow"
                                                           horzOverflow="overflow" vert="horz" wrap="square"
                                                           lIns="91440"
                                                           tIns="45720" rIns="91440" bIns="45720" numCol="1" spcCol="0"
                                                           rtlCol="0" fromWordArt="0" anchor="t" anchorCtr="0"
                                                           forceAA="0"
                                                           compatLnSpc="1">
                                                    <a:prstTxWarp prst="textNoShape">
                                                        <a:avLst/>
                                                    </a:prstTxWarp>
                                                    <a:noAutofit/>
                                                </wp:bodyPr>
                                            </wp:wsp>
                                        </a:graphicData>
                                    </a:graphic>
                                    <wp14:sizeRelH relativeFrom="margin">
                                        <wp14:pctWidth>0%</wp14:pctWidth>
                                    </wp14:sizeRelH>
                                    <wp14:sizeRelV relativeFrom="margin">
                                        <wp14:pctHeight>0%</wp14:pctHeight>
                                    </wp14:sizeRelV>
                                </wp:anchor>
                            </w:drawing>
                        </w:r>
                    </xsl:if>
                    <w:r w:rsidR="00B11653">
                        <w:br w:type="page"/>
                    </w:r>
                </w:p>
                <w:p w14:paraId="47B6466D" w14:textId="77777777" w:rsidR="00462426" w:rsidRDefault="00462426">
                    <w:pPr>
                        <w:sectPr w:rsidR="00462426" w:rsidSect="00F87D02">
                            <w:type w:val="continuous"/>
                            <w:pgSz w:w="595.30pt" w:h="841.90pt"/>
                            <w:pgMar w:top="72pt" w:right="31.10pt" w:bottom="72pt" w:left="72pt" w:header="35.40pt"
                                     w:footer="35.40pt" w:gutter="0pt"/>
                            <w:cols w:num="2" w:space="35.40pt"/>
                            <w:docGrid w:linePitch="360"/>
                        </w:sectPr>
                    </w:pPr>
                </w:p>
                <!--

                SKILLS

                -->
                <w:p w14:paraId="04942FD4" w14:textId="17CCD897" w:rsidR="002251BB" w:rsidRPr="00AB1904"
                     w:rsidRDefault="00AB1904" w:rsidP="00160C07">
                    <w:pPr>
                        <w:pStyle w:val="Titel1"/>
                        <w:rPr>
                            <w:u w:val="none"/>
                        </w:rPr>
                    </w:pPr>
                    <w:r>
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:lastRenderedPageBreak/>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251696128" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1" wp14:anchorId="413EEDC9" wp14:editId="4838F52F">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>-635</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>279015</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="2033286" cy="0"/>
                                <wp:effectExtent l="0" t="12700" r="24130" b="12700"/>
                                <wp:wrapNone/>
                                <wp:docPr id="1662970918" name="Straight Connector 15"/>
                                <wp:cNvGraphicFramePr/>
                                <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                    <a:graphicData
                                            uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                        <wp:wsp>
                                            <wp:cNvCnPr/>
                                            <wp:spPr>
                                                <a:xfrm>
                                                    <a:off x="0" y="0"/>
                                                    <a:ext cx="2033286" cy="0"/>
                                                </a:xfrm>
                                                <a:prstGeom prst="line">
                                                    <a:avLst/>
                                                </a:prstGeom>
                                                <a:ln>
                                                    <a:solidFill>
                                                        <a:srgbClr val="F6A10A"/>
                                                    </a:solidFill>
                                                </a:ln>
                                            </wp:spPr>
                                            <wp:style>
                                                <a:lnRef idx="2">
                                                    <a:schemeClr val="accent6"/>
                                                </a:lnRef>
                                                <a:fillRef idx="0">
                                                    <a:schemeClr val="accent6"/>
                                                </a:fillRef>
                                                <a:effectRef idx="1">
                                                    <a:schemeClr val="accent6"/>
                                                </a:effectRef>
                                                <a:fontRef idx="minor">
                                                    <a:schemeClr val="tx1"/>
                                                </a:fontRef>
                                            </wp:style>
                                            <wp:bodyPr/>
                                        </wp:wsp>
                                    </a:graphicData>
                                </a:graphic>
                                <wp14:sizeRelH relativeFrom="margin">
                                    <wp14:pctWidth>0%</wp14:pctWidth>
                                </wp14:sizeRelH>
                            </wp:anchor>
                        </w:drawing>
                    </w:r>
                    <w:r w:rsidR="002251BB" w:rsidRPr="00AB1904">
                        <w:rPr>
                            <w:u w:val="none"/>
                        </w:rPr>
                        <w:t>
                            <xsl:call-template name="translate">
                                <xsl:with-param name="text" select="'Kerncompetenties / skills'"/>
                            </xsl:call-template>
                        </w:t>
                    </w:r>
                    <w:r w:rsidR="002251BB" w:rsidRPr="001958BA">
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251687936" behindDoc="0" locked="0" layoutInCell="1" allowOverlap="1"
                                       wp14:anchorId="35229AC4" wp14:editId="1074F567">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>4514215</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>475055</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="2237105" cy="4124525"/>
                                <wp:effectExtent l="0" t="0" r="0" b="0"/>
                                <wp:wrapNone/>
                                <wp:docPr id="1911849332" name="Text Box 13"/>
                                <wp:cNvGraphicFramePr/>
                                <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                    <a:graphicData uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                        <wp:wsp>
                                            <wp:cNvSpPr txBox="1"/>
                                            <wp:spPr>
                                                <a:xfrm>
                                                    <a:off x="0" y="0"/>
                                                    <a:ext cx="2237105" cy="4124525"/>
                                                </a:xfrm>
                                                <a:prstGeom prst="rect">
                                                    <a:avLst/>
                                                </a:prstGeom>
                                                <a:noFill/>
                                                <a:ln w="6350">
                                                    <a:noFill/>
                                                </a:ln>
                                            </wp:spPr>
                                            <wp:txbx>
                                                <wne:txbxContent>
                                                    <!-- PROGRAMMING -->
                                                    <xsl:call-template name="skill-section">
                                                        <xsl:with-param name="category">PROGRAMMING</xsl:with-param>
                                                    </xsl:call-template>
                                                    <!-- METHODS -->
                                                    <xsl:call-template name="skill-section">
                                                        <xsl:with-param name="category">METHODS</xsl:with-param>
                                                    </xsl:call-template>
                                                    <!-- OS_NETWORKS -->
                                                    <xsl:call-template name="skill-section">
                                                        <xsl:with-param name="category">OS_NETWORKS</xsl:with-param>
                                                    </xsl:call-template>
                                                </wne:txbxContent>
                                            </wp:txbx>
                                            <wp:bodyPr rot="0" spcFirstLastPara="0" vertOverflow="overflow"
                                                       horzOverflow="overflow" vert="horz" wrap="square" lIns="91440"
                                                       tIns="45720" rIns="91440" bIns="45720" numCol="1" spcCol="0" rtlCol="0"
                                                       fromWordArt="0" anchor="t" anchorCtr="0" forceAA="0" compatLnSpc="1">
                                                <a:prstTxWarp prst="textNoShape">
                                                    <a:avLst/>
                                                </a:prstTxWarp>
                                                <a:spAutoFit/>
                                            </wp:bodyPr>
                                        </wp:wsp>
                                    </a:graphicData>
                                </a:graphic>
                                <wp14:sizeRelH relativeFrom="margin">
                                    <wp14:pctWidth>0%</wp14:pctWidth>
                                </wp14:sizeRelH>
                                <wp14:sizeRelV relativeFrom="margin">
                                    <wp14:pctHeight>0%</wp14:pctHeight>
                                </wp14:sizeRelV>
                            </wp:anchor>
                        </w:drawing>
                    </w:r>
                    <w:r w:rsidR="00D51FD7" w:rsidRPr="00AB1904">
                        <w:rPr>
                            <w:noProof/>
                            <w:u w:val="none"/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251683840" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1" wp14:anchorId="65A007C0" wp14:editId="5A8EF887">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>-86116</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>471414</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="2237105" cy="5301762"/>
                                <wp:effectExtent l="0" t="0" r="0" b="0"/>
                                <wp:wrapNone/>
                                <wp:docPr id="2034291644" name="Text Box 13"/>
                                <wp:cNvGraphicFramePr/>
                                <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                    <a:graphicData
                                            uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                        <wp:wsp>
                                            <wp:cNvSpPr txBox="1"/>
                                            <wp:spPr>
                                                <a:xfrm>
                                                    <a:off x="0" y="0"/>
                                                    <a:ext cx="2237105" cy="5301762"/>
                                                </a:xfrm>
                                                <a:prstGeom prst="rect">
                                                    <a:avLst/>
                                                </a:prstGeom>
                                                <a:noFill/>
                                                <a:ln w="6350">
                                                    <a:noFill/>
                                                </a:ln>
                                            </wp:spPr>
                                            <wp:txbx>
                                                <wne:txbxContent>
                                                    <!-- BRANCHES -->
                                                    <xsl:call-template name="skill-section">
                                                        <xsl:with-param name="category">BRANCHES</xsl:with-param>
                                                    </xsl:call-template>
                                                    <!-- EXPERTISE -->
                                                    <xsl:call-template name="skill-section">
                                                        <xsl:with-param name="category">EXPERTISE</xsl:with-param>
                                                    </xsl:call-template>
                                                    <!-- DATABASES -->
                                                    <xsl:call-template name="skill-section">
                                                        <xsl:with-param name="category">DATABASES</xsl:with-param>
                                                    </xsl:call-template>
                                                    <!-- LANGUAGES -->
                                                    <xsl:call-template name="skill-section">
                                                        <xsl:with-param name="category">LANGUAGES</xsl:with-param>
                                                    </xsl:call-template>
                                                </wne:txbxContent>
                                            </wp:txbx>
                                            <wp:bodyPr rot="0" spcFirstLastPara="0" vertOverflow="overflow"
                                                       horzOverflow="overflow" vert="horz" wrap="square" lIns="91440"
                                                       tIns="45720" rIns="91440" bIns="45720" numCol="1" spcCol="0"
                                                       rtlCol="0" fromWordArt="0" anchor="t" anchorCtr="0" forceAA="0"
                                                       compatLnSpc="1">
                                                <a:prstTxWarp prst="textNoShape">
                                                    <a:avLst/>
                                                </a:prstTxWarp>
                                                <a:spAutoFit/>
                                            </wp:bodyPr>
                                        </wp:wsp>
                                    </a:graphicData>
                                </a:graphic>
                                <wp14:sizeRelH relativeFrom="margin">
                                    <wp14:pctWidth>0%</wp14:pctWidth>
                                </wp14:sizeRelH>
                                <wp14:sizeRelV relativeFrom="margin">
                                    <wp14:pctHeight>0%</wp14:pctHeight>
                                </wp14:sizeRelV>
                            </wp:anchor>
                        </w:drawing>
                    </w:r>
                    <w:r w:rsidR="00D51FD7" w:rsidRPr="00AB1904">
                        <w:rPr>
                            <w:noProof/>
                            <w:u w:val="none"/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251688960" behindDoc="0" locked="0" layoutInCell="1" allowOverlap="1"
                                       wp14:anchorId="7FC684E5" wp14:editId="0FFFE8B0">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>1812339</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>5939790</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="6791520" cy="457200"/>
                                <wp:effectExtent l="0" t="0" r="4445" b="0"/>
                                <wp:wrapNone/>
                                <wp:docPr id="754824561" name="Text Box 16"/>
                                <wp:cNvGraphicFramePr/>
                                <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                    <a:graphicData uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                        <wp:wsp>
                                            <wp:cNvSpPr txBox="1"/>
                                            <wp:spPr>
                                                <a:xfrm>
                                                    <a:off x="0" y="0"/>
                                                    <a:ext cx="6791520" cy="457200"/>
                                                </a:xfrm>
                                                <a:prstGeom prst="rect">
                                                    <a:avLst/>
                                                </a:prstGeom>
                                                <a:solidFill>
                                                    <a:schemeClr val="bg1">
                                                        <a:lumMod val="95%"/>
                                                    </a:schemeClr>
                                                </a:solidFill>
                                                <a:ln w="6350">
                                                    <a:noFill/>
                                                </a:ln>
                                            </wp:spPr>
                                            <wp:txbx>
                                                <wne:txbxContent>
                                                    <w:p w14:paraId="69660367" w14:textId="2926BB4C" w:rsidR="00D51FD7"
                                                         w:rsidRPr="00D51FD7" w:rsidRDefault="00D51FD7" w:rsidP="00D51FD7">
                                                        <w:pPr>
                                                            <w:tabs>
                                                                <w:tab w:val="start" w:pos="70.90pt"/>
                                                                <w:tab w:val="start" w:pos="163.05pt"/>
                                                                <w:tab w:val="start" w:pos="198.45pt"/>
                                                            </w:tabs>
                                                            <w:spacing w:after="0pt"/>
                                                            <w:jc w:val="center"/>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="00DF7C37">
                                                            <w:rPr>
                                                                <w:rStyle w:val="Valori-niveau"/>
                                                                <w:color w:val="F6A10A"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t xml:space="preserve"> </w:t>
                                                        </w:r>
                                                        <w:r w:rsidRPr="00D51FD7">
                                                            <w:rPr>
                                                                <w:rStyle w:val="Valori-niveau"/>
                                                                <w:rFonts w:asciiTheme="minorHAnsi"
                                                                          w:hAnsiTheme="minorHAnsi"/>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t>
                                                                <xsl:call-template name="translate">
                                                                    <xsl:with-param name="text" select="'basis'"/>
                                                                </xsl:call-template>
                                                            </w:t>
                                                            <w:tab/>
                                                        </w:r>
                                                        <w:r w:rsidRPr="00DF7C37">
                                                            <w:rPr>
                                                                <w:rStyle w:val="Valori-niveau"/>
                                                                <w:color w:val="F6A10A"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t xml:space="preserve"> </w:t>
                                                        </w:r>
                                                        <w:r w:rsidRPr="00D51FD7">
                                                            <w:rPr>
                                                                <w:rStyle w:val="Valori-niveau"/>
                                                                <w:rFonts w:asciiTheme="minorHAnsi"
                                                                          w:hAnsiTheme="minorHAnsi"/>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t>
                                                                <xsl:call-template name="translate">
                                                                    <xsl:with-param name="text" select="'gevorderd'"/>
                                                                </xsl:call-template>
                                                            </w:t>
                                                            <w:tab/>
                                                        </w:r>
                                                        <w:r w:rsidRPr="00DF7C37">
                                                            <w:rPr>
                                                                <w:rStyle w:val="Valori-niveau"/>
                                                                <w:color w:val="F6A10A"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t xml:space="preserve"> </w:t>
                                                        </w:r>
                                                        <w:r w:rsidRPr="00D51FD7">
                                                            <w:rPr>
                                                                <w:rStyle w:val="Valori-niveau"/>
                                                                <w:rFonts w:asciiTheme="minorHAnsi"
                                                                          w:hAnsiTheme="minorHAnsi"/>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t>
                                                                <xsl:call-template name="translate">
                                                                    <xsl:with-param name="text" select="'ervaren'"/>
                                                                </xsl:call-template>
                                                            </w:t>
                                                        </w:r>
                                                    </w:p>
                                                </wne:txbxContent>
                                            </wp:txbx>
                                            <wp:bodyPr rot="0" spcFirstLastPara="0" vertOverflow="overflow"
                                                       horzOverflow="overflow" vert="horz" wrap="none" lIns="91440"
                                                       tIns="108000" rIns="91440" bIns="108000" numCol="1" spcCol="0"
                                                       rtlCol="0"
                                                       fromWordArt="0" anchor="ctr" anchorCtr="0" forceAA="0"
                                                       compatLnSpc="1">
                                                <a:prstTxWarp prst="textNoShape">
                                                    <a:avLst/>
                                                </a:prstTxWarp>
                                                <a:spAutoFit/>
                                            </wp:bodyPr>
                                        </wp:wsp>
                                    </a:graphicData>
                                </a:graphic>
                                <wp14:sizeRelV relativeFrom="margin">
                                    <wp14:pctHeight>0%</wp14:pctHeight>
                                </wp14:sizeRelV>
                            </wp:anchor>
                        </w:drawing>
                    </w:r>
                    <w:r w:rsidR="002251BB" w:rsidRPr="001958BA">
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251685888" behindDoc="0" locked="0" layoutInCell="1" allowOverlap="1"
                                       wp14:anchorId="215EC998" wp14:editId="39E139D8">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>2219250</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>481031</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="2237105" cy="4124525"/>
                                <wp:effectExtent l="0" t="0" r="0" b="0"/>
                                <wp:wrapNone/>
                                <wp:docPr id="2095297071" name="Text Box 13"/>
                                <wp:cNvGraphicFramePr/>
                                <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                    <a:graphicData uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                        <wp:wsp>
                                            <wp:cNvSpPr txBox="1"/>
                                            <wp:spPr>
                                                <a:xfrm>
                                                    <a:off x="0" y="0"/>
                                                    <a:ext cx="2237105" cy="4124525"/>
                                                </a:xfrm>
                                                <a:prstGeom prst="rect">
                                                    <a:avLst/>
                                                </a:prstGeom>
                                                <a:noFill/>
                                                <a:ln w="6350">
                                                    <a:noFill/>
                                                </a:ln>
                                            </wp:spPr>
                                            <wp:txbx>
                                                <wne:txbxContent>
                                                    <!-- APPLICATIONS -->
                                                    <xsl:call-template name="skill-section">
                                                        <xsl:with-param name="category">APPLICATIONS</xsl:with-param>
                                                    </xsl:call-template>
                                                    <!-- TOOLS -->
                                                    <xsl:call-template name="skill-section">
                                                        <xsl:with-param name="category">TOOLS</xsl:with-param>
                                                    </xsl:call-template>
                                                </wne:txbxContent>
                                            </wp:txbx>
                                            <wp:bodyPr rot="0" spcFirstLastPara="0" vertOverflow="overflow"
                                                       horzOverflow="overflow" vert="horz" wrap="square" lIns="91440"
                                                       tIns="45720" rIns="91440" bIns="45720" numCol="1" spcCol="0" rtlCol="0"
                                                       fromWordArt="0" anchor="t" anchorCtr="0" forceAA="0" compatLnSpc="1">
                                                <a:prstTxWarp prst="textNoShape">
                                                    <a:avLst/>
                                                </a:prstTxWarp>
                                                <a:spAutoFit/>
                                            </wp:bodyPr>
                                        </wp:wsp>
                                    </a:graphicData>
                                </a:graphic>
                                <wp14:sizeRelH relativeFrom="margin">
                                    <wp14:pctWidth>0%</wp14:pctWidth>
                                </wp14:sizeRelH>
                                <wp14:sizeRelV relativeFrom="margin">
                                    <wp14:pctHeight>0%</wp14:pctHeight>
                                </wp14:sizeRelV>
                            </wp:anchor>
                        </w:drawing>
                    </w:r>
                    <w:r w:rsidR="00462426" w:rsidRPr="00AB1904">
                        <w:rPr>
                            <w:u w:val="none"/>
                        </w:rPr>
                        <w:br w:type="page"/>
                    </w:r>
                </w:p>
                <!--

                EDUCATION AND TRAINING

                -->
                <w:p w14:paraId="3B70A471" w14:textId="77777777" w:rsidR="00CC7FCE" w:rsidRDefault="00CC7FCE"
                     w:rsidP="00604B30">
                    <w:pPr>
                        <w:pStyle w:val="BasicParagraph"/>
                        <w:ind w:end="2.35pt"/>
                        <w:rPr>
                            <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans" w:cs="Plus Jakarta Sans"/>
                            <w:b/>
                            <w:bCs/>
                            <w:color w:val="212B46"/>
                            <w:sz w:val="26"/>
                            <w:szCs w:val="26"/>
                            <w:u w:val="thick" w:color="55DD94"/>
                            <w:lang w:val="en-GB"/>
                        </w:rPr>
                        <w:sectPr w:rsidR="00CC7FCE" w:rsidSect="00F87D02">
                            <w:type w:val="continuous"/>
                            <w:pgSz w:w="595.30pt" w:h="841.90pt"/>
                            <w:pgMar w:top="72pt" w:right="26.95pt" w:bottom="72pt" w:left="36.55pt" w:header="35.45pt"
                                     w:footer="2.85pt" w:gutter="0pt"/>
                            <w:cols w:space="17.45pt"/>
                            <w:docGrid w:linePitch="360"/>
                        </w:sectPr>
                    </w:pPr>
                </w:p>
                <w:p w14:paraId="3BD8ED21" w14:textId="1C890235" w:rsidR="00604B30" w:rsidRPr="00AB1904"
                     w:rsidRDefault="00604B30" w:rsidP="00160C07">
                    <w:pPr>
                        <w:pStyle w:val="Titel1"/>
                        <w:rPr>
                            <w:u w:val="none"/>
                        </w:rPr>
                    </w:pPr>
                    <w:r w:rsidRPr="00AB1904">
                        <w:rPr>
                            <w:u w:val="none"/>
                        </w:rPr>
                        <w:lastRenderedPageBreak/>
                        <w:t>Opleidingen</w:t>
                    </w:r>
                    <w:r w:rsidRPr="00AB1904">
                        <w:rPr>
                            <w:u w:val="none"/>
                        </w:rPr>
                        <w:t xml:space="preserve"> &amp;</w:t>
                    </w:r>
                    <w:r w:rsidRPr="00AB1904">
                        <w:rPr>
                            <w:u w:val="none"/>
                        </w:rPr>
                        <w:t>trainingen</w:t>
                    </w:r>
                </w:p>
                <w:tbl>
                    <w:tblPr>
                        <w:tblStyle w:val="Tabelraster"/>
                        <w:tblpPr w:leftFromText="180" w:rightFromText="180" w:vertAnchor="page" w:horzAnchor="margin"
                                  w:tblpY="2646"/>
                        <w:tblW w:w="526.15pt" w:type="dxa"/>
                        <w:tblBorders>
                            <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                            <w:start w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                            <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                            <w:end w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                            <w:insideH w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                            <w:insideV w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                        </w:tblBorders>
                        <w:tblCellMar>
                            <w:top w:w="7.10pt" w:type="dxa"/>
                            <w:bottom w:w="7.10pt" w:type="dxa"/>
                        </w:tblCellMar>
                        <w:tblLook w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0"
                                   w:noVBand="1"/>
                    </w:tblPr>
                    <w:tblGrid>
                        <w:gridCol w:w="4045"/>
                        <w:gridCol w:w="3126"/>
                        <w:gridCol w:w="1676"/>
                        <w:gridCol w:w="1676"/>
                    </w:tblGrid>
                    <w:tr w:rsidR="00AB1904" w14:paraId="105DB0F7" w14:textId="7F6D085C" w:rsidTr="00DF7C37">
                        <w:trPr>
                            <w:trHeight w:val="14"/>
                        </w:trPr>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="202.25pt" w:type="dxa"/>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="6E5835BD" w14:textId="77777777" w:rsidR="00AB1904" w:rsidRPr="00D51FD7"
                                 w:rsidRDefault="00AB1904" w:rsidP="00AB1904">
                                <w:pPr>
                                    <w:pStyle w:val="Pa0"/>
                                    <w:rPr>
                                        <w:rStyle w:val="A1"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r w:rsidRPr="00D51FD7">
                                    <w:rPr>
                                        <w:rStyle w:val="A1"/>
                                    </w:rPr>
                                    <w:t>Opleiding</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="156.30pt" w:type="dxa"/>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="49127A03" w14:textId="77777777" w:rsidR="00AB1904" w:rsidRPr="00D51FD7"
                                 w:rsidRDefault="00AB1904" w:rsidP="00AB1904">
                                <w:pPr>
                                    <w:pStyle w:val="Pa0"/>
                                    <w:rPr>
                                        <w:rStyle w:val="A1"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r w:rsidRPr="00D51FD7">
                                    <w:rPr>
                                        <w:rStyle w:val="A1"/>
                                    </w:rPr>
                                    <w:t>Onderwijsinstelling</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="83.80pt" w:type="dxa"/>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="64DFA393" w14:textId="77777777" w:rsidR="00AB1904" w:rsidRPr="00D51FD7"
                                 w:rsidRDefault="00AB1904" w:rsidP="00AB1904">
                                <w:pPr>
                                    <w:rPr>
                                        <w:rStyle w:val="A1"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r w:rsidRPr="00D51FD7">
                                    <w:rPr>
                                        <w:rStyle w:val="A1"/>
                                    </w:rPr>
                                    <w:t>Periode</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="83.80pt" w:type="dxa"/>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="14E6B479" w14:textId="23871179" w:rsidR="00AB1904" w:rsidRPr="00D51FD7"
                                 w:rsidRDefault="00AB1904" w:rsidP="00AB1904">
                                <w:pPr>
                                    <w:rPr>
                                        <w:rStyle w:val="A1"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r>
                                    <w:rPr>
                                        <w:rStyle w:val="A1"/>
                                    </w:rPr>
                                    <w:t>Certificaat</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                    </w:tr>
                    <w:tr w:rsidR="00AB1904" w14:paraId="64B68484" w14:textId="71A653F4" w:rsidTr="00DF7C37">
                        <w:trPr>
                            <w:trHeight w:val="14"/>
                        </w:trPr>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="202.25pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="338DD9C1" w14:textId="7DCE8498" w:rsidR="00AB1904" w:rsidRPr="00CA43CD"
                                 w:rsidRDefault="00AB1904" w:rsidP="00AB1904">
                                <w:pPr>
                                    <w:pStyle w:val="BasicParagraph"/>
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r w:rsidRPr="00CA43CD">
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                    <w:t xml:space="preserve">Master</w:t>
                                </w:r>
                                <w:r w:rsidRPr="00CA43CD">
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                    <w:t>Crossover</w:t>
                                </w:r>
                                <w:r w:rsidRPr="00CA43CD">
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                    <w:t>Creativity</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="156.30pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="42C3C744" w14:textId="76C1C097" w:rsidR="00AB1904" w:rsidRPr="00CA43CD"
                                 w:rsidRDefault="00AB1904" w:rsidP="00AB1904">
                                <w:pPr>
                                    <w:pStyle w:val="BasicParagraph"/>
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r w:rsidRPr="00CA43CD">
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                    <w:t>HKU Utrecht</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="83.80pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="6BC06187" w14:textId="77777777" w:rsidR="00AB1904" w:rsidRPr="00CA43CD"
                                 w:rsidRDefault="00AB1904" w:rsidP="00AB1904">
                                <w:pPr>
                                    <w:pStyle w:val="BasicParagraph"/>
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r w:rsidRPr="00CA43CD">
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                    <w:t>2023</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="83.80pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="14EFBB38" w14:textId="0FB61A57" w:rsidR="00AB1904" w:rsidRPr="00CA43CD"
                                 w:rsidRDefault="00AB1904" w:rsidP="00AB1904">
                                <w:pPr>
                                    <w:pStyle w:val="BasicParagraph"/>
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r w:rsidRPr="00CA43CD">
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="18"/>
                                    </w:rPr>
                                    <w:t>Ja/nee</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                    </w:tr>
                    <w:tr w:rsidR="0007072F" w14:paraId="7D692A80" w14:textId="4BEE0552" w:rsidTr="00DF7C37">
                        <w:trPr>
                            <w:trHeight w:val="454"/>
                        </w:trPr>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="202.25pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:top w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="49069FC2" w14:textId="77777777" w:rsidR="0007072F" w:rsidRPr="00CA43CD"
                                 w:rsidRDefault="0007072F" w:rsidP="0007072F">
                                <w:pPr>
                                    <w:pStyle w:val="Pa0"/>
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r w:rsidRPr="00CA43CD">
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                    <w:t>Bachelor of Art &amp; Technology</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="156.30pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:top w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="1E2BAD38" w14:textId="77777777" w:rsidR="0007072F" w:rsidRPr="00CA43CD"
                                 w:rsidRDefault="0007072F" w:rsidP="0007072F">
                                <w:pPr>
                                    <w:pStyle w:val="Pa0"/>
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r w:rsidRPr="00CA43CD">
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                    <w:t xml:space="preserve">Saxion</w:t>
                                </w:r>
                                <w:r w:rsidRPr="00CA43CD">
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                    <w:t>Hogescholen</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="83.80pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:top w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="0CA10BB9" w14:textId="77777777" w:rsidR="0007072F" w:rsidRPr="00CA43CD"
                                 w:rsidRDefault="0007072F" w:rsidP="0007072F">
                                <w:pPr>
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r w:rsidRPr="00CA43CD">
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                    <w:t>2005 - 2009</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="83.80pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:top w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="054EFA8D" w14:textId="3E4F3F86" w:rsidR="0007072F" w:rsidRPr="00CA43CD"
                                 w:rsidRDefault="0007072F" w:rsidP="0007072F">
                                <w:pPr>
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r w:rsidRPr="00CA43CD">
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="18"/>
                                    </w:rPr>
                                    <w:t>Ja/nee</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                    </w:tr>
                    <w:tr w:rsidR="0007072F" w14:paraId="5EBC8C3A" w14:textId="41EEABF2" w:rsidTr="00DF7C37">
                        <w:trPr>
                            <w:trHeight w:val="454"/>
                        </w:trPr>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="202.25pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:bottom w:val="nil"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="4690787F" w14:textId="77777777" w:rsidR="0007072F" w:rsidRPr="00604B30"
                                 w:rsidRDefault="0007072F" w:rsidP="0007072F">
                                <w:pPr>
                                    <w:pStyle w:val="Pa0"/>
                                    <w:rPr>
                                        <w:rStyle w:val="A3"/>
                                    </w:rPr>
                                </w:pPr>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="156.30pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:bottom w:val="nil"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="2F6B6DB0" w14:textId="77777777" w:rsidR="0007072F" w:rsidRPr="00604B30"
                                 w:rsidRDefault="0007072F" w:rsidP="0007072F">
                                <w:pPr>
                                    <w:pStyle w:val="Pa0"/>
                                    <w:rPr>
                                        <w:rStyle w:val="A3"/>
                                    </w:rPr>
                                </w:pPr>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="83.80pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:bottom w:val="nil"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="475BD2B4" w14:textId="77777777" w:rsidR="0007072F" w:rsidRPr="00604B30"
                                 w:rsidRDefault="0007072F" w:rsidP="0007072F">
                                <w:pPr>
                                    <w:rPr>
                                        <w:rStyle w:val="A3"/>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                    </w:rPr>
                                </w:pPr>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="83.80pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:bottom w:val="nil"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="7C4729A5" w14:textId="511C50E1" w:rsidR="0007072F" w:rsidRPr="00604B30"
                                 w:rsidRDefault="0007072F" w:rsidP="0007072F">
                                <w:pPr>
                                    <w:rPr>
                                        <w:rStyle w:val="A3"/>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                    </w:rPr>
                                </w:pPr>
                            </w:p>
                        </w:tc>
                    </w:tr>
                    <w:tr w:rsidR="0007072F" w:rsidRPr="00D51FD7" w14:paraId="0566AC1C" w14:textId="51158AC3"
                          w:rsidTr="0035009D">
                        <w:trPr>
                            <w:trHeight w:val="14"/>
                        </w:trPr>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="202.25pt" w:type="dxa"/>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="025C814A" w14:textId="77777777" w:rsidR="0007072F" w:rsidRPr="00D51FD7"
                                 w:rsidRDefault="0007072F" w:rsidP="0007072F">
                                <w:pPr>
                                    <w:pStyle w:val="Pa0"/>
                                    <w:rPr>
                                        <w:rStyle w:val="A1"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r w:rsidRPr="00D51FD7">
                                    <w:rPr>
                                        <w:rStyle w:val="A1"/>
                                    </w:rPr>
                                    <w:t>Trainingen</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="156.30pt" w:type="dxa"/>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="31D89CCB" w14:textId="35FC9C76" w:rsidR="0007072F" w:rsidRPr="00D51FD7"
                                 w:rsidRDefault="0007072F" w:rsidP="0007072F">
                                <w:pPr>
                                    <w:pStyle w:val="Pa0"/>
                                    <w:rPr>
                                        <w:rStyle w:val="A1"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r>
                                    <w:rPr>
                                        <w:rStyle w:val="A1"/>
                                    </w:rPr>
                                    <w:t>Opleidingsinstituut</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="83.80pt" w:type="dxa"/>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="5E03F854" w14:textId="77777777" w:rsidR="0007072F" w:rsidRPr="00D51FD7"
                                 w:rsidRDefault="0007072F" w:rsidP="0007072F">
                                <w:pPr>
                                    <w:rPr>
                                        <w:rStyle w:val="A1"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r w:rsidRPr="00D51FD7">
                                    <w:rPr>
                                        <w:rStyle w:val="A1"/>
                                    </w:rPr>
                                    <w:t>Periode</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="83.80pt" w:type="dxa"/>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="4279435D" w14:textId="54E44940" w:rsidR="0007072F" w:rsidRPr="00D51FD7"
                                 w:rsidRDefault="0007072F" w:rsidP="0007072F">
                                <w:pPr>
                                    <w:rPr>
                                        <w:rStyle w:val="A1"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r>
                                    <w:rPr>
                                        <w:rStyle w:val="A1"/>
                                    </w:rPr>
                                    <w:t>Certificaat</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                    </w:tr>
                    <w:tr w:rsidR="0007072F" w14:paraId="381BD1A4" w14:textId="411A2F89" w:rsidTr="00DF7C37">
                        <w:trPr>
                            <w:trHeight w:val="14"/>
                        </w:trPr>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="202.25pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="4E8FC99E" w14:textId="6D870EF7" w:rsidR="0007072F" w:rsidRPr="00CA43CD"
                                 w:rsidRDefault="0007072F" w:rsidP="0007072F">
                                <w:pPr>
                                    <w:pStyle w:val="Pa0"/>
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="18"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r w:rsidRPr="00CA43CD">
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="18"/>
                                    </w:rPr>
                                    <w:t>Master Crossover Creativity</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="156.30pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="315B4A13" w14:textId="71560C11" w:rsidR="0007072F" w:rsidRPr="00CA43CD"
                                 w:rsidRDefault="0007072F" w:rsidP="0007072F">
                                <w:pPr>
                                    <w:pStyle w:val="Pa0"/>
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="18"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r w:rsidRPr="00CA43CD">
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="18"/>
                                    </w:rPr>
                                    <w:t>HKU Utrecht</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="83.80pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="16358336" w14:textId="77777777" w:rsidR="0007072F" w:rsidRPr="00CA43CD"
                                 w:rsidRDefault="0007072F" w:rsidP="0007072F">
                                <w:pPr>
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="18"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r w:rsidRPr="00CA43CD">
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="18"/>
                                    </w:rPr>
                                    <w:t>2023</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="83.80pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="249E7210" w14:textId="54DB08F8" w:rsidR="0007072F" w:rsidRPr="00CA43CD"
                                 w:rsidRDefault="0007072F" w:rsidP="0007072F">
                                <w:pPr>
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="18"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r w:rsidRPr="00CA43CD">
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="18"/>
                                    </w:rPr>
                                    <w:t>Ja/nee</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                    </w:tr>
                    <w:tr w:rsidR="0007072F" w14:paraId="65E7F30F" w14:textId="6D8A9ABD" w:rsidTr="00DF7C37">
                        <w:trPr>
                            <w:trHeight w:val="454"/>
                        </w:trPr>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="202.25pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:top w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                    <w:bottom w:val="nil"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="1E4643DE" w14:textId="77777777" w:rsidR="0007072F" w:rsidRPr="00CA43CD"
                                 w:rsidRDefault="0007072F" w:rsidP="0007072F">
                                <w:pPr>
                                    <w:pStyle w:val="Pa0"/>
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="18"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r w:rsidRPr="00CA43CD">
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="18"/>
                                    </w:rPr>
                                    <w:t>Bachelor of Art &amp; Technology</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="156.30pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:top w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                    <w:bottom w:val="nil"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="08A65379" w14:textId="77777777" w:rsidR="0007072F" w:rsidRPr="00CA43CD"
                                 w:rsidRDefault="0007072F" w:rsidP="0007072F">
                                <w:pPr>
                                    <w:pStyle w:val="Pa0"/>
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="18"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r w:rsidRPr="00CA43CD">
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="18"/>
                                    </w:rPr>
                                    <w:t xml:space="preserve">Saxion</w:t>
                                </w:r>
                                <w:r w:rsidRPr="00CA43CD">
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="18"/>
                                    </w:rPr>
                                    <w:t>Hogescholen</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="83.80pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:top w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                    <w:bottom w:val="nil"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="6FDD08CB" w14:textId="77777777" w:rsidR="0007072F" w:rsidRPr="00CA43CD"
                                 w:rsidRDefault="0007072F" w:rsidP="0007072F">
                                <w:pPr>
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="18"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r w:rsidRPr="00CA43CD">
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="18"/>
                                    </w:rPr>
                                    <w:t>2005 - 2009</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="83.80pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:top w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                    <w:bottom w:val="nil"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="795F3713" w14:textId="065CF29D" w:rsidR="0007072F" w:rsidRPr="00CA43CD"
                                 w:rsidRDefault="0007072F" w:rsidP="0007072F">
                                <w:pPr>
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="18"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r w:rsidRPr="00CA43CD">
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="18"/>
                                    </w:rPr>
                                    <w:t>Ja/nee</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                    </w:tr>
                </w:tbl>
                <w:p w14:paraId="36BC7C31" w14:textId="4F266972" w:rsidR="005815D4" w:rsidRDefault="00AB1904"
                     w:rsidP="002251BB">
                    <w:r>
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251698176" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1" wp14:anchorId="52A4FE48" wp14:editId="251F98E3">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>-635</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>24598</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="1990846" cy="0"/>
                                <wp:effectExtent l="0" t="12700" r="15875" b="12700"/>
                                <wp:wrapNone/>
                                <wp:docPr id="2119637578" name="Straight Connector 15"/>
                                <wp:cNvGraphicFramePr/>
                                <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                    <a:graphicData
                                            uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                        <wp:wsp>
                                            <wp:cNvCnPr/>
                                            <wp:spPr>
                                                <a:xfrm>
                                                    <a:off x="0" y="0"/>
                                                    <a:ext cx="1990846" cy="0"/>
                                                </a:xfrm>
                                                <a:prstGeom prst="line">
                                                    <a:avLst/>
                                                </a:prstGeom>
                                                <a:ln>
                                                    <a:solidFill>
                                                        <a:srgbClr val="F6A10A"/>
                                                    </a:solidFill>
                                                </a:ln>
                                            </wp:spPr>
                                            <wp:style>
                                                <a:lnRef idx="2">
                                                    <a:schemeClr val="accent6"/>
                                                </a:lnRef>
                                                <a:fillRef idx="0">
                                                    <a:schemeClr val="accent6"/>
                                                </a:fillRef>
                                                <a:effectRef idx="1">
                                                    <a:schemeClr val="accent6"/>
                                                </a:effectRef>
                                                <a:fontRef idx="minor">
                                                    <a:schemeClr val="tx1"/>
                                                </a:fontRef>
                                            </wp:style>
                                            <wp:bodyPr/>
                                        </wp:wsp>
                                    </a:graphicData>
                                </a:graphic>
                                <wp14:sizeRelH relativeFrom="margin">
                                    <wp14:pctWidth>0%</wp14:pctWidth>
                                </wp14:sizeRelH>
                            </wp:anchor>
                        </w:drawing>
                    </w:r>
                </w:p>
                <w:p w14:paraId="0FC87C85" w14:textId="77777777" w:rsidR="00CC7FCE" w:rsidRDefault="00CC7FCE">
                    <w:pPr>
                        <w:sectPr w:rsidR="00CC7FCE" w:rsidSect="00F87D02">
                            <w:type w:val="continuous"/>
                            <w:pgSz w:w="595.30pt" w:h="841.90pt"/>
                            <w:pgMar w:top="72pt" w:right="26.95pt" w:bottom="72pt" w:left="36.55pt" w:header="35.45pt"
                                     w:footer="2.85pt" w:gutter="0pt"/>
                            <w:cols w:space="17.45pt"/>
                            <w:docGrid w:linePitch="360"/>
                        </w:sectPr>
                    </w:pPr>
                </w:p>
                <w:p w14:paraId="708E2135" w14:textId="77777777" w:rsidR="005815D4" w:rsidRDefault="005815D4">
                    <w:r>
                        <w:br w:type="page"/>
                    </w:r>
                </w:p>
                <w:p w14:paraId="6B615F0F" w14:textId="77777777" w:rsidR="00CC7FCE" w:rsidRDefault="00CC7FCE"
                     w:rsidP="00160C07">
                    <w:pPr>
                        <w:pStyle w:val="Titel1"/>
                        <w:sectPr w:rsidR="00CC7FCE" w:rsidSect="00F87D02">
                            <w:type w:val="continuous"/>
                            <w:pgSz w:w="595.30pt" w:h="841.90pt"/>
                            <w:pgMar w:top="72pt" w:right="26.95pt" w:bottom="72pt" w:left="36.55pt" w:header="35.45pt"
                                     w:footer="2.85pt" w:gutter="0pt"/>
                            <w:cols w:space="17.45pt"/>
                            <w:docGrid w:linePitch="360"/>
                        </w:sectPr>
                    </w:pPr>
                </w:p>
                <w:p w14:paraId="6FAD22C1" w14:textId="05181ED8" w:rsidR="00CC7FCE" w:rsidRPr="00AB1904"
                     w:rsidRDefault="00B2333C" w:rsidP="00160C07">
                    <w:pPr>
                        <w:pStyle w:val="Titel1"/>
                        <w:rPr>
                            <w:u w:val="none"/>
                        </w:rPr>
                    </w:pPr>
                    <w:r w:rsidRPr="00AB1904">
                        <w:rPr>
                            <w:u w:val="none"/>
                        </w:rPr>
                        <w:lastRenderedPageBreak/>
                        <w:t>Werkervaring</w:t>
                    </w:r>
                </w:p>
                <w:p w14:paraId="21A5DF4E" w14:textId="0963F4CD" w:rsidR="00CA43CD" w:rsidRDefault="00AB1904"
                     w:rsidP="00160C07">
                    <w:pPr>
                        <w:pStyle w:val="Titel1"/>
                    </w:pPr>
                    <w:r>
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251700224" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1" wp14:anchorId="47712412" wp14:editId="04E1E64B">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>-1905</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>10025</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="1086447" cy="0"/>
                                <wp:effectExtent l="0" t="12700" r="19050" b="12700"/>
                                <wp:wrapNone/>
                                <wp:docPr id="1983513148" name="Straight Connector 15"/>
                                <wp:cNvGraphicFramePr/>
                                <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                    <a:graphicData
                                            uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                        <wp:wsp>
                                            <wp:cNvCnPr/>
                                            <wp:spPr>
                                                <a:xfrm>
                                                    <a:off x="0" y="0"/>
                                                    <a:ext cx="1086447" cy="0"/>
                                                </a:xfrm>
                                                <a:prstGeom prst="line">
                                                    <a:avLst/>
                                                </a:prstGeom>
                                                <a:ln>
                                                    <a:solidFill>
                                                        <a:srgbClr val="E03B3A"/>
                                                    </a:solidFill>
                                                </a:ln>
                                            </wp:spPr>
                                            <wp:style>
                                                <a:lnRef idx="2">
                                                    <a:schemeClr val="accent6"/>
                                                </a:lnRef>
                                                <a:fillRef idx="0">
                                                    <a:schemeClr val="accent6"/>
                                                </a:fillRef>
                                                <a:effectRef idx="1">
                                                    <a:schemeClr val="accent6"/>
                                                </a:effectRef>
                                                <a:fontRef idx="minor">
                                                    <a:schemeClr val="tx1"/>
                                                </a:fontRef>
                                            </wp:style>
                                            <wp:bodyPr/>
                                        </wp:wsp>
                                    </a:graphicData>
                                </a:graphic>
                                <wp14:sizeRelH relativeFrom="margin">
                                    <wp14:pctWidth>0%</wp14:pctWidth>
                                </wp14:sizeRelH>
                            </wp:anchor>
                        </w:drawing>
                    </w:r>
                </w:p>
                <w:p w14:paraId="6B031F37" w14:textId="07FFD1E2" w:rsidR="00B2333C" w:rsidRDefault="00CC7FCE"
                     w:rsidP="00160C07">
                    <w:pPr>
                        <w:pStyle w:val="Titel1"/>
                    </w:pPr>
                    <w:r>
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:inline distT="0" distB="0" distL="0" distR="0" wp14:anchorId="3F6C22CD"
                                       wp14:editId="0D488227">
                                <wp:extent cx="6667500" cy="3567430"/>
                                <wp:effectExtent l="0" t="0" r="0" b="0"/>
                                <wp:docPr id="1868590632" name="Text Box 9"/>
                                <wp:cNvGraphicFramePr/>
                                <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                    <a:graphicData
                                            uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                        <wp:wsp>
                                            <wp:cNvSpPr txBox="1"/>
                                            <wp:spPr>
                                                <a:xfrm>
                                                    <a:off x="0" y="0"/>
                                                    <a:ext cx="6667500" cy="3567430"/>
                                                </a:xfrm>
                                                <a:prstGeom prst="rect">
                                                    <a:avLst/>
                                                </a:prstGeom>
                                                <a:solidFill>
                                                    <a:schemeClr val="bg1">
                                                        <a:lumMod val="95%"/>
                                                    </a:schemeClr>
                                                </a:solidFill>
                                                <a:ln w="6350">
                                                    <a:noFill/>
                                                </a:ln>
                                            </wp:spPr>
                                            <wp:txbx>
                                                <wne:txbxContent>
                                                    <w:p w14:paraId="71D1695A" w14:textId="0B233B53" w:rsidR="00B2333C"
                                                         w:rsidRPr="00B635D4" w:rsidRDefault="00B2333C"
                                                         w:rsidP="00B2333C">
                                                        <w:pPr>
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:b/>
                                                                <w:bCs/>
                                                                <w:color w:val="212B46"/>
                                                            </w:rPr>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="00B635D4">
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:b/>
                                                                <w:bCs/>
                                                                <w:color w:val="212B46"/>
                                                            </w:rPr>
                                                            <w:t xml:space="preserve">2023</w:t>
                                                        </w:r>
                                                        <w:r w:rsidRPr="006F7BD7">
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:color w:val="F6A10A"/>
                                                            </w:rPr>
                                                            <w:t>—</w:t>
                                                        </w:r>
                                                        <w:r w:rsidRPr="006F7BD7">
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:b/>
                                                                <w:bCs/>
                                                                <w:color w:val="F6A10A"/>
                                                            </w:rPr>
                                                            <w:t xml:space="preserve"></w:t>
                                                        </w:r>
                                                        <w:r w:rsidRPr="00B635D4">
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:b/>
                                                                <w:bCs/>
                                                                <w:color w:val="212B46"/>
                                                            </w:rPr>
                                                            <w:t>2025</w:t>
                                                        </w:r>
                                                        <w:r w:rsidRPr="006F7BD7">
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:color w:val="F6A10A"/>
                                                            </w:rPr>
                                                            <w:t xml:space="preserve"> |</w:t>
                                                        </w:r>
                                                        <w:r w:rsidRPr="006F7BD7">
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:b/>
                                                                <w:bCs/>
                                                                <w:color w:val="F6A10A"/>
                                                            </w:rPr>
                                                            <w:t xml:space="preserve"></w:t>
                                                        </w:r>
                                                        <w:r w:rsidRPr="00B635D4">
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:b/>
                                                                <w:bCs/>
                                                                <w:color w:val="212B46"/>
                                                            </w:rPr>
                                                            <w:t>Gemeente Utrecht</w:t>
                                                        </w:r>
                                                    </w:p>
                                                    <w:p w14:paraId="1C2DEC96" w14:textId="21912888" w:rsidR="00B2333C"
                                                         w:rsidRPr="00B635D4" w:rsidRDefault="00B2333C"
                                                         w:rsidP="00B2333C">
                                                        <w:pPr>
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="00B635D4">
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t>Testcoördinator financiële systemen</w:t>
                                                        </w:r>
                                                    </w:p>
                                                    <w:p w14:paraId="4F4CEE96" w14:textId="4FCDD30D" w:rsidR="00B2333C"
                                                         w:rsidRPr="00B2333C" w:rsidRDefault="00B2333C"
                                                         w:rsidP="00B2333C">
                                                        <w:pPr>
                                                            <w:rPr>
                                                                <w:b/>
                                                                <w:bCs/>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="22"/>
                                                                <w:szCs w:val="22"/>
                                                            </w:rPr>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="00B2333C">
                                                            <w:rPr>
                                                                <w:b/>
                                                                <w:bCs/>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="22"/>
                                                                <w:szCs w:val="22"/>
                                                            </w:rPr>
                                                            <w:t>Situatie</w:t>
                                                        </w:r>
                                                    </w:p>
                                                    <w:p w14:paraId="784BB291" w14:textId="77777777" w:rsidR="00B2333C"
                                                         w:rsidRPr="00B635D4" w:rsidRDefault="00B2333C"
                                                         w:rsidP="00B2333C">
                                                        <w:pPr>
                                                            <w:rPr>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="00B635D4">
                                                            <w:rPr>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t>De gemeente wilde overstappen naar een nieuw financieel
                                                                systeem. Mijn opdracht was het aansturen van het
                                                                testtraject binnen het projectteam.
                                                            </w:t>
                                                        </w:r>
                                                    </w:p>
                                                    <w:p w14:paraId="6736B730" w14:textId="3D978164" w:rsidR="00B2333C"
                                                         w:rsidRPr="00B2333C" w:rsidRDefault="00B2333C"
                                                         w:rsidP="00B2333C">
                                                        <w:pPr>
                                                            <w:rPr>
                                                                <w:b/>
                                                                <w:bCs/>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="22"/>
                                                                <w:szCs w:val="22"/>
                                                            </w:rPr>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="00B2333C">
                                                            <w:rPr>
                                                                <w:b/>
                                                                <w:bCs/>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="22"/>
                                                                <w:szCs w:val="22"/>
                                                            </w:rPr>
                                                            <w:t>Taken</w:t>
                                                        </w:r>
                                                    </w:p>
                                                    <w:p w14:paraId="4DB0632C" w14:textId="542F4402" w:rsidR="00B2333C"
                                                         w:rsidRPr="00B635D4" w:rsidRDefault="00B2333C"
                                                         w:rsidP="00B2333C">
                                                        <w:pPr>
                                                            <w:numPr>
                                                                <w:ilvl w:val="0"/>
                                                                <w:numId w:val="7"/>
                                                            </w:numPr>
                                                            <w:spacing w:line="12pt" w:lineRule="auto"/>
                                                            <w:rPr>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="00B635D4">
                                                            <w:rPr>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t>Aansturen van key-users tijdens testdagen</w:t>
                                                        </w:r>
                                                    </w:p>
                                                    <w:p w14:paraId="02D964B5" w14:textId="6309B473" w:rsidR="00B2333C"
                                                         w:rsidRPr="00B635D4" w:rsidRDefault="00B2333C"
                                                         w:rsidP="00B2333C">
                                                        <w:pPr>
                                                            <w:numPr>
                                                                <w:ilvl w:val="0"/>
                                                                <w:numId w:val="7"/>
                                                            </w:numPr>
                                                            <w:spacing w:line="12pt" w:lineRule="auto"/>
                                                            <w:rPr>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="00B635D4">
                                                            <w:rPr>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t>Schrijven en bijwerken van testplannen</w:t>
                                                        </w:r>
                                                    </w:p>
                                                    <w:p w14:paraId="68F91F6F" w14:textId="065C9DD0" w:rsidR="00B2333C"
                                                         w:rsidRPr="00B635D4" w:rsidRDefault="00B2333C"
                                                         w:rsidP="00B2333C">
                                                        <w:pPr>
                                                            <w:numPr>
                                                                <w:ilvl w:val="0"/>
                                                                <w:numId w:val="7"/>
                                                            </w:numPr>
                                                            <w:spacing w:line="12pt" w:lineRule="auto"/>
                                                            <w:rPr>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="00B635D4">
                                                            <w:rPr>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t>Coördinatie met leverancier en technisch beheer</w:t>
                                                        </w:r>
                                                    </w:p>
                                                    <w:p w14:paraId="3837E18F" w14:textId="2A1ED59C" w:rsidR="00B2333C"
                                                         w:rsidRPr="00B635D4" w:rsidRDefault="00B2333C"
                                                         w:rsidP="00B2333C">
                                                        <w:pPr>
                                                            <w:numPr>
                                                                <w:ilvl w:val="0"/>
                                                                <w:numId w:val="7"/>
                                                            </w:numPr>
                                                            <w:spacing w:line="12pt" w:lineRule="auto"/>
                                                            <w:rPr>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="00B635D4">
                                                            <w:rPr>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t>Uitvoeren van koppelingstests</w:t>
                                                        </w:r>
                                                    </w:p>
                                                    <w:p w14:paraId="76E931EB" w14:textId="6471A0AC" w:rsidR="00B2333C"
                                                         w:rsidRPr="00B2333C" w:rsidRDefault="00B2333C"
                                                         w:rsidP="00B2333C">
                                                        <w:pPr>
                                                            <w:rPr>
                                                                <w:b/>
                                                                <w:bCs/>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="22"/>
                                                                <w:szCs w:val="22"/>
                                                            </w:rPr>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="00B2333C">
                                                            <w:rPr>
                                                                <w:b/>
                                                                <w:bCs/>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="22"/>
                                                                <w:szCs w:val="22"/>
                                                            </w:rPr>
                                                            <w:t>Resultaten</w:t>
                                                        </w:r>
                                                    </w:p>
                                                    <w:p w14:paraId="09E110C3" w14:textId="11568BA8" w:rsidR="00B2333C"
                                                         w:rsidRPr="00B635D4" w:rsidRDefault="00B2333C"
                                                         w:rsidP="00B2333C">
                                                        <w:pPr>
                                                            <w:numPr>
                                                                <w:ilvl w:val="0"/>
                                                                <w:numId w:val="11"/>
                                                            </w:numPr>
                                                            <w:spacing w:line="12pt" w:lineRule="auto"/>
                                                            <w:rPr>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="00B635D4">
                                                            <w:rPr>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t>Succesvolle migratie met minimale issues</w:t>
                                                        </w:r>
                                                    </w:p>
                                                    <w:p w14:paraId="1A4CBA5F" w14:textId="4038558B" w:rsidR="00B2333C"
                                                         w:rsidRPr="00B635D4" w:rsidRDefault="00B2333C"
                                                         w:rsidP="00B2333C">
                                                        <w:pPr>
                                                            <w:numPr>
                                                                <w:ilvl w:val="0"/>
                                                                <w:numId w:val="11"/>
                                                            </w:numPr>
                                                            <w:spacing w:line="12pt" w:lineRule="auto"/>
                                                            <w:rPr>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="00B635D4">
                                                            <w:rPr>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t>Tijdige oplevering van testrapportages voor de
                                                                go-live
                                                            </w:t>
                                                        </w:r>
                                                    </w:p>
                                                    <w:p w14:paraId="0C968477" w14:textId="4C368119" w:rsidR="00B2333C"
                                                         w:rsidRPr="00B635D4" w:rsidRDefault="00B2333C"
                                                         w:rsidP="00B2333C">
                                                        <w:pPr>
                                                            <w:numPr>
                                                                <w:ilvl w:val="0"/>
                                                                <w:numId w:val="11"/>
                                                            </w:numPr>
                                                            <w:spacing w:line="12pt" w:lineRule="auto"/>
                                                            <w:rPr>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="00B635D4">
                                                            <w:rPr>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t>Verbeterde samenwerking tussen domeinen</w:t>
                                                        </w:r>
                                                    </w:p>
                                                    <w:p w14:paraId="22A70B22" w14:textId="6254D1F5" w:rsidR="00B2333C"
                                                         w:rsidRPr="00B2333C" w:rsidRDefault="00B2333C"
                                                         w:rsidP="00B2333C">
                                                        <w:pPr>
                                                            <w:rPr>
                                                                <w:b/>
                                                                <w:bCs/>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="21"/>
                                                                <w:szCs w:val="21"/>
                                                            </w:rPr>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="00B2333C">
                                                            <w:rPr>
                                                                <w:b/>
                                                                <w:bCs/>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="21"/>
                                                                <w:szCs w:val="21"/>
                                                            </w:rPr>
                                                            <w:t>Technologie &amp; tools</w:t>
                                                        </w:r>
                                                    </w:p>
                                                    <w:p w14:paraId="09C3A2F3" w14:textId="2E4F78DF" w:rsidR="00B2333C"
                                                         w:rsidRPr="00B635D4" w:rsidRDefault="00B2333C"
                                                         w:rsidP="00B2333C">
                                                        <w:pPr>
                                                            <w:rPr>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                                <w:lang w:val="en-GB"/>
                                                            </w:rPr>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="00B635D4">
                                                            <w:rPr>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t>Key2Financiën, Citrix, Jira, SOAP UI, SQL</w:t>
                                                        </w:r>
                                                    </w:p>
                                                </wne:txbxContent>
                                            </wp:txbx>
                                            <wp:bodyPr rot="0" spcFirstLastPara="0" vertOverflow="overflow"
                                                       horzOverflow="overflow" vert="horz" wrap="square" lIns="90000"
                                                       tIns="90000" rIns="90000" bIns="90000" numCol="1" spcCol="0"
                                                       rtlCol="0" fromWordArt="0" anchor="ctr" anchorCtr="0" forceAA="0"
                                                       compatLnSpc="1">
                                                <a:prstTxWarp prst="textNoShape">
                                                    <a:avLst/>
                                                </a:prstTxWarp>
                                                <a:spAutoFit/>
                                            </wp:bodyPr>
                                        </wp:wsp>
                                    </a:graphicData>
                                </a:graphic>
                            </wp:inline>
                        </w:drawing>
                    </w:r>
                </w:p>
                <w:p w14:paraId="24FEE188" w14:textId="47590F99" w:rsidR="00CC7FCE" w:rsidRDefault="00CC7FCE"
                     w:rsidP="00160C07">
                    <w:pPr>
                        <w:pStyle w:val="Titel1"/>
                    </w:pPr>
                </w:p>
                <w:p w14:paraId="76CE181D" w14:textId="1864A07D" w:rsidR="00CC7FCE" w:rsidRPr="00AB1904"
                     w:rsidRDefault="00CC7FCE" w:rsidP="00160C07">
                    <w:pPr>
                        <w:pStyle w:val="Titel1"/>
                        <w:rPr>
                            <w:u w:val="none"/>
                        </w:rPr>
                    </w:pPr>
                    <w:r w:rsidRPr="00AB1904">
                        <w:rPr>
                            <w:u w:val="none"/>
                        </w:rPr>
                        <w:t>Overige werkervaring</w:t>
                    </w:r>
                </w:p>
                <w:tbl>
                    <w:tblPr>
                        <w:tblStyle w:val="Tabelraster"/>
                        <w:tblW w:w="526pt" w:type="dxa"/>
                        <w:tblBorders>
                            <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                            <w:start w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                            <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                            <w:end w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                            <w:insideH w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                            <w:insideV w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                        </w:tblBorders>
                        <w:tblCellMar>
                            <w:top w:w="7.10pt" w:type="dxa"/>
                            <w:bottom w:w="7.10pt" w:type="dxa"/>
                        </w:tblCellMar>
                        <w:tblLook w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="1"
                                   w:noVBand="1"/>
                    </w:tblPr>
                    <w:tblGrid>
                        <w:gridCol w:w="1360"/>
                        <w:gridCol w:w="2092"/>
                        <w:gridCol w:w="3534"/>
                        <w:gridCol w:w="3534"/>
                    </w:tblGrid>
                    <w:tr w:rsidR="00AB1904" w14:paraId="17C239C3" w14:textId="1D844498" w:rsidTr="00AB1904">
                        <w:trPr>
                            <w:trHeight w:val="13"/>
                        </w:trPr>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="68pt" w:type="dxa"/>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="4B7F5E6F" w14:textId="3EB8430A" w:rsidR="00AB1904" w:rsidRPr="00D51FD7"
                                 w:rsidRDefault="00AB1904" w:rsidP="00AB1904">
                                <w:pPr>
                                    <w:pStyle w:val="Pa0"/>
                                    <w:rPr>
                                        <w:rStyle w:val="A1"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r>
                                    <w:rPr>
                                        <w:noProof/>
                                    </w:rPr>
                                    <w:drawing>
                                        <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                                   relativeHeight="251702272" behindDoc="0" locked="0" layoutInCell="1"
                                                   allowOverlap="1" wp14:anchorId="12EE6707" wp14:editId="62DBCBA0">
                                            <wp:simplePos x="0" y="0"/>
                                            <wp:positionH relativeFrom="column">
                                                <wp:posOffset>-67945</wp:posOffset>
                                            </wp:positionH>
                                            <wp:positionV relativeFrom="paragraph">
                                                <wp:posOffset>-84455</wp:posOffset>
                                            </wp:positionV>
                                            <wp:extent cx="1732915" cy="0"/>
                                            <wp:effectExtent l="0" t="12700" r="19685" b="12700"/>
                                            <wp:wrapNone/>
                                            <wp:docPr id="1820384119" name="Straight Connector 15"/>
                                            <wp:cNvGraphicFramePr/>
                                            <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                                <a:graphicData
                                                        uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                                    <wp:wsp>
                                                        <wp:cNvCnPr/>
                                                        <wp:spPr>
                                                            <a:xfrm>
                                                                <a:off x="0" y="0"/>
                                                                <a:ext cx="1732915" cy="0"/>
                                                            </a:xfrm>
                                                            <a:prstGeom prst="line">
                                                                <a:avLst/>
                                                            </a:prstGeom>
                                                            <a:ln>
                                                                <a:solidFill>
                                                                    <a:srgbClr val="F6A10A"/>
                                                                </a:solidFill>
                                                            </a:ln>
                                                        </wp:spPr>
                                                        <wp:style>
                                                            <a:lnRef idx="2">
                                                                <a:schemeClr val="accent6"/>
                                                            </a:lnRef>
                                                            <a:fillRef idx="0">
                                                                <a:schemeClr val="accent6"/>
                                                            </a:fillRef>
                                                            <a:effectRef idx="1">
                                                                <a:schemeClr val="accent6"/>
                                                            </a:effectRef>
                                                            <a:fontRef idx="minor">
                                                                <a:schemeClr val="tx1"/>
                                                            </a:fontRef>
                                                        </wp:style>
                                                        <wp:bodyPr/>
                                                    </wp:wsp>
                                                </a:graphicData>
                                            </a:graphic>
                                            <wp14:sizeRelH relativeFrom="margin">
                                                <wp14:pctWidth>0%</wp14:pctWidth>
                                            </wp14:sizeRelH>
                                            <wp14:sizeRelV relativeFrom="margin">
                                                <wp14:pctHeight>0%</wp14:pctHeight>
                                            </wp14:sizeRelV>
                                        </wp:anchor>
                                    </w:drawing>
                                </w:r>
                                <w:r>
                                    <w:rPr>
                                        <w:rStyle w:val="A1"/>
                                    </w:rPr>
                                    <w:t>Periode</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="104.60pt" w:type="dxa"/>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="7056AB27" w14:textId="77777777" w:rsidR="00AB1904" w:rsidRPr="00D51FD7"
                                 w:rsidRDefault="00AB1904" w:rsidP="00AB1904">
                                <w:pPr>
                                    <w:pStyle w:val="Pa0"/>
                                    <w:rPr>
                                        <w:rStyle w:val="A1"/>
                                    </w:rPr>
                                </w:pPr>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="176.70pt" w:type="dxa"/>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="47F0F5CC" w14:textId="77777777" w:rsidR="00AB1904" w:rsidRPr="00D51FD7"
                                 w:rsidRDefault="00AB1904" w:rsidP="00AB1904">
                                <w:pPr>
                                    <w:pStyle w:val="Pa0"/>
                                    <w:rPr>
                                        <w:rStyle w:val="A1"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r>
                                    <w:rPr>
                                        <w:rStyle w:val="A1"/>
                                    </w:rPr>
                                    <w:t>Opdrachtgever</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="176.70pt" w:type="dxa"/>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="7648361C" w14:textId="2CD02549" w:rsidR="00AB1904"
                                 w:rsidRDefault="00AB1904" w:rsidP="00AB1904">
                                <w:pPr>
                                    <w:pStyle w:val="Pa0"/>
                                    <w:rPr>
                                        <w:rStyle w:val="A1"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r>
                                    <w:rPr>
                                        <w:rStyle w:val="A1"/>
                                    </w:rPr>
                                    <w:t>Functie</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                    </w:tr>
                    <w:tr w:rsidR="00AB1904" w14:paraId="4FC5C810" w14:textId="4B50C788" w:rsidTr="00DF7C37">
                        <w:trPr>
                            <w:trHeight w:val="13"/>
                        </w:trPr>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="68pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                    <w:end w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="112EB434" w14:textId="705A12EB" w:rsidR="00AB1904" w:rsidRPr="00CA43CD"
                                 w:rsidRDefault="00AB1904" w:rsidP="00AB1904">
                                <w:pPr>
                                    <w:pStyle w:val="BasicParagraph"/>
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r>
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                    <w:t>05 – 2017</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="104.60pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:start w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                    <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="47C3E883" w14:textId="775EF887" w:rsidR="00AB1904" w:rsidRPr="00CA43CD"
                                 w:rsidRDefault="00AB1904" w:rsidP="00AB1904">
                                <w:pPr>
                                    <w:pStyle w:val="BasicParagraph"/>
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r>
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                    <w:t>05 – 2020</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="176.70pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="41BBB737" w14:textId="77777777" w:rsidR="00AB1904" w:rsidRPr="00CA43CD"
                                 w:rsidRDefault="00AB1904" w:rsidP="00AB1904">
                                <w:pPr>
                                    <w:pStyle w:val="BasicParagraph"/>
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r>
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                    <w:t>ZZP</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="176.70pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="750393E1" w14:textId="56D2E48E" w:rsidR="00AB1904"
                                 w:rsidRDefault="00AB1904" w:rsidP="00AB1904">
                                <w:pPr>
                                    <w:pStyle w:val="BasicParagraph"/>
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r>
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                    <w:t xml:space="preserve">Freelance</w:t>
                                </w:r>
                                <w:r>
                                    <w:rPr>
                                        <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                    <w:t>Dev + Design</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                    </w:tr>
                    <w:tr w:rsidR="00AB1904" w14:paraId="39AB0CF7" w14:textId="254D1906" w:rsidTr="00DF7C37">
                        <w:trPr>
                            <w:trHeight w:val="447"/>
                        </w:trPr>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="68pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:top w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                    <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                    <w:end w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="7198EBB2" w14:textId="015DCD6E" w:rsidR="00AB1904" w:rsidRPr="00CA43CD"
                                 w:rsidRDefault="00AB1904" w:rsidP="00AB1904">
                                <w:pPr>
                                    <w:pStyle w:val="Pa0"/>
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r>
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                    <w:t>05 – 2017</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="104.60pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:top w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                    <w:start w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                    <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="1296FC5C" w14:textId="0D971A8C" w:rsidR="00AB1904" w:rsidRPr="00CA43CD"
                                 w:rsidRDefault="00AB1904" w:rsidP="00AB1904">
                                <w:pPr>
                                    <w:pStyle w:val="Pa0"/>
                                    <w:ind w:end="-6.95pt"/>
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r>
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                    <w:t>05 – 2020</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="176.70pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:top w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                    <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="455C1017" w14:textId="1828AC06" w:rsidR="00AB1904" w:rsidRPr="00CA43CD"
                                 w:rsidRDefault="00AB1904" w:rsidP="00AB1904">
                                <w:pPr>
                                    <w:pStyle w:val="Pa0"/>
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r>
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                    <w:t>ZZP</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="176.70pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:top w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                    <w:bottom w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="19C5BF71" w14:textId="73970A41" w:rsidR="00AB1904"
                                 w:rsidRDefault="00AB1904" w:rsidP="00AB1904">
                                <w:pPr>
                                    <w:pStyle w:val="Pa0"/>
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r>
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                    <w:t>Freelance Dev + Design</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                    </w:tr>
                    <w:tr w:rsidR="00AB1904" w14:paraId="66BD9242" w14:textId="524E17BC" w:rsidTr="00DF7C37">
                        <w:trPr>
                            <w:trHeight w:val="447"/>
                        </w:trPr>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="68pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:top w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                    <w:end w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="721D2BA1" w14:textId="728F9CBF" w:rsidR="00AB1904" w:rsidRPr="00604B30"
                                 w:rsidRDefault="00AB1904" w:rsidP="00AB1904">
                                <w:pPr>
                                    <w:pStyle w:val="Pa0"/>
                                    <w:rPr>
                                        <w:rStyle w:val="A3"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r>
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                    <w:t>05 – 2017</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="104.60pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:top w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                    <w:start w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="641FBFC3" w14:textId="042B6D36" w:rsidR="00AB1904" w:rsidRPr="00604B30"
                                 w:rsidRDefault="00AB1904" w:rsidP="00AB1904">
                                <w:pPr>
                                    <w:pStyle w:val="Pa0"/>
                                    <w:rPr>
                                        <w:rStyle w:val="A3"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r>
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                    <w:t>05 – 2020</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="176.70pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:top w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="310C9AD8" w14:textId="2D8BBE56" w:rsidR="00AB1904" w:rsidRPr="00604B30"
                                 w:rsidRDefault="00AB1904" w:rsidP="00AB1904">
                                <w:pPr>
                                    <w:pStyle w:val="Pa0"/>
                                    <w:rPr>
                                        <w:rStyle w:val="A3"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r>
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                    <w:t>ZZP</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                        <w:tc>
                            <w:tcPr>
                                <w:tcW w:w="176.70pt" w:type="dxa"/>
                                <w:tcBorders>
                                    <w:top w:val="single" w:sz="4" w:space="0" w:color="F6A10A"/>
                                </w:tcBorders>
                                <w:vAlign w:val="center"/>
                            </w:tcPr>
                            <w:p w14:paraId="18F15E4B" w14:textId="04714452" w:rsidR="00AB1904"
                                 w:rsidRDefault="00AB1904" w:rsidP="00AB1904">
                                <w:pPr>
                                    <w:pStyle w:val="Pa0"/>
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                </w:pPr>
                                <w:r>
                                    <w:rPr>
                                        <w:sz w:val="18"/>
                                        <w:szCs w:val="16"/>
                                    </w:rPr>
                                    <w:t>Freelance Dev + Design</w:t>
                                </w:r>
                            </w:p>
                        </w:tc>
                    </w:tr>
                </w:tbl>
                <w:p w14:paraId="78E9113D" w14:textId="4F1BB34C" w:rsidR="00CC7FCE" w:rsidRPr="00926161"
                     w:rsidRDefault="00CC7FCE" w:rsidP="00160C07">
                    <w:pPr>
                        <w:pStyle w:val="Titel1"/>
                    </w:pPr>
                    <w:r>
                        <w:br w:type="page"/>
                    </w:r>
                </w:p>
                <w:p w14:paraId="1FE1FD17" w14:textId="77777777" w:rsidR="00CC7FCE" w:rsidRDefault="00CC7FCE"
                     w:rsidP="00160C07">
                    <w:pPr>
                        <w:pStyle w:val="Titel1"/>
                        <w:sectPr w:rsidR="00CC7FCE" w:rsidSect="00F87D02">
                            <w:type w:val="continuous"/>
                            <w:pgSz w:w="595.30pt" w:h="841.90pt"/>
                            <w:pgMar w:top="72pt" w:right="26.95pt" w:bottom="72pt" w:left="36.55pt" w:header="35.45pt"
                                     w:footer="2.85pt" w:gutter="0pt"/>
                            <w:cols w:space="17.45pt"/>
                            <w:docGrid w:linePitch="360"/>
                        </w:sectPr>
                    </w:pPr>
                </w:p>
                <w:p w14:paraId="0446C0FE" w14:textId="77777777" w:rsidR="00CC7FCE" w:rsidRDefault="00CC7FCE"
                     w:rsidP="00160C07">
                    <w:pPr>
                        <w:pStyle w:val="Titel1"/>
                        <w:sectPr w:rsidR="00CC7FCE" w:rsidSect="00F87D02">
                            <w:type w:val="continuous"/>
                            <w:pgSz w:w="595.30pt" w:h="841.90pt"/>
                            <w:pgMar w:top="72pt" w:right="26.95pt" w:bottom="72pt" w:left="36.55pt" w:header="35.45pt"
                                     w:footer="2.85pt" w:gutter="0pt"/>
                            <w:cols w:space="17.45pt"/>
                            <w:docGrid w:linePitch="360"/>
                        </w:sectPr>
                    </w:pPr>
                </w:p>
                <w:p w14:paraId="096EEC3B" w14:textId="10470BEA" w:rsidR="00CA43CD" w:rsidRPr="00AB1904"
                     w:rsidRDefault="00CC7FCE" w:rsidP="00160C07">
                    <w:pPr>
                        <w:pStyle w:val="Titel1"/>
                        <w:rPr>
                            <w:u w:val="none"/>
                        </w:rPr>
                    </w:pPr>
                    <w:r w:rsidRPr="00AB1904">
                        <w:rPr>
                            <w:u w:val="none"/>
                        </w:rPr>
                        <w:t>Referenties</w:t>
                    </w:r>
                </w:p>
                <w:p w14:paraId="3D45720F" w14:textId="10A0C37D" w:rsidR="00CC7FCE" w:rsidRDefault="00AB1904"
                     w:rsidP="00CC7FCE">
                    <w:pPr>
                        <w:rPr>
                            <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                            <w:b/>
                            <w:bCs/>
                            <w:color w:val="212B46"/>
                            <w:sz w:val="28"/>
                            <w:szCs w:val="28"/>
                            <w:lang w:val="en-GB"/>
                        </w:rPr>
                    </w:pPr>
                    <w:r>
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251704320" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1" wp14:anchorId="34F09BD8" wp14:editId="2914D6F1">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>635</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>14928</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="920772" cy="0"/>
                                <wp:effectExtent l="0" t="12700" r="19050" b="12700"/>
                                <wp:wrapNone/>
                                <wp:docPr id="14562976" name="Straight Connector 15"/>
                                <wp:cNvGraphicFramePr/>
                                <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                    <a:graphicData
                                            uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                        <wp:wsp>
                                            <wp:cNvCnPr/>
                                            <wp:spPr>
                                                <a:xfrm>
                                                    <a:off x="0" y="0"/>
                                                    <a:ext cx="920772" cy="0"/>
                                                </a:xfrm>
                                                <a:prstGeom prst="line">
                                                    <a:avLst/>
                                                </a:prstGeom>
                                                <a:ln>
                                                    <a:solidFill>
                                                        <a:srgbClr val="F6A10A"/>
                                                    </a:solidFill>
                                                </a:ln>
                                            </wp:spPr>
                                            <wp:style>
                                                <a:lnRef idx="2">
                                                    <a:schemeClr val="accent6"/>
                                                </a:lnRef>
                                                <a:fillRef idx="0">
                                                    <a:schemeClr val="accent6"/>
                                                </a:fillRef>
                                                <a:effectRef idx="1">
                                                    <a:schemeClr val="accent6"/>
                                                </a:effectRef>
                                                <a:fontRef idx="minor">
                                                    <a:schemeClr val="tx1"/>
                                                </a:fontRef>
                                            </wp:style>
                                            <wp:bodyPr/>
                                        </wp:wsp>
                                    </a:graphicData>
                                </a:graphic>
                                <wp14:sizeRelH relativeFrom="margin">
                                    <wp14:pctWidth>0%</wp14:pctWidth>
                                </wp14:sizeRelH>
                                <wp14:sizeRelV relativeFrom="margin">
                                    <wp14:pctHeight>0%</wp14:pctHeight>
                                </wp14:sizeRelV>
                            </wp:anchor>
                        </w:drawing>
                    </w:r>
                </w:p>
                <w:p w14:paraId="6DF0B5BD" w14:textId="77777777" w:rsidR="00CA43CD" w:rsidRPr="00D51FD7"
                     w:rsidRDefault="00CA43CD" w:rsidP="00CC7FCE">
                    <w:pPr>
                        <w:rPr>
                            <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                            <w:b/>
                            <w:bCs/>
                            <w:color w:val="212B46"/>
                            <w:sz w:val="28"/>
                            <w:szCs w:val="28"/>
                            <w:lang w:val="en-GB"/>
                        </w:rPr>
                        <w:sectPr w:rsidR="00CA43CD" w:rsidRPr="00D51FD7" w:rsidSect="00F87D02">
                            <w:type w:val="continuous"/>
                            <w:pgSz w:w="595.30pt" w:h="841.90pt"/>
                            <w:pgMar w:top="72pt" w:right="26.95pt" w:bottom="72pt" w:left="36.55pt" w:header="35.45pt"
                                     w:footer="2.85pt" w:gutter="0pt"/>
                            <w:cols w:space="17.45pt"/>
                            <w:docGrid w:linePitch="360"/>
                        </w:sectPr>
                    </w:pPr>
                </w:p>
                <w:p w14:paraId="723A7055" w14:textId="6537F84F" w:rsidR="00CC7FCE" w:rsidRPr="00CC7FCE"
                     w:rsidRDefault="00CC7FCE" w:rsidP="00CC7FCE">
                    <w:pPr>
                        <w:spacing w:before="12pt"/>
                        <w:rPr>
                            <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                            <w:b/>
                            <w:bCs/>
                            <w:color w:val="212B46"/>
                            <w:lang w:val="en-GB"/>
                        </w:rPr>
                    </w:pPr>
                    <w:r w:rsidRPr="00CC7FCE">
                        <w:rPr>
                            <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                            <w:b/>
                            <w:bCs/>
                            <w:color w:val="212B46"/>
                            <w:lang w:val="en-GB"/>
                        </w:rPr>
                        <w:t>2023</w:t>
                    </w:r>
                    <w:r w:rsidRPr="00DF7C37">
                        <w:rPr>
                            <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                            <w:color w:val="F6A10A"/>
                            <w:lang w:val="en-GB"/>
                        </w:rPr>
                        <w:t xml:space="preserve"> |</w:t>
                    </w:r>
                    <w:r w:rsidRPr="00CC7FCE">
                        <w:rPr>
                            <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                            <w:b/>
                            <w:bCs/>
                            <w:color w:val="212B46"/>
                            <w:lang w:val="en-GB"/>
                        </w:rPr>
                        <w:t>Paul Boomgaard</w:t>
                    </w:r>
                    <w:r w:rsidRPr="00DF7C37">
                        <w:rPr>
                            <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                            <w:color w:val="F6A10A"/>
                            <w:lang w:val="en-GB"/>
                        </w:rPr>
                        <w:t xml:space="preserve"> |</w:t>
                    </w:r>
                    <w:r w:rsidRPr="00CC7FCE">
                        <w:rPr>
                            <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                            <w:b/>
                            <w:bCs/>
                            <w:color w:val="212B46"/>
                            <w:lang w:val="en-GB"/>
                        </w:rPr>
                        <w:t>Manager Services Amac</w:t>
                    </w:r>
                </w:p>
                <w:p w14:paraId="46790F11" w14:textId="2E404240" w:rsidR="00CC7FCE" w:rsidRPr="00E93FB9"
                     w:rsidRDefault="00CC7FCE" w:rsidP="00E93FB9">
                    <w:pPr>
                        <w:rPr>
                            <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                            <w:sz w:val="18"/>
                            <w:szCs w:val="18"/>
                        </w:rPr>
                        <w:sectPr w:rsidR="00CC7FCE" w:rsidRPr="00E93FB9" w:rsidSect="00F87D02">
                            <w:type w:val="continuous"/>
                            <w:pgSz w:w="595.30pt" w:h="841.90pt"/>
                            <w:pgMar w:top="72pt" w:right="26.95pt" w:bottom="72pt" w:left="36.55pt" w:header="35.45pt"
                                     w:footer="2.85pt" w:gutter="0pt"/>
                            <w:cols w:space="17.45pt"/>
                            <w:docGrid w:linePitch="360"/>
                        </w:sectPr>
                    </w:pPr>
                    <w:r w:rsidRPr="00E93FB9">
                        <w:rPr>
                            <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                            <w:sz w:val="18"/>
                            <w:szCs w:val="18"/>
                        </w:rPr>
                        <w:t>Toen Erik bij Amac kwam werken...</w:t>
                    </w:r>
                </w:p>
                <w:sectPr w:rsidR="00CC7FCE" w:rsidRPr="00E93FB9" w:rsidSect="00F87D02">
                    <w:type w:val="continuous"/>
                    <w:pgSz w:w="595.30pt" w:h="841.90pt"/>
                    <w:pgMar w:top="72pt" w:right="26.95pt" w:bottom="72pt" w:left="36.55pt" w:header="35.45pt"
                             w:footer="2.85pt" w:gutter="0pt"/>
                    <w:cols w:space="17.45pt"/>
                    <w:docGrid w:linePitch="360"/>
                </w:sectPr>
            </w:body>
        </w:document>
    </xsl:template>
</xsl:stylesheet>