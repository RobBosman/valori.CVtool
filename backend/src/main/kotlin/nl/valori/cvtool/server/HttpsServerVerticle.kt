package nl.valori.cvtool.server

import io.vertx.core.Promise
import io.vertx.core.http.HttpServerOptions
import io.vertx.core.net.PemKeyCertOptions
import io.vertx.ext.bridge.PermittedOptions
import io.vertx.ext.web.handler.sockjs.SockJSBridgeOptions
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.ext.web.Router
import io.vertx.reactivex.ext.web.handler.StaticHandler
import io.vertx.reactivex.ext.web.handler.sockjs.SockJSHandler
import nl.valori.cvtool.server.mongodb.FETCH_ADDRESS
import nl.valori.cvtool.server.mongodb.SAVE_ADDRESS
import org.slf4j.LoggerFactory
import java.net.URL

internal class HttpsServerVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(startPromise: Promise<Void>) {
    // Environment variable:
    //   HTTPS_CONNECTION_STRING=https://www.example.com:443/?/ssl_certs/privkey1.pem:/ssl_certs/fullchain1.pem
    val connectionString = config().getString("HTTPS_CONNECTION_STRING")
    val httpsConfig = URL(connectionString)
    val httpsPort = if (httpsConfig.port > 0) httpsConfig.port else httpsConfig.defaultPort
    val params = httpsConfig.query.split(":")
    val keyPath = params[0]
    val certPath = params[1]

    vertx
        .createHttpServer(HttpServerOptions()
            .setCompressionSupported(true)
            .setHost(httpsConfig.host)
            .setPort(httpsPort)
            .setSsl(true)
            .setPemKeyCertOptions(PemKeyCertOptions()
                .setKeyPath(keyPath)
                .setCertPath(certPath)
            )
        )
        .requestHandler(createRouter())
        .listen { result ->
          if (result.succeeded()) {
            startPromise.complete()
            log.info("Listening on https://${httpsConfig.authority}/")
          } else {
            log.error("Error starting server on https://${httpsConfig.authority}/")
            startPromise.fail(result.cause())
          }
        }
  }

  private fun createRouter(): Router {
    val router = Router.router(vertx)
    router.route("/.well-known/acme-challenge/*")
        .handler(StaticHandler.create()
            .setAllowRootFileSystemAccess(true)
            .setWebRoot("/webroot/.well-known/acme-challenge")
        )
    router.mountSubRouter("/eventbus", SockJSHandler.create(vertx).bridge(createBridgeOptions()))
    router.route("/*")
        .handler(StaticHandler.create()
            .setWebRoot("frontend/dist"))
    return router
  }

  private fun createBridgeOptions() =
      SockJSBridgeOptions()
          .addInboundPermitted(PermittedOptions().setAddress(AUTHENTICATE_ADDRESS))
          .addInboundPermitted(PermittedOptions().setAddress(FETCH_ADDRESS))
          .addInboundPermitted(PermittedOptions().setAddress(FETCH_CV_ADDRESS))
          .addInboundPermitted(PermittedOptions().setAddress(SAVE_ADDRESS))
          .addOutboundPermitted(PermittedOptions().setAddress(SERVER_HEARTBEAT_ADDRESS))
}