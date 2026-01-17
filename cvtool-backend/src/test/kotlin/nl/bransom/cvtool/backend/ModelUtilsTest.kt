package nl.bransom.cvtool.backend

import io.vertx.core.json.JsonObject
import nl.bransom.cvtool.backend.ModelUtils.jsonToXml
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.io.StringWriter
import javax.xml.stream.XMLOutputFactory

internal class ModelUtilsTest {

    @Test
    fun jsonToXml() {
        val json = JsonObject(javaClass.getResource("/test-cv.json")!!.readText())
        val expectedXml = javaClass.getResource("/test-cv.xml")!!.readText()

        val writer = StringWriter()
        val xmlWriter = XMLOutputFactory.newInstance().createXMLStreamWriter(writer)
        jsonToXml(json, xmlWriter, "https://ns.bransom.nl/cerios/cv/v20250808.xsd")
        assertEquals(expectedXml, writer.toString())
    }
}