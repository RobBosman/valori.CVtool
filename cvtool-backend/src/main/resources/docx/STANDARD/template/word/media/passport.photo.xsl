<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:cv="https://ns.bransom.nl/cerios/cv/v20260101.xsd"
        exclude-result-prefixes="cv"
        version="1.0">

    <xsl:output method="text" standalone="yes" encoding="UTF-8" indent="no"/>

    <xsl:template match="/cv:root">
        <xsl:variable name="photo" select="cv:account/cv:photo"/>
        <xsl:if test="$photo and (cv:characteristics[cv:includeInCv = 'true']/cv:includePhotoInCv = 'true')">
            <!-- $photo = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAg...' -->
            <xsl:value-of select="substring-after($photo, 'base64,')"/>
        </xsl:if>
    </xsl:template>

</xsl:stylesheet>