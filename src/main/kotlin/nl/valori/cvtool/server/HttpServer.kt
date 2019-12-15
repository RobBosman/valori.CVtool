package nl.valori.cvtool.server

import io.vertx.core.AbstractVerticle
import io.vertx.core.Future
import io.vertx.core.net.SocketAddress
import io.vertx.ext.web.Router
import io.vertx.ext.web.RoutingContext
import org.slf4j.LoggerFactory

internal class HttpServer : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  companion object {
    const val HOST_NAME = "localhost"
    const val PORT = 80
  }

  override fun start(future: Future<Void>) {
    val router = Router.router(vertx)
    router.route("/")
        .handler { routingContext: RoutingContext ->
          routingContext.response()
              .putHeader("content-type", "text/html")
              .end("Hello there!")
        }

    vertx.createHttpServer()
        .requestHandler(router)
        .listen(SocketAddress.inetSocketAddress(PORT, HOST_NAME)) { result ->
          if (result.succeeded())
            log.info("Listening on http://{}:{}/", HOST_NAME, PORT)
          future.handle(result.mapEmpty())
        }
  }
}