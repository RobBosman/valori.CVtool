package nl.valori.cvtool.backend.system

import io.vertx.core.Promise
import io.vertx.core.buffer.Buffer
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.http.HttpHeaders.CONTENT_DISPOSITION
import io.vertx.core.http.HttpHeaders.TRANSFER_ENCODING
import io.vertx.core.http.HttpServerOptions
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.ext.web.Router
import nl.valori.cvtool.backend.cv.ALL_CVS_GENERATE_ADDRESS
import org.slf4j.LoggerFactory
import java.net.HttpURLConnection.HTTP_INTERNAL_ERROR
import java.net.HttpURLConnection.HTTP_OK
import java.net.URI

internal class ControlVerticle : AbstractVerticle() {

    private val log = LoggerFactory.getLogger(javaClass)
    private val deliveryOptions = DeliveryOptions().setSendTimeout(300_000) // 5 minutes

    override fun start(startPromise: Promise<Void>) { // NOSONAR - Promise<Void> is defined in AbstractVerticle
        // Environment variables:
        //   CONTROL_CONNECTION_STRING=http://<HOST_NAME>:<PORT>/
        //   CONTROL_CONNECTION_STRING=http://localhost:88/
        val configConfig = URI(config().getString("CONTROL_CONNECTION_STRING"))

        vertx
            .createHttpServer(
                HttpServerOptions()
                    .setHost(configConfig.host)
                    .setPort(configConfig.port)
                    .setSsl(false)
                    .setCompressionSupported(true)
            )
            .requestHandler(createRouter())
            .rxListen()
            .subscribe(
                {
                    startPromise.complete()
                    log.info("All cv data can be converted via http://${configConfig.authority}/convertCvData")
                    log.info("All cvs can be downloaded via http://${configConfig.authority}/all-docx.zip")
                },
                {
                    log.error("Vertx error in ControlVerticle", it)
                    startPromise.fail(it)
                }
            )
    }

    private fun createRouter(): Router {
        val router = Router.router(vertx)
        router
            .route("/all-docx.zip")
            .handler { context ->
                vertx.eventBus()
                    .rxRequest<JsonObject>(ALL_CVS_GENERATE_ADDRESS, null, deliveryOptions)
                    .map { Buffer.buffer(it.body().getBinary("zipBytes")) }
                    .subscribe(
                        { zipBytes ->
                            context.response()
                                .setStatusCode(HTTP_OK)
                                .putHeader(TRANSFER_ENCODING, "application/zip")
                                .putHeader(TRANSFER_ENCODING, "chunked")
                                .putHeader(CONTENT_DISPOSITION, "attachment; filename=\"all-docx.zip\"")
                                .send(zipBytes)
                        },
                        {
                            log.error("Error generating all cvs", it)
                            context.response()
                                .setStatusCode(HTTP_INTERNAL_ERROR)
                                .end()
                        }
                    )
            }
        return router
    }
}