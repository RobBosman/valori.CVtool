<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:cv="https://ns.bransom.nl/valori/cv/v20201130.xsd"
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
        xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
        xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
        exclude-result-prefixes="cv"
        version="1.0">

    <xsl:output method="xml" standalone="yes" encoding="UTF-8" indent="no"/>

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
                    <w:id w:val="-118143501"/>
                    <w:docPartObj>
                        <w:docPartGallery w:val="Page Numbers (Bottom of Page)"/>
                        <w:docPartUnique/>
                    </w:docPartObj>
                </w:sdtPr>
                <w:sdtEndPr/>
                <w:sdtContent>
                    <w:p w14:paraId="422E78EF" w14:textId="4E452350" w:rsidR="006E0130" w:rsidRPr="006A76DB"
                         w:rsidRDefault="006E0130" w:rsidP="000A5FCA">
                        <w:pPr>
                            <w:pStyle w:val="Voettekst"/>
                            <w:ind w:right="709"/>
                            <w:jc w:val="center"/>
                        </w:pPr>
                        <w:r w:rsidRPr="006A76DB">
                            <w:t>
                                <xsl:text>Curriculum vitae of </xsl:text>
                                <xsl:value-of select="cv:name"/>
                            </w:t>
                        </w:r>
                        <w:r w:rsidRPr="006A76DB">
                            <w:rPr>
                                <w:rStyle w:val="TestCrew-IT-geel"/>
                            </w:rPr>
                            <w:t xml:space="preserve">&#xA0;// </w:t>
                        </w:r>
                        <w:r w:rsidRPr="006A76DB">
                            <w:t>TestCrew-IT</w:t>
                        </w:r>
                        <w:r w:rsidRPr="006A76DB">
                            <w:rPr>
                                <w:rStyle w:val="TestCrew-IT-geel"/>
                            </w:rPr>
                            <w:t xml:space="preserve">&#xA0;// </w:t>
                            <w:tab/>
                        </w:r>
                        <w:sdt>
                            <w:sdtPr>
                                <w:id w:val="-891891085"/>
                                <w:docPartObj>
                                    <w:docPartGallery w:val="Page Numbers (Top of Page)"/>
                                    <w:docPartUnique/>
                                </w:docPartObj>
                            </w:sdtPr>
                            <w:sdtEndPr/>
                            <w:sdtContent>
                                <w:r w:rsidRPr="006A76DB">
                                    <w:fldChar w:fldCharType="begin"/>
                                    <w:instrText>PAGE</w:instrText>
                                    <w:fldChar w:fldCharType="separate"/>
                                </w:r>
                                <w:r w:rsidR="008C7521">
                                    <w:rPr>
                                        <w:noProof/>
                                    </w:rPr>
                                    <w:t>3</w:t>
                                </w:r>
                                <w:r w:rsidRPr="006A76DB">
                                    <w:fldChar w:fldCharType="end"/>
                                    <w:t xml:space="preserve"> of </w:t>
                                    <w:fldChar w:fldCharType="begin"/>
                                    <w:instrText>NUMPAGES</w:instrText>
                                    <w:fldChar w:fldCharType="separate"/>
                                </w:r>
                                <w:r w:rsidR="008C7521">
                                    <w:rPr>
                                        <w:noProof/>
                                    </w:rPr>
                                    <w:t>3</w:t>
                                </w:r>
                                <w:r w:rsidRPr="006A76DB">
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