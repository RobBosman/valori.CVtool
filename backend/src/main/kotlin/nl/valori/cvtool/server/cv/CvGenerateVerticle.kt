package nl.valori.cvtool.server.cv

import io.reactivex.Flowable
import io.reactivex.Single
import io.reactivex.schedulers.Schedulers
import io.vertx.core.Promise
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.server.ModelUtils.jsonToXml
import org.slf4j.LoggerFactory
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.util.Base64
import java.util.zip.ZipEntry
import java.util.zip.ZipInputStream
import java.util.zip.ZipOutputStream
import javax.xml.stream.XMLOutputFactory
import javax.xml.transform.Templates
import javax.xml.transform.TransformerFactory
import javax.xml.transform.stream.StreamResult
import javax.xml.transform.stream.StreamSource

const val CV_GENERATE_ADDRESS = "cv.generate"

internal class CvGenerateVerticle : AbstractVerticle() {

  companion object {
    internal const val CV_XML_NAMESPACE = "https://ns.bransom.nl/valori/cv/v20201130.xsd"
    internal val allLocales = setOf("nl_NL", "uk_UK")

    private val log = LoggerFactory.getLogger(CvGenerateVerticle::class.java)
    private val deliveryOptions = DeliveryOptions().setSendTimeout(2_000)

    private val xslIncludesMap = mapOf(
        "common.xsl" to loadBytes("/docx/Valori/common.xsl"),
        "common-nl_NL.xsl" to loadBytes("/docx/Valori/nl_NL/common-nl_NL.xsl"),
        "common-uk_UK.xsl" to loadBytes("/docx/Valori/uk_UK/common-uk_UK.xsl")
    )

    private fun loadBytes(location: String) =
        CvGenerateVerticle::class.java.getResource(location).readBytes()

    private val transformerFactory =
        TransformerFactory
            .newInstance()
            .also {
              it.setURIResolver { href, _ ->
                val xslt = xslIncludesMap.getOrElse(href.substringAfterLast("/")) {
                  throw IllegalArgumentException("Cannot find XSLT $href.")
                }
                StreamSource(ByteArrayInputStream(xslt))
              }
            }

    internal fun createXslTemplate(location: String) =
        transformerFactory.newTemplates(StreamSource(ByteArrayInputStream(loadBytes(location))))

    private fun createDocxPartNamesXslTemplatesMap(locale: String) =
        mapOf(
            "docProps/core.xml" to createXslTemplate("/docx/Valori/$locale/docProps/core.xml.xsl"),
            "word/document.xml" to createXslTemplate("/docx/Valori/$locale/word/document.xml.xsl"),
            "word/footer1.xml" to createXslTemplate("/docx/Valori/$locale/word/footer1.xml.xsl"),
            "word/footer2.xml" to createXslTemplate("/docx/Valori/$locale/word/footer2.xml.xsl"),
            "word/header2.xml" to createXslTemplate("/docx/Valori/$locale/word/header2.xml.xsl")
        )

    private val docxTemplate = loadBytes("/docx/Valori/template.docx")
    private val docxPartNamesXslTemplatesMap = mapOf(
        "nl_NL" to createDocxPartNamesXslTemplatesMap("nl_NL"),
        "uk_UK" to createDocxPartNamesXslTemplatesMap("uk_UK"),
    )

    internal fun xslTransform(xmlBytes: ByteArray, xslTemplate: Templates): ByteArray {
      ByteArrayInputStream(xmlBytes)
          .use { xml ->
            ByteArrayOutputStream()
                .use { result ->
                  xslTemplate
                      .newTransformer()
                      .transform(StreamSource(xml), StreamResult(result))
                  return result.toByteArray()
                }
          }
    }
  }

  override fun start(startPromise: Promise<Void>) {
    vertx.eventBus()
        .consumer<JsonObject>(CV_GENERATE_ADDRESS)
        .toObservable()
        .doOnSubscribe { startPromise.complete() }
        .subscribe(
            {
              handleRequest(it)
            },
            {
              log.error("Vertx error in CvGenerateVerticle")
              startPromise.fail(it)
            }
        )
  }

  private fun handleRequest(message: Message<JsonObject>) {
    val locale = message.body().getString("locale", "nl_NL")
    Single
        .just(message.body())
        .flatMap(::fetchCvData)
        .flatMap { cvJson ->
          xmlToDocx(convertToXml(cvJson), locale)
              .map { docxBytes ->
                JsonObject()
                    .put("fileName", composeFileName(cvJson, locale))
                    .put("docxB64", String(Base64.getEncoder().encode(docxBytes)))
              }
        }
        .subscribe(
            {
              log.debug("Successfully generated cv data")
              message.reply(it)
            },
            {
              val errorMsg = "Error generating cv data: ${it.message}"
              log.warn(errorMsg)
              message.fail(RECIPIENT_FAILURE.toInt(), errorMsg)
            }
        )
  }

  private fun fetchCvData(requestData: JsonObject): Single<JsonObject> =
      vertx.eventBus()
          .rxRequest<JsonObject>(CV_FETCH_ADDRESS, requestData, deliveryOptions)
          .map { it.body() }

  internal fun convertToXml(json: JsonObject): ByteArray {
    val writer = ByteArrayOutputStream()
    jsonToXml(json, XMLOutputFactory.newInstance().createXMLStreamWriter(writer), CV_XML_NAMESPACE)
    return writer.toByteArray()
  }

  internal fun xmlToDocx(xmlBytes: ByteArray, locale: String) =
      Flowable
          .fromIterable(docxPartNamesXslTemplatesMap[locale]!!.entries)
          .parallel()
          .runOn(Schedulers.computation())
          .map { entry -> entry.key to xslTransform(xmlBytes, entry.value) }
          .sequential()
          .reduce(HashMap<String, ByteArray>()) { map, (docxEntryName, xsltBytes) ->
            map[docxEntryName] = xsltBytes
            map
          }
          .map { xsltMap ->
            val docxBytes = ByteArrayOutputStream()
            ZipOutputStream(docxBytes)
                .use { docxOutputStream ->
                  ZipInputStream(ByteArrayInputStream(docxTemplate))
                      .use { zipIn ->
                        var entry = zipIn.nextEntry
                        while (entry != null) {

                          docxOutputStream.putNextEntry(ZipEntry(entry.name))
                          docxOutputStream.write(xsltMap.getOrElse(entry.name) { zipIn.readAllBytes() })
                          docxOutputStream.closeEntry()

                          zipIn.closeEntry()
                          entry = zipIn.nextEntry
                        }
                      }
                }
            docxBytes.toByteArray()
          }

  private fun composeFileName(cvEntities: JsonObject, locale: String): String {
    val name = when (val accountInstances = cvEntities.getValue("account")) {
      is JsonObject -> accountInstances.map.values
          .filterIsInstance(JsonObject::class.java)
          .first()
          .getString("name")
          .replace(" ", "")
      else -> ""
    }
    return "CV_${locale.substring(3)}_$name.docx"
  }
}