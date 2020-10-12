package nl.valori.cvtool.server

import io.vertx.core.DeploymentOptions
import io.vertx.core.Vertx
import io.vertx.core.json.JsonObject
import io.vertx.ext.web.client.WebClient
import io.vertx.ext.web.codec.BodyCodec
import io.vertx.junit5.VertxExtension
import io.vertx.junit5.VertxTestContext
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import java.net.ServerSocket
import java.util.concurrent.TimeUnit.SECONDS

@ExtendWith(VertxExtension::class)
internal object HttpsServerVerticleTest {

  private const val HOST_NAME = "localhost"
  private var port = 0

  @BeforeEach
  fun setUp(vertx: Vertx, testContext: VertxTestContext) {
    ServerSocket(0).use {
      port = it.localPort
    }

    val options = DeploymentOptions().setConfig(JsonObject()
        .put("HTTPS_CONNECTION_STRING", "https://$HOST_NAME:$port/"))
    vertx.deployVerticle(HttpsServerVerticle::class.java.name, options, testContext.completing())
  }

  @Test
  fun testServer(vertx: Vertx, testContext: VertxTestContext) {
    WebClient.create(vertx)[port, HOST_NAME, "/hi"]
        .`as`(BodyCodec.string())
        .send(testContext.succeeding { response ->
          testContext.verify {
            assertEquals("Hi there!", response.body())
            testContext.completeNow()
          }
        })

    assertTrue(testContext.awaitCompletion(5, SECONDS))
    if (testContext.failed())
      throw testContext.causeOfFailure()
  }
}