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
import javax.xml.stream.XMLOutputFactory
import javax.xml.transform.TransformerFactory
import javax.xml.transform.stream.StreamResult
import javax.xml.transform.stream.StreamSource

const val CV_GENERATE_ADDRESS = "cv.generate"

internal class CvGenerateVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)
  private val deliveryOptions = DeliveryOptions().setSendTimeout(2000)
  private val commonXslt = javaClass.getResource("/docx/Valori/common.xsl").readBytes()

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
          .flatMap(::fetchCvData)
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

  private fun fetchCvData(requestData: JsonObject): Single<ByteArray> =
      vertx.eventBus()
          .rxRequest<JsonObject>(CV_FETCH_ADDRESS, requestData, deliveryOptions)
          .map { it.body() }
          .map {
            val writer = ByteArrayOutputStream()
            val xmlWriter = XMLOutputFactory.newInstance().createXMLStreamWriter(writer)
            jsonToXml(it, xmlWriter)
            xmlWriter.flush()
            xmlToWord(writer.toByteArray())
          }

  private fun xmlToWord(xmlBytes: ByteArray) =
      xslTransform(xmlBytes, commonXslt)

  private fun xslTransform(xmlBytes: ByteArray, xsltBytes: ByteArray): ByteArray {
    ByteArrayInputStream(xmlBytes)
        .use { xml ->
          ByteArrayInputStream(xsltBytes)
              .use { xsltStream ->
                val result = ByteArrayOutputStream()
                TransformerFactory
                    .newInstance()
                    .newTransformer(StreamSource(xsltStream))
                    .transform(StreamSource(xml), StreamResult(result))
                return result.toByteArray()
              }
        }
  }
}