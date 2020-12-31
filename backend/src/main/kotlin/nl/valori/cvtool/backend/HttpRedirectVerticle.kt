package nl.valori.cvtool.backend

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
        //   REDIRECT_CONNECTION_STRING=http://<HOST_NAME>:80/
        //   HTTPS_CONNECTION_STRING=https://<HOST_NAME>:443/?<...>
        //
        // Note: REDIRECT_CONNECTION_STRING defaults to 'http://<${HTTPS_CONNECTION_STRING}.host>:80/'
        val httpsConfig = URL(config().getString("HTTPS_CONNECTION_STRING").substringBefore("?"))
        val redirectConfig = URL(config().getString("REDIRECT_CONNECTION_STRING", "http://${httpsConfig.host}:80/"))
        val redirectPort = if (redirectConfig.port > 0) redirectConfig.port else redirectConfig.defaultPort

        vertx
            .createHttpServer(
                HttpServerOptions()
                    .setPort(redirectPort)
                    .setSsl(false)
                    .setCompressionSupported(true)
            )
            .requestHandler(createRouter(httpsConfig))
            .rxListen()
            .subscribe(
                {
                    startPromise.complete()
                    log.info("Redirecting http://${redirectConfig.authority}/ to https://${httpsConfig.authority}/")
                },
                {
                    log.error("Error redirecting http://${redirectConfig.authority}/ to https://${httpsConfig.authority}/")
                    startPromise.fail(it)
                }
            )
    }

    private fun createRouter(httpsConfig: URL): Router {
        val httpsPort = if (httpsConfig.port > 0) httpsConfig.port else httpsConfig.defaultPort
        val router = Router.router(vertx)
        router
            .get("/.well-known/acme-challenge/*") // Used by letsencrypt to renew SSL certificates.
            .handler(
                StaticHandler.create()
                    .setAllowRootFileSystemAccess(true)
                    .setWebRoot("/webroot/.well-known/acme-challenge")
            )
        router
            .route("/*")
            .handler { context ->
                context.response()
                    .setStatusCode(301)
                    .putHeader("Location", composeRedirectUrl(context.request().absoluteURI(), httpsPort))
                    .end()
            }
        return router
    }

    private fun composeRedirectUrl(sourceUri: String, targetPort: Int): String {
        val sourceUrl = URL(sourceUri)
        return "https://${sourceUrl.host}:$targetPort${sourceUri.substringAfter(sourceUrl.authority)}"
    }
}