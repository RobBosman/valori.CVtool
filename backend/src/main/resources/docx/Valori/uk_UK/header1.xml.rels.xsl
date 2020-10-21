<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:cv="https://ns.bransom.nl/cerios/cv/v20110401"
  xmlns="http://schemas.openxmlformats.org/package/2006/relationships"
  exclude-result-prefixes="cv"
  version="1.0">

  <xsl:import href="common-per-locale.xsl" />

  <xsl:param name="layout" />

  <xsl:output method="xml" standalone="yes" encoding="UTF-8" indent="no" />

  <xsl:template match="/">
    <Relationships>
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image1.gif"/>
    </Relationships>
  </xsl:template>

</xsl:stylesheet>