<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:cv="https://ns.bransom.nl/valori/cv/v20201130.xsd"
        exclude-result-prefixes="cv"
        xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex"
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
        version="1.0">

    <xsl:import href="../../../common.xsl"/>
    <xsl:import href="../../common-brand.xsl"/>
    <xsl:import href="../common-nl_NL.xsl"/>

    <xsl:output method="xml" standalone="yes" encoding="UTF-8" indent="no"/>

    <xsl:template match="/cv:root">
        <xsl:variable name="characteristics" select="cv:characteristics[cv:includeInCv = 'true']"/>
        <w:document mc:Ignorable="w14 w15 w16se w16cid w16 w16cex w16sdtdh w16sdtfl w16du wne wp14"
                    w:conformance="strict">
            <w:body>
                <!--

                HEADING

                -->
                <w:p w14:paraId="56438C05" w14:textId="738191C7" w:rsidR="00B11653" w:rsidRDefault="00F37740">
                    <w:r>
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251668480" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1"
                                       wp14:anchorId="413458E8" wp14:editId="0D83563D">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>4987412</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>987425</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="1506855" cy="1464310"/>
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
                                                    <a:ext cx="1506855" cy="1464310"/>
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
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="000E5868">
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:color w:val="FFFFFF" w:themeColor="background1"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t>GEBOORTEDATUM</w:t>
                                                        </w:r>
                                                    </w:p>
                                                    <w:p w14:paraId="4633CB24" w14:textId="3E1F5B64" w:rsidR="0004532F"
                                                         w:rsidRPr="000E5868" w:rsidRDefault="0004532F"
                                                         w:rsidP="000E5868">
                                                        <w:pPr>
                                                            <w:spacing w:after="6pt" w:line="12pt" w:lineRule="auto"/>
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
                                                       rtlCol="0"
                                                       fromWordArt="0" anchor="t" anchorCtr="0" forceAA="0"
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
                    <w:r>
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251664384" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1" wp14:anchorId="1541F9EA" wp14:editId="27C48E51">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>3284193</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>-6985</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="3568700" cy="655955"/>
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
                                                    <a:ext cx="3568700" cy="655955"/>
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
                    <w:r w:rsidR="001958BA">
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251666432" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1" wp14:anchorId="114F53A9" wp14:editId="7DE7FBAF">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>3279775</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>991870</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="1614170" cy="1464310"/>
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
                                                    <a:ext cx="1614170" cy="1464310"/>
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
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="000E5868">
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:color w:val="FFFFFF" w:themeColor="background1"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t>FUNCTIE</w:t>
                                                        </w:r>
                                                    </w:p>
                                                    <w:p w14:paraId="53EF3592" w14:textId="1EEB775D" w:rsidR="0004532F"
                                                         w:rsidRPr="000E5868" w:rsidRDefault="0004532F"
                                                         w:rsidP="000E5868">
                                                        <w:pPr>
                                                            <w:spacing w:after="6pt" w:line="13.80pt"
                                                                       w:lineRule="auto"/>
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
                                                                <xsl:value-of select="$characteristics/cv:role"/>
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
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="000E5868">
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:color w:val="FFFFFF" w:themeColor="background1"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t>WOONPLAATS</w:t>
                                                        </w:r>
                                                    </w:p>
                                                    <w:p w14:paraId="27B0411B" w14:textId="0DBC4122" w:rsidR="0004532F"
                                                         w:rsidRPr="000E5868" w:rsidRDefault="0004532F"
                                                         w:rsidP="000E5868">
                                                        <w:pPr>
                                                            <w:spacing w:after="6pt" w:line="13.80pt"
                                                                       w:lineRule="auto"/>
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
                                                                <xsl:value-of select="cv:account/cv:residence"/>
                                                            </w:t>
                                                        </w:r>
                                                    </w:p>
                                                </wne:txbxContent>
                                            </wp:txbx>
                                            <wp:bodyPr rot="0" spcFirstLastPara="0" vertOverflow="overflow"
                                                       horzOverflow="overflow" vert="horz" wrap="square" lIns="91440"
                                                       tIns="45720" rIns="91440" bIns="45720" numCol="1" spcCol="0"
                                                       rtlCol="0"
                                                       fromWordArt="0" anchor="t" anchorCtr="0" forceAA="0"
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
                    <w:r w:rsidR="002251BB" w:rsidRPr="00B11653">
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251656190" behindDoc="1" locked="0" layoutInCell="1"
                                       allowOverlap="1"
                                       wp14:anchorId="72854C67" wp14:editId="5C654BAF">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>-912752</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="page">
                                    <wp:posOffset>0</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="7996136" cy="3557905"/>
                                <wp:effectExtent l="0" t="0" r="5080" b="0"/>
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
                                                <pic:cNvPr id="704115198" name=""/>
                                                <pic:cNvPicPr/>
                                            </pic:nvPicPr>
                                            <pic:blipFill>
                                                <a:blip r:embed="rId8"/>
                                                <a:stretch>
                                                    <a:fillRect/>
                                                </a:stretch>
                                            </pic:blipFill>
                                            <pic:spPr>
                                                <a:xfrm>
                                                    <a:off x="0" y="0"/>
                                                    <a:ext cx="8000152" cy="3559692"/>
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
                    <w:r w:rsidR="00D52540">
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251678720" behindDoc="1" locked="0" layoutInCell="1"
                                       allowOverlap="1"
                                       wp14:anchorId="41AA082E" wp14:editId="32279833">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>194310</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>-225848</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="1862118" cy="586223"/>
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
                                                <pic:cNvPr id="1727648750" name="Graphic 1727648750"/>
                                                <pic:cNvPicPr/>
                                            </pic:nvPicPr>
                                            <pic:blipFill>
                                                <a:blip r:embed="rId9">
                                                    <a:extLst>
                                                        <a:ext>
                                                            <xsl:attribute name="uri">
                                                                <xsl:value-of
                                                                        select="'{96DAC541-7B7A-43D3-8B79-37D633B846F1}'"/>
                                                            </xsl:attribute>
                                                            <asvg:svgBlip
                                                                    xmlns:asvg="http://schemas.microsoft.com/office/drawing/2016/SVG/main"
                                                                    r:embed="rId10"/>
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
                                                    <a:ext cx="1862118" cy="586223"/>
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
                    <w:r w:rsidR="00B11653">
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251660288" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1"
                                       wp14:anchorId="24CE036A" wp14:editId="6DEFC1A3">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>-184785</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>609177</wp:posOffset>
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
                                                       rtlCol="0"
                                                       fromWordArt="0" anchor="ctr" anchorCtr="0" forceAA="0"
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
                <w:p w14:paraId="1F42E1CF" w14:textId="77777777" w:rsidR="0004532F" w:rsidRDefault="0004532F">
                    <w:pPr>
                        <w:sectPr w:rsidR="0004532F" w:rsidSect="00307129">
                            <w:headerReference w:type="default" r:id="rId12"/>
                            <w:footerReference w:type="default" r:id="rId13"/>
                            <w:footerReference w:type="first" r:id="rId14"/>
                            <w:pgSz w:w="595.30pt" w:h="841.90pt"/>
                            <w:pgMar w:top="72pt" w:right="31.10pt" w:bottom="72pt" w:left="39.70pt" w:header="35.45pt"
                                     w:footer="19.85pt" w:gutter="0pt"/>
                            <w:cols w:space="35.40pt"/>
                            <w:titlePg/>
                            <w:docGrid w:linePitch="360"/>
                        </w:sectPr>
                    </w:pPr>
                </w:p>
                <!--

                PROFILE

                -->
                <w:p w14:paraId="0245734B" w14:textId="1168C12D" w:rsidR="00B11653" w:rsidRDefault="0023741E">
                    <w:r>
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251689984" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1"
                                       wp14:anchorId="53C0D026" wp14:editId="3AB696FB">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>-454025</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>2678368</wp:posOffset>
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
                                                        <a:srgbClr val="55DD94"/>
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
                    <w:r w:rsidR="00065B83">
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251702272" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1"
                                       wp14:anchorId="67CF79A2" wp14:editId="50F8A87B">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>-453390</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>5931454</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="827314" cy="0"/>
                                <wp:effectExtent l="0" t="12700" r="24130" b="12700"/>
                                <wp:wrapNone/>
                                <wp:docPr id="405830428" name="Straight Connector 15"/>
                                <wp:cNvGraphicFramePr/>
                                <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                    <a:graphicData
                                            uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                        <wp:wsp>
                                            <wp:cNvCnPr/>
                                            <wp:spPr>
                                                <a:xfrm>
                                                    <a:off x="0" y="0"/>
                                                    <a:ext cx="827314" cy="0"/>
                                                </a:xfrm>
                                                <a:prstGeom prst="line">
                                                    <a:avLst/>
                                                </a:prstGeom>
                                                <a:ln>
                                                    <a:solidFill>
                                                        <a:srgbClr val="55DD94"/>
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
                    <w:r w:rsidR="001958BA" w:rsidRPr="00D52540">
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251655165" behindDoc="1" locked="0" layoutInCell="1"
                                       allowOverlap="1"
                                       wp14:anchorId="52B7CF1E" wp14:editId="31659129">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>3383915</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>5735320</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="3945255" cy="4046855"/>
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
                                                <a:blip r:embed="rId15">
                                                    <a:alphaModFix amt="20%"/>
                                                </a:blip>
                                                <a:stretch>
                                                    <a:fillRect/>
                                                </a:stretch>
                                            </pic:blipFill>
                                            <pic:spPr>
                                                <a:xfrm>
                                                    <a:off x="0" y="0"/>
                                                    <a:ext cx="3945255" cy="4046855"/>
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
                    <w:r w:rsidR="001A7313">
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251669504" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1"
                                       wp14:anchorId="5A312803" wp14:editId="2FFD9698">
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
                                                         w:rsidRPr="003D5A44" w:rsidRDefault="00D52540"
                                                         w:rsidP="00065B83">
                                                        <w:pPr>
                                                            <w:pStyle w:val="Titel1"/>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="003D5A44">
                                                            <w:t>Persoonlijk profiel</w:t>
                                                        </w:r>
                                                    </w:p>
                                                    <w:p w14:paraId="1E4DCC74" w14:textId="190F3819" w:rsidR="0004532F"
                                                         w:rsidRDefault="0004532F" w:rsidP="000E5868">
                                                        <w:pPr>
                                                            <w:pStyle w:val="BasicParagraph"/>
                                                            <w:suppressAutoHyphens/>
                                                            <w:spacing w:before="12pt"/>
                                                        </w:pPr>
                                                        <w:r>
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="PlusJakartaSans-Regular"
                                                                          w:hAnsi="PlusJakartaSans-Regular"
                                                                          w:cs="PlusJakartaSans-Regular"/>
                                                                <w:color w:val="212B46"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t>
                                                                <xsl:variable name="profile"
                                                                              select="$characteristics/cv:profile/cv:nl_NL"/>
                                                                <xsl:apply-templates select="$profile" mode="markdown"/>
                                                            </w:t>
                                                        </w:r>
                                                    </w:p>
                                                </wne:txbxContent>
                                            </wp:txbx>
                                            <wp:bodyPr rot="0" spcFirstLastPara="0" vertOverflow="overflow"
                                                       horzOverflow="overflow" vert="horz" wrap="square" lIns="91440"
                                                       tIns="45720" rIns="91440" bIns="45720" numCol="1" spcCol="0"
                                                       rtlCol="0"
                                                       fromWordArt="0" anchor="t" anchorCtr="0" forceAA="0"
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
                    <w:r w:rsidR="001A7313">
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251671552" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1"
                                       wp14:anchorId="6159BDFF" wp14:editId="357C47DF">
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
                                                       horzOverflow="overflow" vert="horz" wrap="square" lIns="91440"
                                                       tIns="45720" rIns="91440" bIns="45720" numCol="1" spcCol="0"
                                                       rtlCol="0"
                                                       fromWordArt="0" anchor="t" anchorCtr="0" forceAA="0"
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
                                       allowOverlap="1"
                                       wp14:anchorId="783536A8" wp14:editId="7BDDF852">
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
                                                    <w:p w14:paraId="26ED557F" w14:textId="578660EB" w:rsidR="00D52540"
                                                         w:rsidRPr="00D52540" w:rsidRDefault="00D52540"
                                                         w:rsidP="00D52540"/>
                                                </wne:txbxContent>
                                            </wp:txbx>
                                            <wp:bodyPr rot="0" spcFirstLastPara="0" vertOverflow="overflow"
                                                       horzOverflow="overflow" vert="horz" wrap="square" lIns="91440"
                                                       tIns="45720" rIns="91440" bIns="45720" numCol="1" spcCol="0"
                                                       rtlCol="0"
                                                       fromWordArt="0" anchor="ctr" anchorCtr="0" forceAA="0"
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
                                       allowOverlap="1"
                                       wp14:anchorId="3D5826BC" wp14:editId="0D8C587B">
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
                                                       horzOverflow="overflow" vert="horz" wrap="square" lIns="91440"
                                                       tIns="45720" rIns="91440" bIns="45720" numCol="1" spcCol="0"
                                                       rtlCol="0"
                                                       fromWordArt="0" anchor="ctr" anchorCtr="0" forceAA="0"
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
                                       allowOverlap="1"
                                       wp14:anchorId="4527B553" wp14:editId="74321C57">
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
                                                    <w:p w14:paraId="76C9C377" w14:textId="77777777" w:rsidR="000E5868"
                                                         w:rsidRPr="00D51FD7" w:rsidRDefault="00D52540"
                                                         w:rsidP="005815D4">
                                                        <w:pPr>
                                                            <w:pStyle w:val="Titel1"/>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="00D51FD7">
                                                            <w:t>Interesses</w:t>
                                                        </w:r>
                                                    </w:p>
                                                    <w:p w14:paraId="62C664D3" w14:textId="2DD59BE1" w:rsidR="00D52540"
                                                         w:rsidRPr="000E5868" w:rsidRDefault="00D52540"
                                                         w:rsidP="000E5868">
                                                        <w:pPr>
                                                            <w:spacing w:before="12pt"/>
                                                        </w:pPr>
                                                        <w:r w:rsidRPr="000E5868">
                                                            <w:rPr>
                                                                <w:rFonts w:ascii="Plus Jakarta Sans"
                                                                          w:hAnsi="Plus Jakarta Sans"/>
                                                                <w:sz w:val="18"/>
                                                                <w:szCs w:val="18"/>
                                                            </w:rPr>
                                                            <w:t>
                                                                <xsl:value-of select="$characteristics/cv:interests"/>
                                                            </w:t>
                                                        </w:r>
                                                    </w:p>
                                                </wne:txbxContent>
                                            </wp:txbx>
                                            <wp:bodyPr rot="0" spcFirstLastPara="0" vertOverflow="overflow"
                                                       horzOverflow="overflow" vert="horz" wrap="square" lIns="91440"
                                                       tIns="45720" rIns="91440" bIns="45720" numCol="1" spcCol="0"
                                                       rtlCol="0"
                                                       fromWordArt="0" anchor="t" anchorCtr="0" forceAA="0"
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
                        <w:br w:type="page"/>
                    </w:r>
                </w:p>
                <w:p w14:paraId="47B6466D" w14:textId="77777777" w:rsidR="00462426" w:rsidRDefault="00462426">
                    <w:pPr>
                        <w:sectPr w:rsidR="00462426" w:rsidSect="00307129">
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
                <w:p w14:paraId="04942FD4" w14:textId="28725C40" w:rsidR="002251BB" w:rsidRPr="001958BA"
                     w:rsidRDefault="00065B83" w:rsidP="001958BA">
                    <w:pPr>
                        <w:pStyle w:val="Titel1"/>
                    </w:pPr>
                    <w:r>
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:lastRenderedPageBreak/>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251692032" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1"
                                       wp14:anchorId="1ABC1FD6" wp14:editId="1FAFAECC">
                                <wp:simplePos x="0" y="0"/>
                                <wp:positionH relativeFrom="column">
                                    <wp:posOffset>-635</wp:posOffset>
                                </wp:positionH>
                                <wp:positionV relativeFrom="paragraph">
                                    <wp:posOffset>250825</wp:posOffset>
                                </wp:positionV>
                                <wp:extent cx="2051050" cy="0"/>
                                <wp:effectExtent l="0" t="12700" r="19050" b="12700"/>
                                <wp:wrapNone/>
                                <wp:docPr id="728606184" name="Straight Connector 15"/>
                                <wp:cNvGraphicFramePr/>
                                <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                    <a:graphicData
                                            uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                        <wp:wsp>
                                            <wp:cNvCnPr/>
                                            <wp:spPr>
                                                <a:xfrm>
                                                    <a:off x="0" y="0"/>
                                                    <a:ext cx="2051050" cy="0"/>
                                                </a:xfrm>
                                                <a:prstGeom prst="line">
                                                    <a:avLst/>
                                                </a:prstGeom>
                                                <a:ln>
                                                    <a:solidFill>
                                                        <a:srgbClr val="55DD94"/>
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
                    <w:r w:rsidR="002251BB" w:rsidRPr="001958BA">
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:t>Kerncompetenties / skills</w:t>
                    </w:r>
                    <w:r w:rsidR="00D51FD7" w:rsidRPr="001958BA">
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251683840" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1"
                                       wp14:anchorId="65A007C0" wp14:editId="5A8EF887">
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
                                                       rtlCol="0"
                                                       fromWordArt="0" anchor="t" anchorCtr="0" forceAA="0"
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
                    <w:r w:rsidR="00D51FD7" w:rsidRPr="001958BA">
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251688960" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1"
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
                                    <a:graphicData
                                            uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
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
                                                         w:rsidRPr="00D51FD7" w:rsidRDefault="00D51FD7"
                                                         w:rsidP="00D51FD7">
                                                        <w:pPr>
                                                            <w:tabs>
                                                                <w:tab w:val="start" w:pos="70.90pt"/>
                                                                <w:tab w:val="start" w:pos="163.05pt"/>
                                                                <w:tab w:val="start" w:pos="198.45pt"/>
                                                            </w:tabs>
                                                            <w:spacing w:after="0pt"/>
                                                            <w:jc w:val="center"/>
                                                        </w:pPr>
                                                        <w:r>
                                                            <w:rPr>
                                                                <w:rStyle w:val="Valori-niveau"/>
                                                                <w:color w:val="55DD94"/>
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
                                                            <w:t>basis</w:t>
                                                            <w:tab/>
                                                        </w:r>
                                                        <w:r>
                                                            <w:rPr>
                                                                <w:rStyle w:val="Valori-niveau"/>
                                                                <w:color w:val="55DD94"/>
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
                                                            <w:t>gevorderd</w:t>
                                                            <w:tab/>
                                                        </w:r>
                                                        <w:r w:rsidRPr="00545E7E">
                                                            <w:rPr>
                                                                <w:rStyle w:val="Valori-niveau"/>
                                                                <w:color w:val="55DD94"/>
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
                                                            <w:t>ervaren</w:t>
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
                                       relativeHeight="251687936" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1"
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
                                    <a:graphicData
                                            uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
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
                                                       tIns="45720" rIns="91440" bIns="45720" numCol="1" spcCol="0"
                                                       rtlCol="0"
                                                       fromWordArt="0" anchor="t" anchorCtr="0" forceAA="0"
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
                    <w:r w:rsidR="002251BB" w:rsidRPr="001958BA">
                        <w:rPr>
                            <w:noProof/>
                        </w:rPr>
                        <w:drawing>
                            <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                       relativeHeight="251685888" behindDoc="0" locked="0" layoutInCell="1"
                                       allowOverlap="1"
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
                                    <a:graphicData
                                            uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
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
                                                       tIns="45720" rIns="91440" bIns="45720" numCol="1" spcCol="0"
                                                       rtlCol="0"
                                                       fromWordArt="0" anchor="t" anchorCtr="0" forceAA="0"
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
                    <w:r w:rsidR="00462426" w:rsidRPr="001958BA">
                        <w:br w:type="page"/>
                    </w:r>
                </w:p>
                <!--

                EDUCATION AND TRAINING

                -->
                <xsl:variable name="educations" select="cv:education[cv:includeInCv = 'true']"/>
                <xsl:variable name="trainings" select="cv:training[cv:includeInCv = 'true']"/>
                <xsl:if test="$educations or $trainings">
                    <w:p w14:paraId="3B70A471" w14:textId="77777777" w:rsidR="00CC7FCE" w:rsidRDefault="00CC7FCE"
                         w:rsidP="00604B30">
                        <w:pPr>
                            <w:pStyle w:val="BasicParagraph"/>
                            <w:ind w:end="2.35pt"/>
                            <w:rPr>
                                <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"
                                          w:cs="Plus Jakarta Sans"/>
                                <w:b/>
                                <w:bCs/>
                                <w:color w:val="212B46"/>
                                <w:sz w:val="26"/>
                                <w:szCs w:val="26"/>
                                <w:u w:val="thick" w:color="55DD94"/>
                            </w:rPr>
                            <w:sectPr w:rsidR="00CC7FCE" w:rsidSect="00CC7FCE">
                                <w:type w:val="continuous"/>
                                <w:pgSz w:w="595.30pt" w:h="841.90pt"/>
                                <w:pgMar w:top="72pt" w:right="26.95pt" w:bottom="72pt" w:left="36.55pt"
                                         w:header="35.45pt" w:footer="2.85pt" w:gutter="0pt"/>
                                <w:cols w:space="17.45pt"/>
                                <w:docGrid w:linePitch="360"/>
                            </w:sectPr>
                        </w:pPr>
                    </w:p>
                    <w:p w14:paraId="3BD8ED21" w14:textId="2411C07F" w:rsidR="00604B30" w:rsidRPr="00CA43CD"
                         w:rsidRDefault="00065B83" w:rsidP="00065B83">
                        <w:pPr>
                            <w:pStyle w:val="Titel1"/>
                        </w:pPr>
                        <w:r>
                            <w:rPr>
                                <w:noProof/>
                            </w:rPr>
                            <w:lastRenderedPageBreak/>
                            <w:drawing>
                                <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                           relativeHeight="251694080" behindDoc="0" locked="0" layoutInCell="1"
                                           allowOverlap="1" wp14:anchorId="2227511B" wp14:editId="5456FB9C">
                                    <wp:simplePos x="0" y="0"/>
                                    <wp:positionH relativeFrom="column">
                                        <wp:posOffset>-635</wp:posOffset>
                                    </wp:positionH>
                                    <wp:positionV relativeFrom="paragraph">
                                        <wp:posOffset>250825</wp:posOffset>
                                    </wp:positionV>
                                    <wp:extent cx="2006600" cy="0"/>
                                    <wp:effectExtent l="0" t="12700" r="12700" b="12700"/>
                                    <wp:wrapNone/>
                                    <wp:docPr id="1713514813" name="Straight Connector 15"/>
                                    <wp:cNvGraphicFramePr/>
                                    <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                        <a:graphicData
                                                uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                            <wp:wsp>
                                                <wp:cNvCnPr/>
                                                <wp:spPr>
                                                    <a:xfrm flipV="1">
                                                        <a:off x="0" y="0"/>
                                                        <a:ext cx="2006600" cy="0"/>
                                                    </a:xfrm>
                                                    <a:prstGeom prst="line">
                                                        <a:avLst/>
                                                    </a:prstGeom>
                                                    <a:ln>
                                                        <a:solidFill>
                                                            <a:srgbClr val="55DD94"/>
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
                        <w:r w:rsidR="00604B30" w:rsidRPr="005815D4">
                            <w:rPr>
                                <w:noProof/>
                            </w:rPr>
                            <w:t>Opleiding &amp; training</w:t>
                        </w:r>
                    </w:p>
                    <w:tbl>
                        <w:tblPr>
                            <w:tblStyle w:val="Tabelraster"/>
                            <w:tblpPr w:leftFromText="180" w:rightFromText="180" w:vertAnchor="page"
                                      w:horzAnchor="margin" w:tblpY="2646"/>
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
                        <!--

                        EDUCATION

                        -->
                        <xsl:if test="$educations">
                            <w:tr w:rsidR="001405E4" w14:paraId="105DB0F7" w14:textId="139D4571" w:rsidTr="000A0E47">
                                <w:trPr>
                                    <w:trHeight w:val="14"/>
                                </w:trPr>
                                <w:tc>
                                    <w:tcPr>
                                        <w:tcW w:w="202.25pt" w:type="dxa"/>
                                        <w:vAlign w:val="center"/>
                                    </w:tcPr>
                                    <w:p w14:paraId="6E5835BD" w14:textId="77777777" w:rsidR="001405E4"
                                         w:rsidRPr="00D51FD7" w:rsidRDefault="001405E4" w:rsidP="001405E4">
                                        <w:pPr>
                                            <w:pStyle w:val="Pa0"/>
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
                                    <w:p w14:paraId="49127A03" w14:textId="77777777" w:rsidR="001405E4"
                                         w:rsidRPr="00D51FD7" w:rsidRDefault="001405E4" w:rsidP="001405E4">
                                        <w:pPr>
                                            <w:pStyle w:val="Pa0"/>
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
                                    <w:p w14:paraId="64DFA393" w14:textId="77777777" w:rsidR="001405E4"
                                         w:rsidRPr="00D51FD7" w:rsidRDefault="001405E4" w:rsidP="001405E4">
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
                                    <w:p w14:paraId="137DCB48" w14:textId="7A3BB070" w:rsidR="001405E4"
                                         w:rsidRPr="00D51FD7" w:rsidRDefault="001405E4" w:rsidP="001405E4">
                                        <w:r w:rsidRPr="00D51FD7">
                                            <w:rPr>
                                                <w:rStyle w:val="A1"/>
                                            </w:rPr>
                                            <w:t>Diploma</w:t>
                                        </w:r>
                                    </w:p>
                                </w:tc>
                            </w:tr>

                            <xsl:apply-templates select="$educations">
                                <xsl:sort select="cv:yearTo" data-type="number" order="descending"/>
                                <xsl:sort select="cv:result"/>
                            </xsl:apply-templates>

                            <w:tr w:rsidR="001405E4" w14:paraId="5EBC8C3A" w14:textId="2BF52654" w:rsidTr="00594200">
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
                                    <w:p w14:paraId="4690787F" w14:textId="77777777" w:rsidR="001405E4"
                                         w:rsidRPr="00604B30" w:rsidRDefault="001405E4" w:rsidP="001405E4">
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
                                    <w:p w14:paraId="2F6B6DB0" w14:textId="77777777" w:rsidR="001405E4"
                                         w:rsidRPr="00604B30" w:rsidRDefault="001405E4" w:rsidP="001405E4">
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
                                    <w:p w14:paraId="475BD2B4" w14:textId="77777777" w:rsidR="001405E4"
                                         w:rsidRPr="00604B30" w:rsidRDefault="001405E4" w:rsidP="001405E4">
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
                                    </w:tcPr>
                                    <w:p w14:paraId="76CC3164" w14:textId="77777777" w:rsidR="001405E4"
                                         w:rsidRPr="00604B30" w:rsidRDefault="001405E4" w:rsidP="001405E4">
                                        <w:pPr>
                                            <w:rPr>
                                                <w:rStyle w:val="A3"/>
                                                <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                            </w:rPr>
                                        </w:pPr>
                                    </w:p>
                                </w:tc>
                            </w:tr>
                        </xsl:if>
                        <!--

                        TRAINING

                        -->
                        <xsl:if test="$trainings">
                            <w:tr w:rsidR="001405E4" w:rsidRPr="00D51FD7" w14:paraId="0566AC1C" w14:textId="128FB11B"
                                  w:rsidTr="001405E4">
                                <w:trPr>
                                    <w:trHeight w:val="14"/>
                                </w:trPr>
                                <w:tc>
                                    <w:tcPr>
                                        <w:tcW w:w="202.25pt" w:type="dxa"/>
                                        <w:vAlign w:val="center"/>
                                    </w:tcPr>
                                    <w:p w14:paraId="025C814A" w14:textId="77777777" w:rsidR="001405E4"
                                         w:rsidRPr="00D51FD7" w:rsidRDefault="001405E4" w:rsidP="001405E4">
                                        <w:pPr>
                                            <w:pStyle w:val="Pa0"/>
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
                                    <w:p w14:paraId="31D89CCB" w14:textId="35FC9C76" w:rsidR="001405E4"
                                         w:rsidRPr="00D51FD7" w:rsidRDefault="001405E4" w:rsidP="001405E4">
                                        <w:pPr>
                                            <w:pStyle w:val="Pa0"/>
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
                                    <w:p w14:paraId="5E03F854" w14:textId="77777777" w:rsidR="001405E4"
                                         w:rsidRPr="00D51FD7" w:rsidRDefault="001405E4" w:rsidP="001405E4">
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
                                    </w:tcPr>
                                    <w:p w14:paraId="2D8A2251" w14:textId="78D428AA" w:rsidR="001405E4"
                                         w:rsidRPr="00D51FD7" w:rsidRDefault="001405E4" w:rsidP="001405E4">
                                        <w:r>
                                            <w:rPr>
                                                <w:rStyle w:val="A1"/>
                                            </w:rPr>
                                            <w:t>Certificaat</w:t>
                                        </w:r>
                                    </w:p>
                                </w:tc>
                            </w:tr>

                            <xsl:apply-templates select="$trainings">
                                <xsl:sort select="cv:year" data-type="number" order="descending"/>
                                <xsl:sort select="cv:result"/>
                            </xsl:apply-templates>

                            <w:tr w:rsidR="001405E4" w14:paraId="60F7DABA" w14:textId="6F3DC714" w:rsidTr="00594200">
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
                                    <w:p w14:paraId="0E647319" w14:textId="77777777" w:rsidR="001405E4"
                                         w:rsidRPr="00604B30" w:rsidRDefault="001405E4" w:rsidP="001405E4">
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
                                    <w:p w14:paraId="3EA04818" w14:textId="77777777" w:rsidR="001405E4"
                                         w:rsidRPr="00604B30" w:rsidRDefault="001405E4" w:rsidP="001405E4">
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
                                    <w:p w14:paraId="25FA9B89" w14:textId="77777777" w:rsidR="001405E4"
                                         w:rsidRPr="00604B30" w:rsidRDefault="001405E4" w:rsidP="001405E4">
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
                                    </w:tcPr>
                                    <w:p w14:paraId="300B38C9" w14:textId="77777777" w:rsidR="001405E4"
                                         w:rsidRPr="00604B30" w:rsidRDefault="001405E4" w:rsidP="001405E4">
                                        <w:pPr>
                                            <w:rPr>
                                                <w:rStyle w:val="A3"/>
                                                <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                            </w:rPr>
                                        </w:pPr>
                                    </w:p>
                                </w:tc>
                            </w:tr>
                        </xsl:if>
                    </w:tbl>
                    <w:p w14:paraId="36BC7C31" w14:textId="195FC468" w:rsidR="005815D4" w:rsidRDefault="005815D4"
                         w:rsidP="002251BB"/>
                    <w:p w14:paraId="0FC87C85" w14:textId="77777777" w:rsidR="00CC7FCE" w:rsidRDefault="00CC7FCE">
                        <w:pPr>
                            <w:sectPr w:rsidR="00CC7FCE" w:rsidSect="00CC7FCE">
                                <w:type w:val="continuous"/>
                                <w:pgSz w:w="595.30pt" w:h="841.90pt"/>
                                <w:pgMar w:top="72pt" w:right="26.95pt" w:bottom="72pt" w:left="36.55pt"
                                         w:header="35.45pt" w:footer="2.85pt" w:gutter="0pt"/>
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
                </xsl:if>
                <!--

                EXPERIENCE

                -->
                <xsl:variable name="experiences" select="cv:experience[cv:includeInCv = 'true']"/>
                <xsl:if test="$experiences">
                    <w:p w14:paraId="6B615F0F" w14:textId="77777777" w:rsidR="00CC7FCE" w:rsidRDefault="00CC7FCE"
                         w:rsidP="00B2333C">
                        <w:pPr>
                            <w:pStyle w:val="Titel1"/>
                            <w:sectPr w:rsidR="00CC7FCE" w:rsidSect="00CC7FCE">
                                <w:type w:val="continuous"/>
                                <w:pgSz w:w="595.30pt" w:h="841.90pt"/>
                                <w:pgMar w:top="72pt" w:right="26.95pt" w:bottom="72pt" w:left="36.55pt"
                                         w:header="35.45pt"
                                         w:footer="2.85pt" w:gutter="0pt"/>
                                <w:cols w:space="17.45pt"/>
                                <w:docGrid w:linePitch="360"/>
                            </w:sectPr>
                        </w:pPr>
                    </w:p>
                    <w:p w14:paraId="6FAD22C1" w14:textId="301F00A0" w:rsidR="00CC7FCE" w:rsidRDefault="00065B83"
                         w:rsidP="00B2333C">
                        <w:pPr>
                            <w:pStyle w:val="Titel1"/>
                        </w:pPr>
                        <w:r>
                            <w:rPr>
                                <w:noProof/>
                            </w:rPr>
                            <w:lastRenderedPageBreak/>
                            <w:drawing>
                                <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                           relativeHeight="251696128" behindDoc="0" locked="0" layoutInCell="1"
                                           allowOverlap="1"
                                           wp14:anchorId="0E3D2438" wp14:editId="7C3F9A4D">
                                    <wp:simplePos x="0" y="0"/>
                                    <wp:positionH relativeFrom="column">
                                        <wp:posOffset>-635</wp:posOffset>
                                    </wp:positionH>
                                    <wp:positionV relativeFrom="paragraph">
                                        <wp:posOffset>231775</wp:posOffset>
                                    </wp:positionV>
                                    <wp:extent cx="1082675" cy="0"/>
                                    <wp:effectExtent l="0" t="12700" r="22225" b="12700"/>
                                    <wp:wrapNone/>
                                    <wp:docPr id="829027523" name="Straight Connector 15"/>
                                    <wp:cNvGraphicFramePr/>
                                    <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                        <a:graphicData
                                                uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                            <wp:wsp>
                                                <wp:cNvCnPr/>
                                                <wp:spPr>
                                                    <a:xfrm>
                                                        <a:off x="0" y="0"/>
                                                        <a:ext cx="1082675" cy="0"/>
                                                    </a:xfrm>
                                                    <a:prstGeom prst="line">
                                                        <a:avLst/>
                                                    </a:prstGeom>
                                                    <a:ln>
                                                        <a:solidFill>
                                                            <a:srgbClr val="55DD94"/>
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
                        <w:r w:rsidR="00B2333C">
                            <w:t>Werkervaring</w:t>
                        </w:r>
                    </w:p>
                    <w:p w14:paraId="21A5DF4E" w14:textId="77777777" w:rsidR="00CA43CD" w:rsidRDefault="00CA43CD"
                         w:rsidP="00B2333C">
                        <w:pPr>
                            <w:pStyle w:val="Titel1"/>
                        </w:pPr>
                    </w:p>

                    <xsl:apply-templates select="$experiences">
                        <xsl:sort select="cv:sortIndex" data-type="number"/>
                    </xsl:apply-templates>
                </xsl:if>
                <!--

                EXPERIENCES OVERVIEW

                -->
                <xsl:variable name="experienceOverviewItems" select="cv:experience[cv:includeInOverview = 'true']"/>
                <xsl:if test="$experienceOverviewItems">
                    <w:p w14:paraId="24FEE188" w14:textId="77777777" w:rsidR="00CC7FCE" w:rsidRDefault="00CC7FCE"
                         w:rsidP="00B2333C">
                        <w:pPr>
                            <w:pStyle w:val="Titel1"/>
                        </w:pPr>
                    </w:p>
                    <w:p w14:paraId="76CE181D" w14:textId="5E6D225C" w:rsidR="00CC7FCE" w:rsidRPr="00926161"
                         w:rsidRDefault="00065B83" w:rsidP="00926161">
                        <w:pPr>
                            <w:pStyle w:val="Titel1"/>
                        </w:pPr>
                        <w:r>
                            <w:rPr>
                                <w:noProof/>
                            </w:rPr>
                            <w:drawing>
                                <wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0"
                                           relativeHeight="251698176" behindDoc="0" locked="0" layoutInCell="1"
                                           allowOverlap="1" wp14:anchorId="7C97E47F" wp14:editId="78F4CE6A">
                                    <wp:simplePos x="0" y="0"/>
                                    <wp:positionH relativeFrom="column">
                                        <wp:posOffset>-635</wp:posOffset>
                                    </wp:positionH>
                                    <wp:positionV relativeFrom="paragraph">
                                        <wp:posOffset>230505</wp:posOffset>
                                    </wp:positionV>
                                    <wp:extent cx="1736725" cy="0"/>
                                    <wp:effectExtent l="0" t="12700" r="15875" b="12700"/>
                                    <wp:wrapNone/>
                                    <wp:docPr id="1133764444" name="Straight Connector 15"/>
                                    <wp:cNvGraphicFramePr/>
                                    <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                        <a:graphicData
                                                uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                            <wp:wsp>
                                                <wp:cNvCnPr/>
                                                <wp:spPr>
                                                    <a:xfrm>
                                                        <a:off x="0" y="0"/>
                                                        <a:ext cx="1736725" cy="0"/>
                                                    </a:xfrm>
                                                    <a:prstGeom prst="line">
                                                        <a:avLst/>
                                                    </a:prstGeom>
                                                    <a:ln>
                                                        <a:solidFill>
                                                            <a:srgbClr val="55DD94"/>
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
                        <w:r w:rsidR="00CC7FCE">
                            <w:t>Overige werkervaring</w:t>
                        </w:r>
                    </w:p>
                    <w:tbl>
                        <w:tblPr>
                            <w:tblStyle w:val="Tabelraster"/>
                            <w:tblW w:w="523.90pt" w:type="dxa"/>
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
                            <w:gridCol w:w="1354"/>
                            <w:gridCol w:w="2084"/>
                            <w:gridCol w:w="3520"/>
                            <w:gridCol w:w="3520"/>
                        </w:tblGrid>
                        <w:tr w:rsidR="001405E4" w14:paraId="17C239C3" w14:textId="5C5CDE99" w:rsidTr="001405E4">
                            <w:trPr>
                                <w:trHeight w:val="14"/>
                            </w:trPr>
                            <w:tc>
                                <w:tcPr>
                                    <w:tcW w:w="67.70pt" w:type="dxa"/>
                                    <w:vAlign w:val="center"/>
                                </w:tcPr>
                                <w:p w14:paraId="4B7F5E6F" w14:textId="77777777" w:rsidR="001405E4" w:rsidRPr="00D51FD7"
                                     w:rsidRDefault="001405E4" w:rsidP="00926161">
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
                                        <w:t>Periode</w:t>
                                    </w:r>
                                </w:p>
                            </w:tc>
                            <w:tc>
                                <w:tcPr>
                                    <w:tcW w:w="104.20pt" w:type="dxa"/>
                                    <w:vAlign w:val="center"/>
                                </w:tcPr>
                                <w:p w14:paraId="7056AB27" w14:textId="77777777" w:rsidR="001405E4" w:rsidRPr="00D51FD7"
                                     w:rsidRDefault="001405E4" w:rsidP="00926161">
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
                                    <w:tcW w:w="176pt" w:type="dxa"/>
                                    <w:vAlign w:val="center"/>
                                </w:tcPr>
                                <w:p w14:paraId="47F0F5CC" w14:textId="77777777" w:rsidR="001405E4" w:rsidRPr="00D51FD7"
                                     w:rsidRDefault="001405E4" w:rsidP="00926161">
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
                                    <w:tcW w:w="176pt" w:type="dxa"/>
                                </w:tcPr>
                                <w:p w14:paraId="71D46AA5" w14:textId="5C96D0FE" w:rsidR="001405E4"
                                     w:rsidRDefault="001405E4"
                                     w:rsidP="00926161">
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

                        <xsl:apply-templates select="$experienceOverviewItems" mode="overview">
                            <xsl:sort select="cv:sortIndex" data-type="number"/>
                        </xsl:apply-templates>

                    </w:tbl>
                </xsl:if>
                <!--

                PUBLICATIONS AND REFERENCES

                -->
                <xsl:variable name="publications" select="cv:publication[cv:includeInCv = 'true']"/>
                <xsl:variable name="references" select="cv:reference[cv:includeInCv = 'true']"/>
                <xsl:if test="$publications or $references">
                    <w:p w14:paraId="78E9113D" w14:textId="4F1BB34C" w:rsidR="00CC7FCE" w:rsidRPr="00926161"
                         w:rsidRDefault="00CC7FCE" w:rsidP="00926161">
                        <w:pPr>
                            <w:pStyle w:val="Titel1"/>
                        </w:pPr>
                        <w:r>
                            <w:br w:type="page"/>
                        </w:r>
                    </w:p>
                    <w:p w14:paraId="1FE1FD17" w14:textId="77777777" w:rsidR="00CC7FCE" w:rsidRDefault="00CC7FCE"
                         w:rsidP="00B2333C">
                        <w:pPr>
                            <w:pStyle w:val="Titel1"/>
                            <w:sectPr w:rsidR="00CC7FCE" w:rsidSect="00CC7FCE">
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
                         w:rsidP="00B2333C">
                        <w:pPr>
                            <w:pStyle w:val="Titel1"/>
                            <w:sectPr w:rsidR="00CC7FCE" w:rsidSect="00CC7FCE">
                                <w:type w:val="continuous"/>
                                <w:pgSz w:w="595.30pt" w:h="841.90pt"/>
                                <w:pgMar w:top="72pt" w:right="26.95pt" w:bottom="72pt" w:left="36.55pt"
                                         w:header="35.45pt"
                                         w:footer="2.85pt" w:gutter="0pt"/>
                                <w:cols w:space="17.45pt"/>
                                <w:docGrid w:linePitch="360"/>
                            </w:sectPr>
                        </w:pPr>
                    </w:p>
                    <!--

                    PUBLICATIONS

                    -->
                    <xsl:if test="$publications">
                        <w:p w14:paraId="096EEC3B" w14:textId="294E664E" w:rsidR="00CA43CD" w:rsidRDefault="00065B83"
                             w:rsidP="00B2333C">
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
                                               allowOverlap="1"
                                               wp14:anchorId="2352FD51" wp14:editId="2E252DA5">
                                        <wp:simplePos x="0" y="0"/>
                                        <wp:positionH relativeFrom="column">
                                            <wp:posOffset>-636</wp:posOffset>
                                        </wp:positionH>
                                        <wp:positionV relativeFrom="paragraph">
                                            <wp:posOffset>233045</wp:posOffset>
                                        </wp:positionV>
                                        <wp:extent cx="942975" cy="0"/>
                                        <wp:effectExtent l="0" t="12700" r="22225" b="12700"/>
                                        <wp:wrapNone/>
                                        <wp:docPr id="85812222" name="Straight Connector 15"/>
                                        <wp:cNvGraphicFramePr/>
                                        <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                            <a:graphicData
                                                    uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                                <wp:wsp>
                                                    <wp:cNvCnPr/>
                                                    <wp:spPr>
                                                        <a:xfrm>
                                                            <a:off x="0" y="0"/>
                                                            <a:ext cx="942975" cy="0"/>
                                                        </a:xfrm>
                                                        <a:prstGeom prst="line">
                                                            <a:avLst/>
                                                        </a:prstGeom>
                                                        <a:ln>
                                                            <a:solidFill>
                                                                <a:srgbClr val="55DD94"/>
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
                            <w:r w:rsidR="00CC7FCE">
                                <w:t>Publicaties</w:t>
                            </w:r>
                        </w:p>
                        <w:p w14:paraId="3D45720F" w14:textId="77777777" w:rsidR="00CC7FCE" w:rsidRDefault="00CC7FCE"
                             w:rsidP="00CC7FCE">
                            <w:pPr>
                                <w:rPr>
                                    <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                    <w:b/>
                                    <w:bCs/>
                                    <w:color w:val="212B46"/>
                                    <w:sz w:val="28"/>
                                    <w:szCs w:val="28"/>
                                </w:rPr>
                            </w:pPr>
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
                                </w:rPr>
                                <w:sectPr w:rsidR="00CA43CD" w:rsidRPr="00D51FD7" w:rsidSect="00CA43CD">
                                    <w:type w:val="continuous"/>
                                    <w:pgSz w:w="595.30pt" w:h="841.90pt"/>
                                    <w:pgMar w:top="72pt" w:right="26.95pt" w:bottom="72pt" w:left="36.55pt"
                                             w:header="35.45pt"
                                             w:footer="2.85pt" w:gutter="0pt"/>
                                    <w:cols w:space="17.45pt"/>
                                    <w:docGrid w:linePitch="360"/>
                                </w:sectPr>
                            </w:pPr>
                        </w:p>

                        <xsl:apply-templates select="$publications"/>
                    </xsl:if>
                    <!--

                    REFERENCES

                    -->
                    <xsl:if test="$references">
                        <w:p w14:paraId="096EEC3B" w14:textId="294E664E" w:rsidR="00CA43CD" w:rsidRDefault="00065B83"
                             w:rsidP="00B2333C">
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
                                               allowOverlap="1"
                                               wp14:anchorId="2352FD51" wp14:editId="2E252DA5">
                                        <wp:simplePos x="0" y="0"/>
                                        <wp:positionH relativeFrom="column">
                                            <wp:posOffset>-636</wp:posOffset>
                                        </wp:positionH>
                                        <wp:positionV relativeFrom="paragraph">
                                            <wp:posOffset>233045</wp:posOffset>
                                        </wp:positionV>
                                        <wp:extent cx="942975" cy="0"/>
                                        <wp:effectExtent l="0" t="12700" r="22225" b="12700"/>
                                        <wp:wrapNone/>
                                        <wp:docPr id="85812222" name="Straight Connector 15"/>
                                        <wp:cNvGraphicFramePr/>
                                        <a:graphic xmlns:a="http://purl.oclc.org/ooxml/drawingml/main">
                                            <a:graphicData
                                                    uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                                <wp:wsp>
                                                    <wp:cNvCnPr/>
                                                    <wp:spPr>
                                                        <a:xfrm>
                                                            <a:off x="0" y="0"/>
                                                            <a:ext cx="942975" cy="0"/>
                                                        </a:xfrm>
                                                        <a:prstGeom prst="line">
                                                            <a:avLst/>
                                                        </a:prstGeom>
                                                        <a:ln>
                                                            <a:solidFill>
                                                                <a:srgbClr val="55DD94"/>
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
                            <w:r w:rsidR="00CC7FCE">
                                <w:t>Referenties</w:t>
                            </w:r>
                        </w:p>
                        <w:p w14:paraId="3D45720F" w14:textId="77777777" w:rsidR="00CC7FCE" w:rsidRDefault="00CC7FCE"
                             w:rsidP="00CC7FCE">
                            <w:pPr>
                                <w:rPr>
                                    <w:rFonts w:ascii="Plus Jakarta Sans" w:hAnsi="Plus Jakarta Sans"/>
                                    <w:b/>
                                    <w:bCs/>
                                    <w:color w:val="212B46"/>
                                    <w:sz w:val="28"/>
                                    <w:szCs w:val="28"/>
                                </w:rPr>
                            </w:pPr>
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
                                </w:rPr>
                                <w:sectPr w:rsidR="00CA43CD" w:rsidRPr="00D51FD7" w:rsidSect="00CA43CD">
                                    <w:type w:val="continuous"/>
                                    <w:pgSz w:w="595.30pt" w:h="841.90pt"/>
                                    <w:pgMar w:top="72pt" w:right="26.95pt" w:bottom="72pt" w:left="36.55pt"
                                             w:header="35.45pt"
                                             w:footer="2.85pt" w:gutter="0pt"/>
                                    <w:cols w:space="17.45pt"/>
                                    <w:docGrid w:linePitch="360"/>
                                </w:sectPr>
                            </w:pPr>
                        </w:p>

                        <xsl:apply-templates select="$references"/>
                    </xsl:if>
                </xsl:if>
                <w:sectPr w:rsidR="00CC7FCE" w:rsidRPr="00CC7FCE" w:rsidSect="00CC7FCE">
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