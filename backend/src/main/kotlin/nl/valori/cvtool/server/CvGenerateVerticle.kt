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
import java.io.InputStream
import java.io.StringWriter
import java.net.URL
import javax.xml.stream.XMLOutputFactory
import javax.xml.transform.TransformerFactory
import javax.xml.transform.stream.StreamResult
import javax.xml.transform.stream.StreamSource

const val CV_GENERATE_ADDRESS = "cv.generate"

internal class CvGenerateVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)
  private val deliveryOptions = DeliveryOptions().setSendTimeout(2000)

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

  private fun fetchCvData(requestData: JsonObject): Single<String> =
      vertx.eventBus()
          .rxRequest<JsonObject>(CV_FETCH_ADDRESS, requestData, deliveryOptions)
          .map { it.body() }
          .map {
            val writer = ByteArrayOutputStream()
            val xmlWriter = XMLOutputFactory.newInstance().createXMLStreamWriter(writer)
            jsonToXml(it, xmlWriter)
            xmlWriter.flush()
            xmlToWord(ByteArrayInputStream(writer.toByteArray()))
          }

  private fun xmlToWord(xmlStream: InputStream) =
      xslTransform(xmlStream, javaClass.getResource("/xml-to-docx.xsl"))

  private fun xslTransform(xmlStream: InputStream, xsltUrl: URL): String {
    xsltUrl
        .openStream()
        .use { xsltStream ->
          val result = StringWriter()
          TransformerFactory
              .newInstance()
              .newTransformer(StreamSource(xsltStream))
              .transform(StreamSource(xmlStream), StreamResult(result))
          return result.toString()
        }
  }
}