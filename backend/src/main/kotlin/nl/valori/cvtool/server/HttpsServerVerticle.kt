package nl.valori.cvtool.server

import io.reactivex.Single
import io.vertx.core.Promise
import io.vertx.core.buffer.Buffer.buffer
import io.vertx.core.http.HttpServerOptions
import io.vertx.core.net.PemKeyCertOptions
import io.vertx.ext.bridge.PermittedOptions
import io.vertx.ext.web.handler.sockjs.SockJSBridgeOptions
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.ext.web.Router
import io.vertx.reactivex.ext.web.handler.StaticHandler
import io.vertx.reactivex.ext.web.handler.sockjs.SockJSHandler
import org.slf4j.LoggerFactory
import java.net.URL

internal class HttpsServerVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(startPromise: Promise<Void>) {
    // Environment variable:
    //   HTTPS_CONNECTION_STRING=https://<HOST_NAME>:443/?<SSL_KEY_PATH>:<SSL_CERT_PATH>
    //   HTTPS_CONNECTION_STRING=https://www.example.com:443/?/ssl_certs/privkey1.pem:/ssl_certs/fullchain1.pem
    val connectionString = config().getString("HTTPS_CONNECTION_STRING")
    val httpsConfig = URL(connectionString)
    if (httpsConfig.protocol != "https")
      throw IllegalArgumentException("Invalid protocol: expected 'https' but found '${httpsConfig.protocol}'.")
    val httpsPort = if (httpsConfig.port > 0) httpsConfig.port else httpsConfig.defaultPort

    getSslOptions(httpsConfig)
        .subscribe(
            { pemKeyCertOptions ->
              vertx
                  .createHttpServer(HttpServerOptions()
                      .setCompressionSupported(true)
                      .setPort(httpsPort)
                      .setSsl(true)
                      .setPemKeyCertOptions(pemKeyCertOptions)
                  )
                  .requestHandler(createRouter())
                  .listen { result ->
                    if (result.succeeded()) {
                      startPromise.complete()
                      log.info("Listening on https://${httpsConfig.authority}/")
                    } else {
                      log.error("Error starting server on https://${httpsConfig.authority}/")
                      startPromise.fail(result.cause())
                    }
                  }
            },
            {
              log.error("Error loading SSL certificates")
              startPromise.fail(it)
            }
        )
  }

  private fun getSslOptions(httpsConfig: URL): Single<PemKeyCertOptions> {
    val pemSslPaths = (httpsConfig.query ?: ":").split(":")
    val keyPath = pemSslPaths[0]
    val certPath = pemSslPaths[1]

    return vertx.fileSystem().rxReadFile(keyPath)
        .zipWith(vertx.fileSystem().rxReadFile(certPath)) { key, cert ->
          PemKeyCertOptions()
              .setKeyValue(key.delegate)
              .setCertValue(cert.delegate)
        }
        .onErrorReturn {
          log.debug("Error loading SSL certificates: ${it.message}.")
          log.warn("Using fallback SSL certificates.")
          PemKeyCertOptions()
              .setKeyValue(buffer(HttpsServerVerticle::class.java.getResource("/fallback-privkey.pem").readText()))
              .setCertValue(buffer(HttpsServerVerticle::class.java.getResource("/fallback-fullchain.pem").readText()))
        }
  }

  private fun createRouter(): Router {
    val router = Router.router(vertx)
    router
        .route("/.well-known/acme-challenge/*")
        .handler(StaticHandler.create()
            .setAllowRootFileSystemAccess(true)
            .setWebRoot("/webroot/.well-known/acme-challenge")
        )
    router
        .mountSubRouter("/eventbus",
            SockJSHandler.create(vertx).bridge(createBridgeOptions()))
    router
        .route("/*")
        .handler(StaticHandler.create()
            .setWebRoot("frontend/dist"))
    return router
  }

  private fun createBridgeOptions() =
      SockJSBridgeOptions()
          .addInboundPermitted(PermittedOptions().setAddress(AUTHENTICATE_ADDRESS))
          .addInboundPermitted(PermittedOptions().setAddress(CV_FETCH_ADDRESS))
          .addInboundPermitted(PermittedOptions().setAddress(CV_SAVE_ADDRESS))
          .addInboundPermitted(PermittedOptions().setAddress(CV_GENERATE_ADDRESS))
}