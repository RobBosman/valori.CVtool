package nl.valori.cvtool.server

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.ModelUtils.jsonToXml
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.io.StringWriter
import javax.xml.stream.XMLOutputFactory

internal class ModelUtilsTest {

  @Test
  fun jsonToXml() {
    val json = JsonObject(javaClass.getResource("/test-cv.json").readText())
    val expectedXml = javaClass.getResource("/test-cv.xml").readText()

    val writer = StringWriter()
    val xmlWriter = XMLOutputFactory.newInstance().createXMLStreamWriter(writer)
    jsonToXml(json, xmlWriter, "https://ns.bransom.nl/valori/cv/v20201022.xsd")
    assertEquals(expectedXml, writer.toString())
  }
}