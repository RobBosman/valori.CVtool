<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:cv="https://ns.bransom.nl/valori/cv/v20250808.xsd"
        xmlns:java="http://xml.apache.org/xalan/java"
        version="1.0">

    <!-- SKILL LEVEL -->
    <xsl:template match="* | @* | text()" mode="skill-level">
        <xsl:choose>
            <xsl:when test=". = 3"></xsl:when>
            <xsl:when test=". = 2"></xsl:when>
            <xsl:when test=". = 1"></xsl:when>
        </xsl:choose>
    </xsl:template>

    <!-- WRAP LONG DESCRIPTION -->
    <xsl:template name="wrap-description">
        <xsl:param name="text"/>
        <xsl:param name="maxWidthMillis"/>
        <xsl:param name="newline"/>
        <xsl:call-template name="convert-newlines">
            <xsl:with-param name="text"
                            select="java:nl.valori.cvtool.backend.cv.XslUtils.wrapText($text, $maxWidthMillis)"/>
            <xsl:with-param name="newline" select="$newline"/>
        </xsl:call-template>
    </xsl:template>

    <xsl:template name="convert-newlines">
        <xsl:param name="text"/>
        <xsl:param name="newline"/>
        <xsl:choose>
            <xsl:when test="contains($text, '&#xA;')">
                <xsl:value-of select="substring-before($text, '&#xA;')"/>
                <xsl:copy-of select="$newline"/>
                <xsl:call-template name="convert-newlines">
                    <xsl:with-param name="text" select="substring-after($text, '&#xA;')"/>
                    <xsl:with-param name="newline" select="$newline"/>
                </xsl:call-template>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="$text"/>
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

</xsl:stylesheet>