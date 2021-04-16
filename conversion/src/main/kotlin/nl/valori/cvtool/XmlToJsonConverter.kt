package nl.valori.cvtool

import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import java.io.StringWriter
import java.net.HttpURLConnection
import java.net.URL
import java.nio.file.Files
import java.nio.file.Path
import javax.xml.transform.TransformerFactory
import javax.xml.transform.stream.StreamResult
import javax.xml.transform.stream.StreamSource

fun main() = XmlToJsonConverter.run()

object XmlToJsonConverter {

    private const val REPLACE_EXISTING_DATA = true

    fun run() {
        val exportedDir = Path.of(".", "exported")
        val dataDumpDir = exportedDir.resolve("dump")
        val jsonDir = exportedDir.resolve("json")
        val accountsXml = dataDumpDir.resolve("accounts.xml")
        val businessUnitsXml = dataDumpDir.resolve("businessUnits.xml")

        if (REPLACE_EXISTING_DATA) {
            Files.deleteIfExists(exportedDir)
            Files.createDirectory(exportedDir)
            Files.createDirectory(dataDumpDir)
            Files.createDirectory(jsonDir)

            // Make sure PHP, nginx and MariaDB are running!
            download(
                "http://localhost:9080/bransom/REST/cv/_account.xml?\$skipBinaries=true&\$published=false",
                accountsXml
            )
            download(
                "http://localhost:9080/bransom/REST/cv/businessunit.xml?\$skipBinaries=true&\$published=false",
                businessUnitsXml
            )
        }

        convert(accountsXml.toUri().toURL(), jsonDir)
        convert(businessUnitsXml.toUri().toURL(), jsonDir)
    }

    private fun download(url: String, targetFile: Path) {
        val connection = URL(url).openConnection() as HttpURLConnection
        try {
            connection.inputStream.bufferedReader()
                .use { reader ->
                    val xmlData = reader.readText()
                    targetFile.toFile().writeText(xmlData)
                }
        } finally {
            connection.disconnect()
        }
    }

    private fun convert(sourceUrl: URL, targetDir: Path) {
        val jsonEntities = xslTransform(sourceUrl, javaClass.getResource("/xml-to-json.xsl")!!)
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