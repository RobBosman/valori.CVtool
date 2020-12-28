package nl.valori.cvtool.backend

import io.reactivex.Single
import io.vertx.core.Promise
import io.vertx.core.buffer.Buffer.buffer
import io.vertx.core.http.HttpServerOptions
import io.vertx.core.net.PemKeyCertOptions
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.ext.web.Router
import io.vertx.reactivex.ext.web.handler.StaticHandler
import nl.valori.cvtool.backend.system.HealthChecker
import org.slf4j.LoggerFactory
import java.net.URL

internal class HttpsServerVerticle : AbstractVerticle() {

  companion object {
    private val log = LoggerFactory.getLogger(HttpsServerVerticle::class.java)

    private fun loadCert(resourceName: String) =
        buffer(HttpsServerVerticle::class.java.getResource(resourceName).readText())

    internal val sslCert = loadCert("/ssl/localhost-fullchain.pem")
    internal val sslKey = loadCert("/ssl/localhost-privkey.pem")
  }

  override fun start(startPromise: Promise<Void>) {
    // Environment variable:
    //   HTTPS_CONNECTION_STRING=https://<HOST_NAME>:<PORT>/?<SSL_KEY_PATH>:<SSL_CERT_PATH>
    //   HTTPS_CONNECTION_STRING=https://www.example.com:443/?/ssl_certs/privkey1.pem:/ssl_certs/fullchain1.pem
    val connectionString = config().getString("HTTPS_CONNECTION_STRING")
    val httpsConfig = URL(connectionString)
    if (httpsConfig.protocol != "https")
      error("Invalid protocol: expected 'https' but found '${httpsConfig.protocol}'.")
    val httpsPort = if (httpsConfig.port > 0) httpsConfig.port else httpsConfig.defaultPort

    getPemKeyCertOptions(httpsConfig)
        .toFlowable()
        .flatMap { pemKeyCertOptions ->
          vertx
              .createHttpServer(HttpServerOptions()
                  .setPort(httpsPort)
                  .setPemKeyCertOptions(pemKeyCertOptions)
                  .setSsl(true)
//                      .setSslEngineOptions(OpenSSLEngineOptions())
                  .removeEnabledSecureTransportProtocol("TLSv1")
                  .removeEnabledSecureTransportProtocol("TLSv1.1")
//                      .addEnabledSecureTransportProtocol("TLSv1.3")
//                      .setUseAlpn(true)
                  .setCompressionSupported(true)
              )
              .requestHandler(createRouter())
              .rxListen()
              .toFlowable()
        }
        .subscribe(
            {
              startPromise.complete()
              log.info("Listening on https://${httpsConfig.authority}/")
            },
            {
              log.error("Error starting server on https://${httpsConfig.authority}/")
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
        .get("/.well-known/acme-challenge/*") // Used by letsencrypt to renew SSL certificates.
        .handler(StaticHandler.create()
            .setAllowRootFileSystemAccess(true)
            .setWebRoot("/webroot/.well-known/acme-challenge")
        )
    router
        .get("/health*")
        .handler(HealthChecker.getHandler(vertx, config()))
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