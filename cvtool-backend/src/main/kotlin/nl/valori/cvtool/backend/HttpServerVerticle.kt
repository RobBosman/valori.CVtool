package nl.valori.cvtool.backend

import io.vertx.core.Promise
import io.vertx.core.http.HttpServerOptions
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.ext.web.Router
import nl.valori.cvtool.backend.system.HealthChecker
import org.slf4j.LoggerFactory
import java.net.URL

internal class HttpServerVerticle : AbstractVerticle() {

    private val log = LoggerFactory.getLogger(javaClass)

    override fun start(startPromise: Promise<Void>) {
        // Environment variable:
        //   HTTP_CONNECTION_STRING=http://<HOST_NAME>:<PORT>/
        //   HTTP_CONNECTION_STRING=http://www.example.com:80/
        val connectionString = config().getString("HTTP_CONNECTION_STRING")
        val httpConfig = URL(connectionString)
        if (httpConfig.protocol != "http")
            error("Invalid protocol: expected 'http' but found '${httpConfig.protocol}'.")
        val httpPort = if (httpConfig.port > 0) httpConfig.port else httpConfig.defaultPort

        vertx
            .createHttpServer(
                HttpServerOptions()
                    .setPort(httpPort)
                    .setSsl(false)
                    .setCompressionSupported(true)
            )
            .requestHandler(createRouter())
            .rxListen()
            .subscribe(
                {
                    log.info("Listening on http://${httpConfig.authority}/health and /eventbus")
                    startPromise.complete()
                },
                {
                    log.error("Error starting server on http://${httpConfig.authority}/")
                    startPromise.fail(it)
                }
            )
    }

    private fun createRouter(): Router {
        val router = Router.router(vertx)
        router
            .get("/health*")
            .handler(HealthChecker.getHandler(vertx, config()))
        router
            .mountSubRouter(
                "/eventbus",
                EventBusMessageHandler.create(vertx)
            )
        return router
    }
}