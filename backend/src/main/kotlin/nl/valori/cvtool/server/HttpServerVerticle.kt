package nl.valori.cvtool.server

import io.vertx.core.AbstractVerticle
import io.vertx.core.Future
import io.vertx.core.net.SocketAddress
import io.vertx.ext.web.Router
import io.vertx.ext.web.RoutingContext
import org.slf4j.LoggerFactory

internal class HttpServerVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(future: Future<Void>) {
    val router = Router.router(vertx)
    router.route("/")
        .handler { routingContext: RoutingContext ->
          routingContext.response()
              .putHeader("content-type", "text/html")
              .end("Hello there!")
        }

    val port = config().getInteger("http.port")
    val hostName = config().getString("http.host")
    vertx.createHttpServer()
        .requestHandler(router)
        .listen(SocketAddress.inetSocketAddress(port, hostName)) { result ->
          if (result.succeeded())
            log.info("Listening on http://{}:{}/", hostName, port)
          future.handle(result.mapEmpty())
        }
  }
}