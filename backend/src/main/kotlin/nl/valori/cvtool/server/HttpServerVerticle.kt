package nl.valori.cvtool.server

import io.vertx.core.Future
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
import java.nio.file.Files
import java.nio.file.Path

internal class HttpServerVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(future: Future<Void>) {
    // Environment variables: HTTP_CONNECTION_STRING=https://0.0.0.0:443/?keystore.p12:KeyStorePassword
    val connectionString = config().getString("HTTP_CONNECTION_STRING")
    val connectionURL = URL(connectionString)
    val params = connectionURL.query.split(":")

    vertx
        .createHttpServer(HttpServerOptions()
            .setCompressionSupported(true)
            .setHost(connectionURL.host)
            .setPort(connectionURL.port)
            .setSsl(true)
            .setKeyStoreOptions(createKeyCertOptions(params[0], params[1]))
        )
        .requestHandler(createRouter())
        .listen { result ->
          if (result.succeeded())
            log.info("Listening on {}", connectionString.substringBefore("?"))
          future.handle(result.mapEmpty())
        }
  }

  private fun createKeyCertOptions(keyStorePath: String, keyStorePassword: String): JksOptions {
    // If the shared SSL keyStore cannot be found, then use a fallback.
    if (!Files.exists(Path.of(keyStorePath))) {
      log.warn("SSL keystore {} cannot be found; using fallback keyStore", keyStorePath)
      return JksOptions()
          .setPath(javaClass.getResource("/keystore.p12").path)
          .setPassword("KeyStorePassword")
    }
    return JksOptions()
        .setPath(keyStorePath)
        .setPassword(keyStorePassword)
  }

  private fun createRouter(): Router {
    val router = Router.router(vertx)
    router.mountSubRouter("/eventbus",
        SockJSHandler.create(vertx)
            .bridge(createBridgeOptions())
    )
    router.route("/*").handler(
        StaticHandler.create()
            .setWebRoot("frontend/dist")
    )
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