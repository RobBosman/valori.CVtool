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
    //    redirectConnectionString=http://0.0.0.0:80/
    //    httpConnectionString=https://0.0.0.0:443/
    val fromConnectionString = config().getString("redirectConnectionString", "http://0.0.0.0:80/")
    val fromHostName = fromConnectionString.substringAfter("//").substringBefore(":")
    val fromPort = fromConnectionString.substringAfterLast(":").substringBefore("/").toInt()

    val toConnectionString = config().getString("httpConnectionString", "https://0.0.0.0:443/")
    val toProtocol = toConnectionString.substringBefore(":")
    val toPort = toConnectionString.substringAfterLast(":").substringBefore("/").toInt()

    vertx
        .createHttpServer(HttpServerOptions()
            .setCompressionSupported(true)
            .setHost(fromHostName)
            .setPort(fromPort))
        .requestHandler { request ->
          request.response()
              .setStatusCode(301)
              .putHeader("Location", composeRedirectUrl(request.absoluteURI(), toProtocol, toPort))
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
    val redirectURI = absoluteURI.replace(source, replacement)

    if (redirectURI == absoluteURI)
      throw IllegalArgumentException("You cannot redirect to the same URL: $redirectURI." +
          " Please specify valid values for environment variables 'httpConnectionString' and 'httpsConnectionString'.")

    return redirectURI
  }
}