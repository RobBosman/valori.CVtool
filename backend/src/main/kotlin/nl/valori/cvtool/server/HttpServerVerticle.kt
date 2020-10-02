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
import java.nio.file.Paths

internal class HttpServerVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(future: Future<Void>) {
    // Environment variable: httpConnectionString=https://0.0.0.0:8000/
    val connectionString = config().getString("httpConnectionString", "https://0.0.0.0:443/")
    val protocol = connectionString.substringBefore(":")
    val hostName = connectionString.substringAfter("//").substringBefore(":")
    val port = connectionString.substringAfterLast(":").substringBefore("/").toInt()
    if ((protocol.toUpperCase() == "HTTPS" && port == 80)
        || (protocol.toUpperCase() == "HTTP" && port == 443))
      throw IllegalArgumentException("You should not configure $protocol on port $port." +
          " Please specify a valid value for environment variable 'httpsConnectionString'.")

    vertx
        .createHttpServer(HttpServerOptions()
            .setCompressionSupported(true)
            .setHost(hostName)
            .setPort(port)
            .setSsl(true)
            .setKeyStoreOptions(JksOptions()
                .setPath(Paths.get("secret").resolve("keystore.p12").toString())
                .setPassword("KeyStorePassword")
            )
        )
        .requestHandler(createRouter())
        .listen { result ->
          if (result.succeeded())
            log.info("Listening on {}", connectionString)
          future.handle(result.mapEmpty())
        }
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