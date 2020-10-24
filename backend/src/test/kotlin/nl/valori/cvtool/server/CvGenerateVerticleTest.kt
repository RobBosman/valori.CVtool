package nl.valori.cvtool.server

import org.junit.jupiter.api.Assertions.assertArrayEquals
import org.junit.jupiter.api.Test

internal class CvGenerateVerticleTest {

  @Test
  fun jsonToXml() {
    val xml = javaClass.getResource("/test-cv.xml").readBytes()
    val xslt = javaClass.getResource("/test.xsl").readBytes()
    val expectedResult = javaClass.getResource("/test-result.xml").readBytes()

    val result = CvGenerateVerticle.xslTransform(xml, xslt)
    assertArrayEquals(expectedResult, result)
  }
}