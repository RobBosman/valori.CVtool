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
               xmlns:w="http://purl.oclc.org/ooxml/wordprocessingml/main"
               xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
               mc:Ignorable="w14">
            <w:p w14:paraId="6755C19D" w14:textId="3E3550AF" w:rsidR="00307129" w:rsidRPr="002251BB"
                 w:rsidRDefault="00307129"
                 w:rsidP="002251BB">
                <w:pPr>
                    <w:pStyle w:val="Voettekst"/>
                    <w:tabs>
                        <w:tab w:val="clear" w:pos="225.65pt"/>
                        <w:tab w:val="clear" w:pos="451.30pt"/>
                        <w:tab w:val="start" w:pos="0pt"/>
                    </w:tabs>
                    <w:ind w:end="-7.10pt"/>
                    <w:jc w:val="center"/>
                    <w:rPr>
                        <w:sz w:val="18"/>
                        <w:szCs w:val="18"/>
                    </w:rPr>
                </w:pPr>
                <w:r w:rsidRPr="002251BB">
                    <w:rPr>
                        <w:sz w:val="18"/>
                        <w:szCs w:val="18"/>
                    </w:rPr>
                    <w:t>
                        <xsl:call-template name="translate">
                            <xsl:with-param name="text" select="'CONTACTPERSOON'"/>
                        </xsl:call-template>
                    </w:t>
                </w:r>
                <w:r w:rsidRPr="002251BB">
                    <w:rPr>
                        <w:sz w:val="18"/>
                        <w:szCs w:val="18"/>
                    </w:rPr>
                    <w:tab/>
                    <w:t>
                        <xsl:value-of select="cv:businessUnit/cv:contactName"/>
                    </w:t>
                </w:r>
                <w:proofErr w:type="spellEnd"/>
                <w:r w:rsidRPr="002251BB">
                    <w:rPr>
                        <w:sz w:val="18"/>
                        <w:szCs w:val="18"/>
                    </w:rPr>
                    <w:tab/>
                    <w:t>
                        <xsl:value-of select="cv:businessUnit/cv:contactPhone"/>
                    </w:t>
                    <w:tab/>
                </w:r>
                <w:hyperlink r:id="rId1" w:history="1">
                    <w:r w:rsidRPr="002251BB">
                        <w:rPr>
                            <w:rStyle w:val="Hyperlink"/>
                            <w:sz w:val="18"/>
                            <w:szCs w:val="18"/>
                        </w:rPr>
                        <w:t>
                            <xsl:value-of select="cv:businessUnit/cv:contactEmail"/>
                        </w:t>
                    </w:r>
                </w:hyperlink>
            </w:p>
        </w:ftr>
    </xsl:template>

</xsl:stylesheet>