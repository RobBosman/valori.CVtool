package nl.valori.cvtool.server

import io.vertx.core.Future
import io.vertx.reactivex.core.AbstractVerticle
import org.slf4j.LoggerFactory
import java.net.URL

internal class HttpRedirectVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(future: Future<Void>) {
    // Environment variable: redirectConnectionString=http://0.0.0.0:80/
    val orgConnectionString = config().getString("redirectConnectionString", "http://0.0.0.0:80/")
    val hostName = orgConnectionString.substringAfter("//").substringBefore(":")
    val orgPort = orgConnectionString.substringAfterLast(":").substringBefore("/").toInt()

    // Environment variable: httpConnectionString=https://0.0.0.0:443/
    val redirectConnectionString = config().getString("httpConnectionString", "https://0.0.0.0:443/")
    val redirectProtocol = redirectConnectionString.substringBefore(":")
    val redirectPort = redirectConnectionString.substringAfterLast(":").substringBefore("/").toInt()

    vertx
        .createHttpServer()
        .requestHandler { request ->
          request.response()
              .setStatusCode(301)
              .putHeader("Location", composeRedirectUrl(request.absoluteURI(), redirectProtocol, redirectPort))
              .end()
        }
        .listen(orgPort, hostName) { result ->
          if (result.succeeded())
            log.info("Redirecting {} to {}", orgConnectionString, redirectConnectionString)
          future.handle(result.mapEmpty())
        }
  }

  private fun composeRedirectUrl(absoluteURI: String, redirectProtocol: String, redirectPort: Int): String {
    val url = URL(absoluteURI)
    val source =
        if (url.port < 0)
          String.format("%s://%s/", url.protocol, url.host)
        else
          String.format("%s://%s:%d/", url.protocol, url.host, url.port)
    val replacement = String.format("%s://%s:%d/", redirectProtocol, url.host, redirectPort)
    val redirectURI = absoluteURI.replace(source, replacement)

    if (replacement == redirectURI)
      throw IllegalArgumentException("You cannot redirect to the same URL: $redirectURI." +
          " Please specify valid values for environment variables 'httpConnectionString' and 'httpsConnectionString'.")

    return redirectURI
  }
}