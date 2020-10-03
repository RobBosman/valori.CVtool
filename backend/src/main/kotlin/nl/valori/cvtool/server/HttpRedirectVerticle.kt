package nl.valori.cvtool.server

import io.vertx.core.Future
import io.vertx.core.http.HttpServerOptions
import io.vertx.reactivex.core.AbstractVerticle
import org.slf4j.LoggerFactory
import java.net.URL

internal class HttpRedirectVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(future: Future<Void>) {
    // Environment variables:
    //    REDIRECT_CONNECTION_STRING=http://0.0.0.0:80/
    //    HTTP_CONNECTION_STRING=https://0.0.0.0:443/
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
        .requestHandler { request ->
          request.response()
              .setStatusCode(301)
              .putHeader("Location", composeRedirectUrl(request.absoluteURI(), toConnectionURL.protocol, toConnectionURL.port))
              .end()
        }
        .listen { result ->
          if (result.succeeded())
            log.info("Redirecting {} to {}", fromConnectionString, toConnectionString)
          future.handle(result.mapEmpty())
        }
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