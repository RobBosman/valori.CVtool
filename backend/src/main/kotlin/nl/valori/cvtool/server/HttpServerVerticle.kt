package nl.valori.cvtool.server

import io.vertx.core.Future
import io.vertx.ext.bridge.PermittedOptions
import io.vertx.ext.web.handler.sockjs.SockJSBridgeOptions
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.core.net.SocketAddress
import io.vertx.reactivex.ext.web.Router
import io.vertx.reactivex.ext.web.handler.StaticHandler
import io.vertx.reactivex.ext.web.handler.sockjs.SockJSHandler
import nl.valori.cvtool.server.mongodb.FETCH_ADDRESS
import nl.valori.cvtool.server.mongodb.SAVE_ADDRESS
import org.slf4j.LoggerFactory

internal class HttpServerVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(future: Future<Void>) {
    val connectionString = config().getString("httpConnectionString")
    val hostName = connectionString.substringAfter("//").substringBefore(":")
    val port = connectionString.substringAfterLast(":").substringBefore("/").toInt()

    vertx
        .createHttpServer()
        .requestHandler(createRouter())
        .listen(SocketAddress.inetSocketAddress(port, hostName)) { result ->
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
            .setIndexPage("index.html")
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