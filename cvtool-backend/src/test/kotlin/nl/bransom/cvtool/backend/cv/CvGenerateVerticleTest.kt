package nl.bransom.cvtool.backend.cv

import io.vertx.core.json.JsonObject
import nl.bransom.cvtool.backend.cv.CvGenerateVerticle.Companion.composeFileName
import org.junit.jupiter.api.Assertions.assertArrayEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.ValueSource
import java.util.stream.IntStream
import kotlin.test.assertEquals

internal class CvGenerateVerticleTest {
    companion object {
        private val TEST_JSON =
            JsonObject(javaClass.getResource("/test-cv.json")!!.readText()) // 14bfa6bb-1487-3e45-bba0-28a21ed38046
    }

    @ParameterizedTest
    @ValueSource(strings = ["CERIOS", "VALORI_CLASSIC"])
    fun jsonToXml(docxTemplate: String) {
        val xml = javaClass.getResource("/test-cv.xml")!!.readBytes()
        val xslt = CvGenerateVerticle.createXslTemplate(docxTemplate, "/test.xsl")
        val expectedResult = javaClass.getResource("/test-result-$docxTemplate.xml")!!.readBytes()

        val result = CvGenerateVerticle.xslTransform(xml, xslt, "nl_NL")
        assertArrayEquals(expectedResult, result)
    }

    @ParameterizedTest
    @ValueSource(strings = ["CERIOS", "VALORI_CLASSIC"])
    fun generateDocx(docxTemplate: String) {
        val generator = CvGenerateVerticle()

        val numGenerations = 100
        val startMillis = System.currentTimeMillis()
        IntStream.range(0, numGenerations).forEach {
            generator.xmlToDocx(generator.convertToDocxXml(TEST_JSON), docxTemplate, "nl_NL")
        }
        println("generating $numGenerations cvs took ${System.currentTimeMillis() - startMillis} ms")
    }

    @Test
    fun testFilename() {
        assertEquals(
            "CV_NL_PietjePuk.docx",
            composeFileName(TEST_JSON, "nl_NL", "CERIOS", null)
        )
        assertEquals(
            "CV_NL_PietjePuk_[VALORI-CLASSIC].docx",
            composeFileName(TEST_JSON, "nl_NL", "CERIOS", "VALORI-CLASSIC")
        )
        assertEquals(
            "CV_NL_PietjePuk_[CERIOS].docx",
            composeFileName(TEST_JSON, "nl_NL", "VALORI-CLASSIC", "CERIOS")
        )

        val specialJson = JsonObject(TEST_JSON.encodePrettily().replace("Pietje Puk", "Pietje|'van\\\\de/?*Puk"))
        assertEquals(
            "CV_NL_Pietje-van-de-Puk.docx",
            composeFileName(specialJson, "nl_NL", "CERIOS", null)
        )
    }
}