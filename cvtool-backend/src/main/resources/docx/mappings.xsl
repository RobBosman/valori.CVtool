<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:cv="https://ns.bransom.nl/valori/cv/v20250808.xsd"
        exclude-result-prefixes="cv"
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

    <!-- PERIOD - BEGIN / END -->
    <xsl:template name="period">
        <xsl:param name="periodBegin"/>
        <xsl:param name="periodEnd"/>
        <xsl:if test="$periodBegin">
            <xsl:apply-templates select="$periodBegin" mode="date-month-year"/>
            <xsl:text> – </xsl:text>
        </xsl:if>
        <xsl:choose>
            <xsl:when test="$periodEnd">
                <xsl:apply-templates select="$periodEnd" mode="date-month-year"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:call-template name="translate">
                    <xsl:with-param name="text" select="'heden'"/>
                </xsl:call-template>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <!-- CLIENT -->
    <xsl:template match="cv:experience" mode="client">
        <xsl:choose>
            <xsl:when test="normalize-space(cv:client) != ''">
                <xsl:value-of select="cv:client"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="cv:employer"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <!-- SKILL LEVEL -->
    <xsl:template match="* | @* | text()" mode="skill-level">
        <xsl:choose>
            <xsl:when test=". = 3"></xsl:when>
            <xsl:when test=". = 2"></xsl:when>
            <xsl:when test=". = 1"></xsl:when>
        </xsl:choose>
    </xsl:template>

</xsl:stylesheet>