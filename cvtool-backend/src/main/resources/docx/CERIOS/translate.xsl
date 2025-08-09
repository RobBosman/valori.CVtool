<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        version="1.0">

    <!-- Parameter 'cv_locale' is used to select the correct language version of a text node. -->
    <xsl:param name="cv_locale"/>

    <!-- TRANSLATE -->
    <xsl:template name="translate">
        <xsl:param name="text"/>
        <xsl:choose>
            <xsl:when test="$cv_locale = 'uk_UK'">
                <xsl:choose>
                    <xsl:when test="$text = 'GEBOORTEDATUM'">DATE OF BIRTH</xsl:when>
                    <xsl:when test="$text = 'GEBOORTEDATUM'">DATE OF BIRTH</xsl:when>
                    <xsl:when test="$text = 'FUNCTIE'">ROLE</xsl:when>
                    <xsl:when test="$text = 'WOONPLAATS'">RESIDENCE</xsl:when>
                    <xsl:when test="$text = 'Persoonlijk profiel'">Personal profile</xsl:when>
                    <xsl:when test="$text = 'Interesses'">Interests</xsl:when>
                    <xsl:when test="$text = 'Kerncompetenties / skills'">Knowledge / skills</xsl:when>
                    <xsl:when test="$text = 'basis'">basic</xsl:when>
                    <xsl:when test="$text = 'gevorderd'">advanced</xsl:when>
                    <xsl:when test="$text = 'ervaren'">experienced</xsl:when>
                    <xsl:when test="$text = 'Opleiding &amp; trainingen'">Education &amp; training</xsl:when>
                    <xsl:when test="$text = 'Opleiding'">Education</xsl:when>
                    <xsl:when test="$text = 'Onderwijsinstelling'">Institution</xsl:when>
                    <xsl:when test="$text = 'Periode'">Period</xsl:when>
                    <xsl:when test="$text = 'Diploma'">Diploma</xsl:when>
                    <xsl:when test="$text = 'Trainingen'">Training</xsl:when>
                    <xsl:when test="$text = 'Opleidingsinstituut'">Institution</xsl:when>
                    <xsl:when test="$text = 'Certificaat'">Certificate</xsl:when>
                    <xsl:when test="$text = 'Werkervaring'">Working experience</xsl:when>
                    <xsl:when test="$text = 'Overige werkervaring'">Other working experience</xsl:when>
                    <xsl:when test="$text = 'Opdrachtgever'">Client</xsl:when>
                    <xsl:when test="$text = 'Publicaties'">Publications</xsl:when>
                    <xsl:when test="$text = 'Referenties'">References</xsl:when>

                    <xsl:when test="$text = 'CONTACTPERSOON'">CONTACT PERSON</xsl:when>
                    <xsl:when test="$text = 'heden'">today</xsl:when>
                    <xsl:when test="$text = 'Situatie'">Situation</xsl:when>
                    <xsl:when test="$text = 'Taken'">Tasks</xsl:when>
                    <xsl:when test="$text = 'Resultaten'">Results</xsl:when>
                    <xsl:when test="$text = 'Technologie &amp; tools'">Technology &amp; tools</xsl:when>

                    <xsl:when test="$text = 'Talenkennis'">Languages</xsl:when>
                    <xsl:when test="$text = 'Branches'">Branches</xsl:when>
                    <xsl:when test="$text = 'Expertises'">Expertise</xsl:when>
                    <xsl:when test="$text = 'Databases'">Databases</xsl:when>
                    <xsl:when test="$text = 'Applicaties'">Applications</xsl:when>
                    <xsl:when test="$text = 'Tools'">References</xsl:when>
                    <xsl:when test="$text = 'Programmeren'">Programming</xsl:when>
                    <xsl:when test="$text = 'Methodes'">Methodologies</xsl:when>
                    <xsl:when test="$text = 'OS &amp; Netwerken'">OS &amp; networks</xsl:when>

                    <xsl:when test="$text = 'ja'">yes</xsl:when>
                    <xsl:when test="$text = 'nog bezig'">busy</xsl:when>
                    <xsl:when test="$text = 'nee'">no</xsl:when>
                    <xsl:when test="$text = 'nvt'">n/a</xsl:when>

                    <xsl:otherwise>
                        <xsl:value-of select="$text"/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="$text"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

</xsl:stylesheet>