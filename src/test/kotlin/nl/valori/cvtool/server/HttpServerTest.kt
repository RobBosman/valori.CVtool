package nl.valori.cvtool.server

import io.vertx.core.Vertx
import io.vertx.ext.web.client.WebClient
import io.vertx.ext.web.codec.BodyCodec
import io.vertx.junit5.VertxExtension
import io.vertx.junit5.VertxTestContext
import nl.valori.cvtool.server.HttpServer.Companion.HOST_NAME
import nl.valori.cvtool.server.HttpServer.Companion.PORT
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import java.util.concurrent.TimeUnit.SECONDS

@ExtendWith(VertxExtension::class)
internal object HttpServerTest {

  private val server = HttpServer()

  @BeforeEach
  fun setUp(vertx: Vertx, testContext: VertxTestContext) {
    vertx.deployVerticle(server, testContext.completing())
  }

  @Test
  fun testServer(vertx: Vertx, testContext: VertxTestContext) {
    WebClient.create(vertx)[PORT, HOST_NAME, "/"]
        .`as`(BodyCodec.string())
        .send(testContext.succeeding { response ->
          testContext.verify {
            assertEquals("Hello there!", response.body())
            testContext.completeNow()
          }
        })

    assertTrue(testContext.awaitCompletion(5, SECONDS))
    if (testContext.failed())
      throw testContext.causeOfFailure()
  }
}