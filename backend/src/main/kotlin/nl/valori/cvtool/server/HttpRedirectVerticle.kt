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
    // Environment variables:
    //    REDIRECT_CONNECTION_STRING=http://0.0.0.0:80/
    //    HTTP_CONNECTION_STRING=https://0.0.0.0:443/?keystore.p12:KeyStorePassword
    val fromConnectionString = config().getString("REDIRECT_CONNECTION_STRING", "http://0.0.0.0:80/")
    val fromConnectionURL = URL(fromConnectionString)

    val toConnectionString = config().getString("HTTP_CONNECTION_STRING").substringBefore("?")
    val toConnectionURL = URL(toConnectionString)
    if (fromConnectionURL == toConnectionURL)
      throw IllegalArgumentException("You cannot redirect to the same URL: $fromConnectionString." +
          " Please specify valid values for environment variables 'REDIRECT_CONNECTION_STRING' and 'HTTP_CONNECTION_STRING'.")

    vertx
        .createHttpServer(HttpServerOptions()
            .setCompressionSupported(true)
            .setHost(fromConnectionURL.host)
            .setPort(fromConnectionURL.port))
        .requestHandler(createRouter(toConnectionURL))
        .listen { result ->
          if (result.succeeded())
            log.info("Redirecting {} to {}", fromConnectionString, toConnectionString)
          startPromise.complete()
        }
  }

  private fun createRouter(toConnectionURL: URL): Router {
    val router = Router.router(vertx)
    router.route("/.well-known/acme-challenge/")
        .handler(StaticHandler.create().setWebRoot("/webroot"))
    router.route("/*")
        .handler { context ->
          val redirectUrl = composeRedirectUrl(context.request().absoluteURI(), toConnectionURL.protocol, toConnectionURL.port)
          context.response()
              .setStatusCode(301)
              .putHeader("Location", redirectUrl)
              .end()
          context.reroute(redirectUrl)
        }
    return router
  }

  private fun composeRedirectUrl(absoluteURI: String, toProtocol: String, toPort: Int): String {
    val url = URL(absoluteURI)
    val source =
        if (url.port < 0)
          String.format("%s://%s/", url.protocol, url.host)
        else
          String.format("%s://%s:%d/", url.protocol, url.host, url.port)
    val replacement = String.format("%s://%s:%d/", toProtocol, url.host, toPort)
    return absoluteURI.replace(source, replacement)
  }
}