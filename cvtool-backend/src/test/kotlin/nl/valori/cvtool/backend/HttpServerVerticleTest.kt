package nl.valori.cvtool.backend

import io.vertx.core.DeploymentOptions
import io.vertx.core.Vertx
import io.vertx.core.json.JsonObject
import io.vertx.ext.web.client.WebClient
import io.vertx.ext.web.client.WebClientOptions
import io.vertx.ext.web.codec.BodyCodec
import io.vertx.junit5.VertxExtension
import io.vertx.junit5.VertxTestContext
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import java.net.ServerSocket
import java.util.concurrent.TimeUnit.SECONDS

@ExtendWith(VertxExtension::class)
internal class HttpServerVerticleTest {

    companion object {
        private const val HOST_NAME = "localhost"
    }

    private fun runHttpsServer(vertx: Vertx, testContext: VertxTestContext): Int {
        // Find a free port.
        val port = ServerSocket(0)
            .use { serverSocket ->
                serverSocket.localPort
            }

        // Start the web server...
        vertx
            .deployVerticle(
                HttpServerVerticle::class.java.name,
                DeploymentOptions()
                    .setConfig(
                        JsonObject()
                            .put("HTTP_CONNECTION_STRING", "http://$HOST_NAME:$port/")
                    )
            )
            .onComplete(testContext.succeedingThenComplete())

        // ...and wait until it's ready.
        assertTrue(testContext.awaitCompletion(2, SECONDS))

        return port
    }

    @Test
    fun testServer(vertx: Vertx, testContext: VertxTestContext) {
        val port = runHttpsServer(vertx, testContext)
        val testUrl = "/.well-known/acme-challenge/index.html"

        WebClient
            .create(
                vertx, WebClientOptions()
                    .setSsl(false)
            )
            .get(port, HOST_NAME, testUrl)
            .`as`(BodyCodec.string())
            .send()
            .onComplete(testContext.succeeding { response ->
                testContext.verify {
                    assertTrue(response.body().contains(testUrl))
                    testContext.completeNow()
                }
            })

        if (testContext.failed())
            throw testContext.causeOfFailure()
    }
}