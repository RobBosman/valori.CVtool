package nl.valori.cvtool.backend

import io.vertx.core.Promise
import io.vertx.core.http.HttpServerOptions
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.ext.web.Router
import io.vertx.reactivex.ext.web.RoutingContext
import io.vertx.reactivex.ext.web.handler.BodyHandler
import nl.valori.cvtool.backend.system.HealthChecker
import org.slf4j.LoggerFactory
import java.net.HttpURLConnection.HTTP_INTERNAL_ERROR
import java.net.HttpURLConnection.HTTP_OK
import java.net.URI
import java.util.concurrent.TimeUnit.MILLISECONDS

internal class HttpServerVerticle : AbstractVerticle() {

    private val log = LoggerFactory.getLogger(javaClass)

    override fun start(startPromise: Promise<Void>) { //NOSONAR - Promise<Void> is defined in AbstractVerticle
        // Environment variable:
        //   HTTP_CONNECTION_STRING=http://<HOST_NAME>:<PORT>/
        //   HTTP_CONNECTION_STRING=http://www.example.com:80/
        val connectionString = config().getString("HTTP_CONNECTION_STRING")
        val httpConfig = URI(connectionString).toURL()
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
            .exceptionHandler { log.debug("Unexpected error in HttpServer: ${it.message}.", it) }
            .rxListen()
            .doOnError { log.warn("Cannot start verticle: ${it.message}") }
            .retryWhen { it.delay(5_000, MILLISECONDS) }
            .subscribe(
                {
                    log.info("Listening on http://${httpConfig.authority}/health and /eventbus")
                    startPromise.complete()
                },
                {
                    log.error("Error starting server on http://${httpConfig.authority}/", it)
                    startPromise.fail(it)
                }
            )
    }

    private fun createRouter(): Router {
        val router = Router.router(vertx)
        router
            .errorHandler(HTTP_INTERNAL_ERROR) { log.warn("errorHandler -- $it") }
            .route()
            .failureHandler(::handleFailure)
            .handler(BodyHandler.create())

        router
            .route("/health/restart-backend")
            .handler { context ->
                log.warn("Restarting Docker container 'bransom/cvtool-backend'...")
                val process = Runtime.getRuntime()
                    .exec(
                        arrayOf(
                            "docker",
                            "container",
                            "restart",
                            "\"$(docker ps -aqf 'ancestor=bransom/cvtool-backend')\""
                        )
                    )
                process.waitFor()
                if (process.exitValue() == 0) {
                    context.response()
                        .setStatusCode(HTTP_OK)
                        .end("Done!")
                } else {
                    context.response()
                        .setStatusCode(HTTP_INTERNAL_ERROR)
                        .end("Nope.")
                }
            }

        router
            .route("/health/*")
            .handler(HealthChecker.getHandler(vertx, config()))

        router
            .route("/eventbus/*")
            .subRouter(EventBusMessageHandler.create(vertx))
        return router
    }

    private fun handleFailure(routingContext: RoutingContext) {
        log.warn("Error handling request: ${routingContext.failure().message}")
        routingContext.response()
            .putHeader("Content-type", "application/json; charset=utf-8")
            .setStatusCode(500)
            .end(routingContext.failure().message ?: "internal server error")
    }
}