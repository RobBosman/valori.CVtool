<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:cv="https://ns.bransom.nl/valori/cv/v20250808.xsd"
        exclude-result-prefixes="cv"
        version="1.0">

    <xsl:output method="xml" standalone="yes" encoding="UTF-8" indent="no"/>

    <xsl:template match="/">
        <xsl:apply-templates select="cv:root/cv:account"/>
    </xsl:template>

    <xsl:template match="cv:account">
        <cp:coreProperties
                xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
                xmlns:dc="http://purl.org/dc/elements/1.1/"
                xmlns:dcterms="http://purl.org/dc/terms/">
            <dc:title/>
            <dc:subject/>
            <dc:creator>
                <xsl:value-of select="cv:name"/>
            </dc:creator>
            <cp:keywords>CV</cp:keywords>
            <dc:description/>
            <cp:revision>1</cp:revision>
            <dcterms:created xsi:type="dcterms:W3CDTF">2024-04-01T00:00:00Z</dcterms:created>
        </cp:coreProperties>
    </xsl:template>

</xsl:stylesheet>