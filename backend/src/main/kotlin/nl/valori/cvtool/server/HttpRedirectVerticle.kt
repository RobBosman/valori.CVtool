package nl.valori.cvtool.server

import io.vertx.core.Promise
import io.vertx.core.http.HttpServerOptions
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.ext.web.Router
import io.vertx.reactivex.ext.web.handler.StaticHandler
import org.slf4j.LoggerFactory
import java.net.URL

internal class HttpRedirectVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(startPromise: Promise<Void>) {
    // Environment variable:
    //    HTTPS_CONNECTION_STRING=https://0.0.0.0:443/?queryString
    val httpsConfig = URL(config().getString("HTTPS_CONNECTION_STRING").substringBefore("?"))

    vertx
        .createHttpServer(HttpServerOptions()
            .setCompressionSupported(true)
            .setHost(httpsConfig.host)
            .setPort(80)
            .setSsl(false)
        )
        .requestHandler(createRouter())
        .listen { result ->
          if (result.succeeded()) {
            val httpAuthority = if (httpsConfig.port == httpsConfig.defaultPort) httpsConfig.host else httpsConfig.authority
            log.info("Redirecting http://${httpAuthority}/ to https://${httpsConfig.authority}/")
          }
          startPromise.complete()
        }
  }

  private fun createRouter(): Router {
    val router = Router.router(vertx)
    router.route("/.well-known/acme-challenge/*")
        .handler(StaticHandler.create()
            .setAllowRootFileSystemAccess(true)
            .setWebRoot("/webroot/.well-known/acme-challenge")
        )
    router.route("/*")
        .handler { context ->
          val absoluteURI = context.request().absoluteURI()
          context.response()
              .setStatusCode(301)
              .putHeader("Location", "https://${absoluteURI.substringAfter("://")}")
              .end()
        }
    return router
  }
}