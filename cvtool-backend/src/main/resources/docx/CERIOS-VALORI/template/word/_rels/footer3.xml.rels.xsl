<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:cv="https://ns.bransom.nl/valori/cv/v20250808.xsd"
        exclude-result-prefixes="cv"
        version="1.0">

    <xsl:output method="xml" standalone="yes" encoding="UTF-8" indent="no"/>

    <xsl:template match="/cv:root">
        <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
            <Relationship Id="rId1" Type="http://purl.oclc.org/ooxml/officeDocument/relationships/hyperlink"
                          TargetMode="External">
                <xsl:attribute name="Target">
                    <xsl:text>mailto:</xsl:text>
                    <xsl:value-of select="cv:businessUnit/cv:contactEmail"/>
                </xsl:attribute>
            </Relationship>
        </Relationships>
    </xsl:template>

</xsl:stylesheet>