package nl.valori.cvtool.server

import io.reactivex.Single
import io.vertx.core.Promise
import io.vertx.core.buffer.Buffer.buffer
import io.vertx.core.http.HttpServerOptions
import io.vertx.core.net.PemKeyCertOptions
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.ext.web.Router
import io.vertx.reactivex.ext.web.handler.StaticHandler
import org.slf4j.LoggerFactory
import java.net.URL

internal class HttpsServerVerticle : AbstractVerticle() {

  companion object {
    private fun loadCert(resourceName: String) =
        buffer(HttpsServerVerticle::class.java.getResource(resourceName).readText())

    internal val sslCert = loadCert("/ssl/localhost-fullchain.pem")
    internal val sslKey = loadCert("/ssl/localhost-privkey.pem")

    private val log = LoggerFactory.getLogger(HttpsServerVerticle::class.java)
  }

  override fun start(startPromise: Promise<Void>) {
    // Environment variable:
    //   HTTPS_CONNECTION_STRING=https://<HOST_NAME>:443/?<SSL_KEY_PATH>:<SSL_CERT_PATH>
    //   HTTPS_CONNECTION_STRING=https://www.example.com:443/?/ssl_certs/privkey1.pem:/ssl_certs/fullchain1.pem
    val connectionString = config().getString("HTTPS_CONNECTION_STRING")
    val httpsConfig = URL(connectionString)
    if (httpsConfig.protocol != "https")
      throw IllegalArgumentException("Invalid protocol: expected 'https' but found '${httpsConfig.protocol}'.")
    val httpsPort = if (httpsConfig.port > 0) httpsConfig.port else httpsConfig.defaultPort

    getPemKeyCertOptions(httpsConfig)
        .subscribe(
            { pemKeyCertOptions ->
              vertx
                  .createHttpServer(HttpServerOptions()
                      .setCompressionSupported(true)
                      .setPort(httpsPort)
                      .setSsl(true)
                      .setPemKeyCertOptions(pemKeyCertOptions)
//                      .setSslEngineOptions(OpenSSLEngineOptions())
//                      .addEnabledSecureTransportProtocol("TLSv1.3")
//                      .setUseAlpn(true)
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

  private fun getPemKeyCertOptions(httpsConfig: URL): Single<PemKeyCertOptions> {
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
          log.warn("Error loading SSL certificates (${it.message}). Using fallback SSL certificates.")
          PemKeyCertOptions()
              .setKeyValue(sslKey)
              .setCertValue(sslCert)
        }
  }

  private fun createRouter(): Router {
    val router = Router.router(vertx)
    router
        .get("/health*")
        .handler(HealthChecker.getHandler(vertx))
    router
        .get("/.well-known/acme-challenge/*") // Used by letsencrypt to renew SSL certificates.
        .handler(StaticHandler.create()
            .setAllowRootFileSystemAccess(true)
            .setWebRoot("/webroot/.well-known/acme-challenge")
        )
    router
        .mountSubRouter("/eventbus",
            EventBusMessageHandler.create(vertx)
        )
    router
        .route("/*")
        .handler(StaticHandler.create()
            .setWebRoot("frontend/dist")
        )
    return router
  }
}