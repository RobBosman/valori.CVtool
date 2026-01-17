<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:cv="https://ns.bransom.nl/cerios/cv/v20250808.xsd"
        exclude-result-prefixes="cv"
        version="1.0">

    <xsl:import href="../../../translations.xsl"/>

    <xsl:output method="xml" standalone="yes" encoding="UTF-8" indent="no"/>

    <xsl:template match="/cv:root">
        <xsl:apply-templates select="cv:account"/>
    </xsl:template>

    <xsl:template match="cv:account">
        <w:ftr xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
               xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
               xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
               mc:Ignorable="w14">
            <w:sdt>
                <w:sdtPr>
                    <w:rPr>
                        <w:szCs w:val="16"/>
                    </w:rPr>
                    <w:id w:val="-121388785"/>
                    <w:docPartObj>
                        <w:docPartGallery w:val="Page Numbers (Bottom of Page)"/>
                        <w:docPartUnique/>
                    </w:docPartObj>
                </w:sdtPr>
                <w:sdtEndPr>
                    <w:rPr>
                        <w:szCs w:val="20"/>
                    </w:rPr>
                </w:sdtEndPr>
                <w:sdtContent>
                    <w:p w14:paraId="422E78FA" w14:textId="0108B5FC" w:rsidR="00940ACC" w:rsidRPr="00C0691A"
                         w:rsidRDefault="00C97881" w:rsidP="000A5FCA">
                        <w:pPr>
                            <w:pStyle w:val="Voettekst"/>
                            <w:ind w:right="709"/>
                            <w:jc w:val="center"/>
                        </w:pPr>
                        <w:r w:rsidRPr="00C0691A">
                            <w:t>
                                <xsl:call-template name="translate">
                                    <xsl:with-param name="text" select="'Curriculum vitae van'"/>
                                </xsl:call-template>
                                <xsl:text> </xsl:text>
                                <xsl:value-of select="cv:name"/>
                            </w:t>
                        </w:r>
                        <w:r w:rsidRPr="00C0691A">
                            <w:rPr>
                                <w:rStyle w:val="Cerios-geel"/>
                            </w:rPr>
                            <w:t xml:space="preserve">&#xA0;// </w:t>
                        </w:r>
                        <w:r w:rsidRPr="00C0691A">
                            <w:t>Valori</w:t>
                        </w:r>
                        <w:r w:rsidRPr="00C0691A">
                            <w:rPr>
                                <w:rStyle w:val="Cerios-geel"/>
                            </w:rPr>
                            <w:t xml:space="preserve">&#xA0;// </w:t>
                            <w:tab/>
                        </w:r>
                        <w:sdt>
                            <w:sdtPr>
                                <w:id w:val="-1033118212"/>
                                <w:docPartObj>
                                    <w:docPartGallery w:val="Page Numbers (Top of Page)"/>
                                    <w:docPartUnique/>
                                </w:docPartObj>
                            </w:sdtPr>
                            <w:sdtEndPr/>
                            <w:sdtContent>
                                <w:r w:rsidRPr="00C0691A">
                                    <w:fldChar w:fldCharType="begin"/>
                                    <w:instrText>PAGE</w:instrText>
                                    <w:fldChar w:fldCharType="separate"/>
                                </w:r>
                                <w:r w:rsidR="008C7521">
                                    <w:rPr>
                                        <w:noProof/>
                                    </w:rPr>
                                    <w:t>1</w:t>
                                </w:r>
                                <w:r w:rsidRPr="00C0691A">
                                    <w:fldChar w:fldCharType="end"/>
                                    <w:t xml:space="preserve"> van </w:t>
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
                                <w:r w:rsidRPr="00C0691A">
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