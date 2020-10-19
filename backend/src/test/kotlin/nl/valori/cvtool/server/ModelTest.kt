package nl.valori.cvtool.server

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.Model.jsonToXml
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.io.StringWriter
import javax.xml.stream.XMLOutputFactory

internal class ModelTest {

  @Test
  fun jsonToXml() {
    val json = JsonObject(javaClass.getResource("/cv.json").readText())
    val expectedXml = javaClass.getResource("/cv.xml").readText()

    val writer = StringWriter()
    val xmlWriter = XMLOutputFactory.newInstance().createXMLStreamWriter(writer)
    jsonToXml(json, xmlWriter)
    assertEquals(expectedXml, writer.toString())
  }
}