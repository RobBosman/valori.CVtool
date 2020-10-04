package nl.valori.cvtool.server

import io.vertx.core.Promise
import io.vertx.core.http.HttpServerOptions
import io.vertx.core.net.JksOptions
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

internal class HttpServerVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(startPromise: Promise<Void>) {
    // Environment variable:
    //   HTTP_CONNECTION_STRING=https://0.0.0.0:443/?keystore.p12:KeyStorePassword
    val connectionString = config().getString("HTTP_CONNECTION_STRING")
    val connectionURL = URL(connectionString)
    val params = connectionURL.query.split(":")
    val keyStoreFile = params[0]
    val keyStorePassword = params[1]

    vertx
        .createHttpServer(HttpServerOptions()
            .setCompressionSupported(true)
            .setHost(connectionURL.host)
            .setPort(connectionURL.port)
            .setSsl(true)
            .setKeyStoreOptions(JksOptions()
                .setPath("/secret/$keyStoreFile")
                .setPassword(keyStorePassword)
            )
        )
        .requestHandler(createRouter())
        .listen { result ->
          if (result.succeeded())
            log.info("Listening on {}", connectionString.substringBefore("?"))
          startPromise.complete()
        }
  }

  private fun createRouter(): Router {
    val router = Router.router(vertx)
    router.route("/.well-known/acme-challenge/")
        .handler(StaticHandler.create().setWebRoot("/webroot"))
    router.mountSubRouter("/eventbus",
        SockJSHandler.create(vertx).bridge(createBridgeOptions()))
    router.route("/*")
        .handler(StaticHandler.create().setWebRoot("frontend/dist"))
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