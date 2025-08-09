<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        version="1.0">

    <xsl:import href="translations.xsl"/>

    <xsl:param name="cv_locale"/>

    <xsl:variable name="dateSeparator">
        <xsl:choose>
            <xsl:when test="$cv_locale = 'uk_UK'">.</xsl:when>
            <xsl:otherwise>-</xsl:otherwise>
        </xsl:choose>
    </xsl:variable>

    <!-- DATE - NUMERIC (DD-MM-YYYY) -->
    <xsl:template match="* | @* | text()" mode="date-numeric">
        <xsl:value-of select="substring(., 9, 2)"/>
        <xsl:value-of select="$dateSeparator"/>
        <xsl:value-of select="substring(., 6, 2)"/>
        <xsl:value-of select="$dateSeparator"/>
        <xsl:value-of select="substring(., 1, 4)"/>
    </xsl:template>

    <!-- DATE - PERIOD (MM-YYYY) -->
    <xsl:template match="* | @* | text()" mode="date-month-year">
        <xsl:value-of select="substring(., 6, 2)"/>
        <xsl:value-of select="$dateSeparator"/>
        <xsl:value-of select="substring(., 1, 4)"/>
    </xsl:template>

    <!-- DATE - YEAR (YYYY) -->
    <xsl:template match="* | @* | text()" mode="date-year">
        <xsl:value-of select="substring(., 1, 4)"/>
    </xsl:template>

    <!-- DATE - TODAY -->
    <xsl:template match="* | @* | text()" mode="date-today">
        <xsl:call-template name="translate">
            <xsl:with-param name="text" select="'heden'"/>
        </xsl:call-template>
    </xsl:template>

    <!-- SKILL LEVEL -->
    <xsl:template match="* | @* | text()" mode="skill-level">
        <xsl:choose>
            <xsl:when test=". = 3"></xsl:when>
            <xsl:when test=". = 2"></xsl:when>
            <xsl:when test=". = 1"></xsl:when>
        </xsl:choose>
    </xsl:template>

    <!-- SKILL CATEGORY -->
    <xsl:template match="* | @* | text()" mode="skill-category">
        <xsl:call-template name="translate">
            <xsl:with-param name="text">
                <xsl:choose>
                    <xsl:when test=". = 'LANGUAGES'">Talenkennis</xsl:when>
                    <xsl:when test=". = 'BRANCHES'">Branches</xsl:when>
                    <xsl:when test=". = 'EXPERTISE'">Expertises</xsl:when>
                    <xsl:when test=". = 'DATABASES'">Databases</xsl:when>
                    <xsl:when test=". = 'APPLICATIONS'">Applicaties</xsl:when>
                    <xsl:when test=". = 'TOOLS'">Tools</xsl:when>
                    <xsl:when test=". = 'PROGRAMMING'">Programmeren</xsl:when>
                    <xsl:when test=". = 'METHODS'">Methodes</xsl:when>
                    <xsl:when test=". = 'OS_NETWORKS'">OS &amp; Netwerken</xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="."/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>

    <!-- EDUCATION RESULT -->
    <xsl:template match="* | @* | text()" mode="education-result">
        <xsl:call-template name="translate">
            <xsl:with-param name="text">
                <xsl:choose>
                    <xsl:when test=". = 'DIPLOMA'">ja</xsl:when>
                    <xsl:when test=". = 'CERTIFICATE'">ja</xsl:when>
                    <xsl:when test=". = 'ONGOING'">nog bezig</xsl:when>
                    <xsl:when test=". = 'CANCELED'">nee</xsl:when>
                    <xsl:when test=". = 'NOT_APPLICABLE'">nvt</xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="."/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>

</xsl:stylesheet>