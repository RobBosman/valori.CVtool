package nl.valori.cvtool

import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import java.io.StringWriter
import java.net.URL
import java.nio.file.Files
import java.nio.file.Path
import java.util.*
import javax.xml.transform.TransformerFactory
import javax.xml.transform.stream.StreamResult
import javax.xml.transform.stream.StreamSource

fun main() = XmlToJsonConverter.run()

object XmlToJsonConverter {

  fun run() {
    val targetDir = Path.of("./exported-json")

    if (Files.exists(targetDir)) {
      val walkStream = Files.walk(targetDir)
      try {
        walkStream
            .sorted(Comparator.reverseOrder())
            .forEach(Files::deleteIfExists)
      } finally {
        walkStream.close()
      }
    }
    Files.createDirectory(targetDir)

    convert(XmlToJsonConverter::class.java.getResource("/businessunits.xml"), targetDir)
    convert(XmlToJsonConverter::class.java.getResource("/accounts.xml"), targetDir)
  }

  private fun convert(sourceUrl: URL, targetDir: Path) {
    val jsonEntities = xslTransform(sourceUrl,
        XmlToJsonConverter::class.java.getResource("/xml-to-json.xsl"))
    JsonObject(jsonEntities)
        .map
        .forEach { (entity, instances) ->
          val jsonInstances = JsonArray(instances as List<*>).encode()
          targetDir
              .resolve("$entity.json")
              .toFile().writeText(jsonInstances)
        }
  }

  private fun xslTransform(sourceUrl: URL, xsltUrl: URL): String {
    sourceUrl
        .openStream()
        .use { source ->
          xsltUrl
              .openStream()
              .use { xslt ->
                val result = StringWriter()
                TransformerFactory
                    .newInstance()
                    .newTransformer(StreamSource(xslt))
                    .transform(StreamSource(source), StreamResult(result))
                return result.toString()
              }
        }
  }
}