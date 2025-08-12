<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:cv="https://ns.bransom.nl/valori/cv/v20250808.xsd"
        exclude-result-prefixes="cv"
        version="1.0">

    <xsl:output method="xml" standalone="yes" encoding="UTF-8" indent="no"/>

    <xsl:template match="/cv:root">
        <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
            <Default Extension="photo" ContentType="application/octet-stream"/>
            <Default Extension="jpeg" ContentType="image/jpeg"/>
            <Default Extension="jpg" ContentType="image/jpeg"/>
            <Default Extension="png" ContentType="image/png"/>
            <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
            <Default Extension="svg" ContentType="image/svg+xml"/>
            <Default Extension="xml" ContentType="application/xml"/>
            <Override PartName="/word/document.xml"
                      ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
            <Override PartName="/word/numbering.xml"
                      ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>
            <Override PartName="/word/styles.xml"
                      ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
            <Override PartName="/word/settings.xml"
                      ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
            <Override PartName="/word/webSettings.xml"
                      ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.webSettings+xml"/>
            <Override PartName="/word/footnotes.xml"
                      ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml"/>
            <Override PartName="/word/endnotes.xml"
                      ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml"/>
            <Override PartName="/word/header1.xml"
                      ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>
            <Override PartName="/word/header2.xml"
                      ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>
            <Override PartName="/word/footer1.xml"
                      ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>
            <Override PartName="/word/footer2.xml"
                      ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>
            <Override PartName="/word/header3.xml"
                      ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>
            <Override PartName="/word/footer3.xml"
                      ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>
            <Override PartName="/word/fontTable.xml"
                      ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml"/>
            <Override PartName="/word/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
            <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
            <Override PartName="/docProps/app.xml"
                      ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>

            <xsl:variable name="photo" select="cv:account/cv:photo"/>
            <Override PartName="/word/media/passport.photo">
                <xsl:attribute name="ContentType">
                    <xsl:choose>
                        <xsl:when test="$photo and (cv:characteristics[cv:includeInCv = 'true']/cv:includePhotoInCv = 'true')">
                            <!-- $photo = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAg...' -->
                            <xsl:value-of select="substring-before(substring-after($photo, 'data:'), ';base64')"/>
                        </xsl:when>
                        <xsl:otherwise>image/png</xsl:otherwise> <!-- dummy image of one transparent pixel -->
                    </xsl:choose>
                </xsl:attribute>
            </Override>
        </Types>
    </xsl:template>

</xsl:stylesheet>