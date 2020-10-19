<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:cv="https://ns.bransom.nl/cerios/cv/v20110401"
    exclude-result-prefixes="cv"
    version="1.0">

  <xsl:output method="xml" encoding="utf-8" omit-xml-declaration="yes" indent="yes"/>

  <xsl:template match="node()|text()|@*">
    <xsl:copy-of select="."/>
  </xsl:template>

</xsl:stylesheet>