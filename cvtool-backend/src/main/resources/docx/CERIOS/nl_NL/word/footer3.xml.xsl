<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:cv="https://ns.bransom.nl/valori/cv/v20201130.xsd"
        exclude-result-prefixes="cv"
        version="1.0">

    <xsl:output method="xml" standalone="yes" encoding="UTF-8" indent="no"/>

    <xsl:template match="/">
        <xsl:apply-templates select="cv:root/cv:account"/>
    </xsl:template>

    <xsl:template match="cv:account">
        <w:ftr
                xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
                xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
                xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
                xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
                mc:Ignorable="w14 w15 w16se w16cid w16 w16cex w16sdtdh w16sdtfl w16du wp14">
            <w:p w14:paraId="1D2C1A6E" w14:textId="77777777" w:rsidR="00B97911" w:rsidRPr="002251BB" w:rsidRDefault="00000000"
                 w:rsidP="002251BB">
                <w:pPr>
                    <w:pStyle w:val="Voettekst"/>
                    <w:tabs>
                        <w:tab w:val="clear" w:pos="4513"/>
                        <w:tab w:val="clear" w:pos="9026"/>
                        <w:tab w:val="left" w:pos="0"/>
                        <w:tab w:val="left" w:pos="2410"/>
                        <w:tab w:val="left" w:pos="6804"/>
                        <w:tab w:val="left" w:pos="8364"/>
                    </w:tabs>
                    <w:ind w:right="-142"/>
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
                    <w:t>CONTACTPERSOON</w:t>
                </w:r>
                <w:r w:rsidRPr="002251BB">
                    <w:rPr>
                        <w:sz w:val="18"/>
                        <w:szCs w:val="18"/>
                    </w:rPr>
                    <w:tab/>
                    <w:t xml:space="preserve">Barend James Willem van den Nagtegaal</w:t>
                </w:r>
                <w:proofErr w:type="spellEnd"/>
                <w:r w:rsidRPr="002251BB">
                    <w:rPr>
                        <w:sz w:val="18"/>
                        <w:szCs w:val="18"/>
                    </w:rPr>
                    <w:tab/>
                    <w:t>06-12979061</w:t>
                </w:r>
                <w:r w:rsidRPr="002251BB">
                    <w:rPr>
                        <w:sz w:val="18"/>
                        <w:szCs w:val="18"/>
                    </w:rPr>
                    <w:tab/>
                </w:r>
                <w:hyperlink r:id="rId1" w:history="1">
                    <w:r w:rsidRPr="002251BB">
                        <w:rPr>
                            <w:rStyle w:val="Hyperlink"/>
                            <w:sz w:val="18"/>
                            <w:szCs w:val="18"/>
                        </w:rPr>
                        <w:t>barend@cerios.nl</w:t>
                    </w:r>
                </w:hyperlink>
            </w:p>
        </w:ftr>
    </xsl:template>

</xsl:stylesheet>