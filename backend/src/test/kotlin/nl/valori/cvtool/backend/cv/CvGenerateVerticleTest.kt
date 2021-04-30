package nl.valori.cvtool.backend.cv

import io.vertx.core.json.JsonObject
import org.junit.jupiter.api.Assertions.assertArrayEquals
import org.junit.jupiter.api.Test
import java.util.stream.IntStream

internal class CvGenerateVerticleTest {

    @Test
    fun jsonToXml() {
        val xml = javaClass.getResource("/test-cv.xml")!!.readBytes()
        val xslt = CvGenerateVerticle.createXslTemplate("/test.xsl")
        val expectedResult = javaClass.getResource("/test-result.xml")!!.readBytes()

        val result = CvGenerateVerticle.xslTransform(xml, xslt)
        assertArrayEquals(expectedResult, result)
    }

    @Test
    fun generateDocx() {
        val json = JsonObject(javaClass.getResource("/test-cv.json")!!.readText()) // 14bfa6bb-1487-3e45-bba0-28a21ed38046
        val generator = CvGenerateVerticle()

        val numGenerations = 1000
        val startMillis = System.currentTimeMillis()
        IntStream.range(0, numGenerations).forEach {
            generator.xmlToDocx(generator.convertToXml(json), "nl_NL")
        }
        println("generating $numGenerations cvs took ${System.currentTimeMillis() - startMillis} ms")
    }
}