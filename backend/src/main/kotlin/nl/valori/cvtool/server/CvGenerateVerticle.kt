package nl.valori.cvtool.server

import io.reactivex.Single
import io.vertx.core.Promise
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.server.Model.jsonToXml
import org.slf4j.LoggerFactory
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.FileOutputStream
import java.util.zip.ZipEntry
import java.util.zip.ZipInputStream
import java.util.zip.ZipOutputStream
import javax.xml.stream.XMLOutputFactory
import javax.xml.transform.TransformerFactory
import javax.xml.transform.stream.StreamResult
import javax.xml.transform.stream.StreamSource

const val CV_GENERATE_ADDRESS = "cv.generate"

internal class CvGenerateVerticle : AbstractVerticle() {

  companion object {
    internal const val CV_XML_NAMESPACE = "https://ns.bransom.nl/valori/cv/v20201022.xsd"

    private val log = LoggerFactory.getLogger(CvGenerateVerticle::class.java)
    private val deliveryOptions = DeliveryOptions().setSendTimeout(2000)

    private val templateDocx = loadByteArray("/docx/Valori/template.docx")

    private val commonXslt = loadByteArray("/docx/Valori/common.xsl")
    private val commonPerLocaleXslt = loadByteArray("/docx/Valori/nl_NL/common-per-locale.xsl")

    private val docPropsCoreXslt = loadByteArray("/docx/Valori/nl_NL/docProps/core.xml.xsl")
    private val wordDocumentXslt = loadByteArray("/docx/Valori/nl_NL/word/document.xml.xsl")
    private val wordFooter1Xslt = loadByteArray("/docx/Valori/nl_NL/word/footer1.xml.xsl")
    private val wordFooter2Xslt = loadByteArray("/docx/Valori/nl_NL/word/footer2.xml.xsl")
    private val wordHeader2Xslt = loadByteArray("/docx/Valori/nl_NL/word/header2.xml.xsl")

    private val transformerFactory = TransformerFactory
        .newInstance()
        .also {
          it.setURIResolver { href, _ ->
            val resolvedXslt = when (href) {
              "../common.xsl" -> commonXslt
              "../common-per-locale.xsl" -> commonPerLocaleXslt
              else -> throw IllegalArgumentException("Cannot find XSLT $href.")
            }
            StreamSource(ByteArrayInputStream(resolvedXslt))
          }
        }

    private fun loadByteArray(location: String) =
        CvGenerateVerticle::class.java.getResource(location).readBytes()

    fun xslTransform(xmlBytes: ByteArray, xsltBytes: ByteArray): ByteArray {
      ByteArrayInputStream(xmlBytes)
          .use { xml ->
            ByteArrayInputStream(xsltBytes)
                .use { xsltStream ->
                  ByteArrayOutputStream()
                      .use { result ->
                        transformerFactory
                            .newTransformer(StreamSource(xsltStream))
                            .transform(StreamSource(xml), StreamResult(result))
                        return result.toByteArray()
                      }
                }
          }
    }
  }

  override fun start(startPromise: Promise<Void>) {
    vertx.eventBus()
        .consumer<JsonObject>(CV_GENERATE_ADDRESS)
        .toObservable()
        .subscribe(
            {
              startPromise.tryComplete()
              handleRequest(it)
            },
            {
              log.error("Vertx error in CvGenerateVerticle")
              startPromise.fail(it)
            }
        )
  }

  private fun handleRequest(message: Message<JsonObject>) =
      Single
          .just(message)
          .map { it.body() }
          .flatMap(::fetchCvDataAsXml)
          .doOnSuccess { docx -> FileOutputStream("cv.docx").use { it.write(docx) } }
          .map { String(it) }
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

  private fun fetchCvDataAsXml(requestData: JsonObject): Single<ByteArray> =
      vertx.eventBus()
          .rxRequest<JsonObject>(CV_FETCH_ADDRESS, requestData, deliveryOptions)
          .map { it.body() }
          .map {
            val writer = ByteArrayOutputStream()
            jsonToXml(it, XMLOutputFactory.newInstance().createXMLStreamWriter(writer), CV_XML_NAMESPACE)
            writer.toByteArray()
          }
          .flatMap(::xmlToDocx)

  private fun xmlToDocx(xmlBytes: ByteArray) =
      Single
          .zip(
              Single.create<ByteArray> { it.onSuccess(xslTransform(xmlBytes, docPropsCoreXslt)) },
              Single.create<ByteArray> { it.onSuccess(xslTransform(xmlBytes, wordHeader2Xslt)) },
              Single.create<ByteArray> { it.onSuccess(xslTransform(xmlBytes, wordDocumentXslt)) },
              Single.create<ByteArray> { it.onSuccess(xslTransform(xmlBytes, wordFooter1Xslt)) },
              Single.create<ByteArray> { it.onSuccess(xslTransform(xmlBytes, wordFooter2Xslt)) }
          )
          { docPropsCoreXml, wordHeader2Xml, wordDocumentXml, wordFooter1Xml, wordFooter2Xml ->
            mapOf(
                "docProps/core.xml" to docPropsCoreXml,
                "word/header2.xml" to wordHeader2Xml,
                "word/document.xml" to wordDocumentXml,
                "word/footer1.xml" to wordFooter1Xml,
                "word/footer2.xml" to wordFooter2Xml
            )
          }
          .map {
            val docxBytes = ByteArrayOutputStream()
            ZipOutputStream(docxBytes)
                .use { docxOutputStream ->
                  ZipInputStream(ByteArrayInputStream(templateDocx))
                      .use { zipIn ->
                        var entry = zipIn.nextEntry
                        while (entry != null) {

                          docxOutputStream.putNextEntry(ZipEntry(entry.name))
                          val bytes = it[entry.name]
                          if (bytes != null) {
                            docxOutputStream.write(bytes)
                          } else {
                            docxOutputStream.write(zipIn.readAllBytes())
                          }
                          docxOutputStream.closeEntry()

                          zipIn.closeEntry()
                          entry = zipIn.nextEntry
                        }
                      }
                }
            docxBytes.toByteArray()
          }
}