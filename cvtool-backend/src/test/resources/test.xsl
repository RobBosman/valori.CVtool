<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:cv="https://ns.bransom.nl/valori/cv/v20201130.xsd"
        xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
        exclude-result-prefixes="cv"
        version="1.0">

    <xsl:output method="xml" standalone="yes" encoding="UTF-8" indent="no"/>

    <xsl:template match="/">
        <xsl:apply-templates select="cv:root/cv:account"/>
    </xsl:template>

    <xsl:template match="cv:account">
        <w:t>
            <xsl:text>Curriculum vitae van </xsl:text>
            <xsl:value-of select="cv:name"/>
        </w:t>
    </xsl:template>

</xsl:stylesheet>