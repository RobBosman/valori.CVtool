package nl.valori.cvtool.server

import io.vertx.core.AbstractVerticle
import io.vertx.core.Future
import io.vertx.core.net.SocketAddress
import io.vertx.ext.bridge.PermittedOptions
import io.vertx.ext.web.Router
import io.vertx.ext.web.handler.StaticHandler
import io.vertx.ext.web.handler.sockjs.SockJSBridgeOptions
import io.vertx.ext.web.handler.sockjs.SockJSHandler
import nl.valori.cvtool.server.mongodb.ADDRESS_FETCH
import nl.valori.cvtool.server.mongodb.ADDRESS_SAVE
import org.slf4j.LoggerFactory

internal class HttpServerVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(future: Future<Void>) {
    val connectionString = config().getString("httpConnectionString")
    val hostName = connectionString.substringAfter("//").substringBefore(":")
    val port = connectionString.substringAfterLast(":").substringBefore("/").toInt()
    vertx.createHttpServer()
        .requestHandler(createRouter())
        .listen(SocketAddress.inetSocketAddress(port, hostName)) { result ->
          if (result.succeeded())
            log.info("Listening on {}", connectionString)
          future.handle(result.mapEmpty())
        }
  }

  private fun createRouter(): Router {
    val router = Router.router(vertx)
    router.route("/hi")
        .handler {
          it.response()
              .putHeader("content-type", "text/html")
              .end("Hi there!")
        }
    router.mountSubRouter("/eventbus",
        SockJSHandler.create(vertx)
            .bridge(createBridgeOptions()))
    router.route("/*")
        .handler(StaticHandler.create()
            .setWebRoot("frontend/dist")
            .setIndexPage("index.html"))
    return router
  }

  private fun createBridgeOptions(): SockJSBridgeOptions? =
      SockJSBridgeOptions()
          .addInboundPermitted(PermittedOptions().setAddress(ADDRESS_LOGIN))
          .addInboundPermitted(PermittedOptions().setAddress(ADDRESS_FETCH))
          .addInboundPermitted(PermittedOptions().setAddress(ADDRESS_FETCH_CV))
          .addInboundPermitted(PermittedOptions().setAddress(ADDRESS_SAVE))
          .addOutboundPermitted(PermittedOptions().setAddress(ADDRESS_SERVER_HEARTBEAT))
}