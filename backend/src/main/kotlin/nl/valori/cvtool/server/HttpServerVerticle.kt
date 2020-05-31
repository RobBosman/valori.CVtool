package nl.valori.cvtool.server

import io.vertx.core.AbstractVerticle
import io.vertx.core.Future
import io.vertx.core.net.SocketAddress
import io.vertx.ext.bridge.PermittedOptions
import io.vertx.ext.web.Router
import io.vertx.ext.web.handler.StaticHandler
import io.vertx.ext.web.handler.sockjs.SockJSBridgeOptions
import io.vertx.ext.web.handler.sockjs.SockJSHandler
import org.slf4j.LoggerFactory

internal class HttpServerVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(future: Future<Void>) {
    val router = Router.router(vertx)
    router.route("/hi")
        .handler {
          it.response()
              .putHeader("content-type", "text/html")
              .end("Hi there!")
        }
    val bridgeOptions = SockJSBridgeOptions()
        .addInboundPermitted(PermittedOptions().setAddress(ADDRESS_LOGIN))
        .addInboundPermitted(PermittedOptions().setAddress(ADDRESS_FETCH))
        .addInboundPermitted(PermittedOptions().setAddress(ADDRESS_FETCH_CV))
        .addInboundPermitted(PermittedOptions().setAddress(ADDRESS_SAVE))
        .addOutboundPermitted(PermittedOptions().setAddress(ADDRESS_SERVER_HEARTBEAT))
    router.mountSubRouter("/eventbus",
        SockJSHandler.create(vertx)
            .bridge(bridgeOptions))
    router.route("/*")
        .handler(StaticHandler.create()
            .setWebRoot("frontend/dist")
            .setIndexPage("index.html"))

    val httpServerConfig = config().getJsonObject("httpServer")
    val port = httpServerConfig.getInteger("http.port")
    val hostName = httpServerConfig.getString("http.host")
    vertx.createHttpServer()
        .requestHandler(router)
        .listen(SocketAddress.inetSocketAddress(port, hostName)) { result ->
          if (result.succeeded())
            log.info("Listening on http://{}:{}/", hostName, port)
          future.handle(result.mapEmpty())
        }
  }
}