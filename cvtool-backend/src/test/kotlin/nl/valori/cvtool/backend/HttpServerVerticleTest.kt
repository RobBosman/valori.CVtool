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

    private val HOST_NAME = "localhost"

    private fun runHttpsServer(vertx: Vertx, testContext: VertxTestContext): Int {
        val port = ServerSocket(0).use { it.localPort }
        vertx.deployVerticle(
            HttpServerVerticle::class.java.name,
            DeploymentOptions()
                .setConfig(
                    JsonObject()
                        .put("HTTP_CONNECTION_STRING", "http://$HOST_NAME:$port/")
                ),
            testContext.succeedingThenComplete()
        )
        return port
    }

    @Test
    fun testServer(vertx: Vertx, testContext: VertxTestContext) {
        val port = runHttpsServer(vertx, testContext)

        WebClient
            .create(
                vertx, WebClientOptions()
                    .setSsl(false)
            )
            .get(port, HOST_NAME, "/.well-known/acme-challenge/index.html")
            .`as`(BodyCodec.string())
            .send(testContext.succeeding { response ->
                testContext.verify {
                    assertTrue(response.body().contains("/.well-known/acme-challenge/index.html"))
                    testContext.completeNow()
                }
            })

        assertTrue(testContext.awaitCompletion(2, SECONDS))
        if (testContext.failed())
            throw testContext.causeOfFailure()
    }
}