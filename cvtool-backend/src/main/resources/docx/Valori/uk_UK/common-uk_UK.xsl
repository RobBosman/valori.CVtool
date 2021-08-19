<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:cv="https://ns.bransom.nl/valori/cv/v20201130.xsd"
        version="1.0">

    <!-- DATE - NUMERIC -->
    <xsl:template match="* | @* | text()" mode="date-numeric">
        <xsl:value-of select="substring(., 9, 2)"/>
        <xsl:text>.</xsl:text>
        <xsl:value-of select="substring(., 6, 2)"/>
        <xsl:text>.</xsl:text>
        <xsl:value-of select="substring(., 1, 4)"/>
    </xsl:template>

    <!-- DATE - PERIOD -->
    <xsl:template match="* | @* | text()" mode="date-period">
        <xsl:value-of select="substring(., 6, 2)"/>
        <xsl:text>.</xsl:text>
        <xsl:value-of select="substring(., 1, 4)"/>
    </xsl:template>

    <!-- PERIOD - BEGIN / END -->
    <xsl:template name="period">
        <xsl:param name="periodBegin"/>
        <xsl:param name="periodEnd"/>
        <xsl:if test="$periodBegin">
            <xsl:apply-templates select="$periodBegin" mode="date-period"/>
            <xsl:text> – </xsl:text>
        </xsl:if>
        <xsl:choose>
            <xsl:when test="$periodEnd">
                <xsl:apply-templates select="$periodEnd" mode="date-period"/>
            </xsl:when>
            <xsl:otherwise>today</xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <!-- LOCALE PLACEHOLDER -->
    <xsl:template match="node()" mode="locale-placeholder">
        <xsl:choose>
            <xsl:when test="cv:uk_UK">
                <xsl:value-of select="cv:uk_UK"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="cv:nl_NL"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <!-- SKILL CATEGORY -->
    <xsl:template match="* | @* | text()" mode="skill-category">
        <xsl:choose>
            <xsl:when test=". = 'LANGUAGES'">Languages</xsl:when>
            <xsl:when test=". = 'BRANCHES'">Branches</xsl:when>
            <xsl:when test=". = 'EXPERTISE'">Expertises</xsl:when>
            <xsl:when test=". = 'DATABASES'">Databases</xsl:when>
            <xsl:when test=". = 'APPLICATIONS'">Applications</xsl:when>
            <xsl:when test=". = 'TOOLS'">Tools</xsl:when>
            <xsl:when test=". = 'PROGRAMMING'">Programming</xsl:when>
            <xsl:when test=". = 'METHODS'">Methods</xsl:when>
            <xsl:when test=". = 'OS_NETWORKS'">OS &amp; Networks</xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="."/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <!-- EDUCATION RESULT -->
    <xsl:template match="* | @* | text()" mode="education-result">
        <xsl:choose>
            <xsl:when test=". = 'DIPLOMA'">diploma</xsl:when>
            <xsl:when test=". = 'CERTIFICATE'">certificate</xsl:when>
            <xsl:when test=". = 'ONGOING'">busy</xsl:when>
            <xsl:when test=". = 'CANCELED'">cancelled</xsl:when>
            <xsl:when test=". = 'NOT_APPLICABLE'">n/a</xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="."/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

</xsl:stylesheet>