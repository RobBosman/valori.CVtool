package nl.valori.cvtool.server

import io.vertx.core.DeploymentOptions
import io.vertx.core.Vertx
import io.vertx.core.json.JsonObject
import io.vertx.core.net.PemTrustOptions
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
import kotlin.test.assertEquals

@ExtendWith(VertxExtension::class)
internal object HttpsServerVerticleTest {

  private const val HOST_NAME = "localhost"

  private fun runHttpsServer(vertx: Vertx, testContext: VertxTestContext): Int {
    val port = ServerSocket(0).use { it.localPort }
    vertx.deployVerticle(
        HttpsServerVerticle::class.java.name,
        DeploymentOptions()
            .setConfig(JsonObject()
                .put("HTTPS_CONNECTION_STRING", "https://$HOST_NAME:$port/")
            ),
        testContext.succeedingThenComplete()
    )
    return port
  }

  @Test
  fun testServer(vertx: Vertx, testContext: VertxTestContext) {
    val port = runHttpsServer(vertx, testContext)

    WebClient
        .create(vertx, WebClientOptions()
            .setSsl(true)
            .setPemTrustOptions(PemTrustOptions().addCertValue(HttpsServerVerticle.sslCert))
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

  @Test
  fun testReplaceEntityInstances() {
    val sourceJson = JsonObject("""{
      "cv": {
        "cv-id-of-tom": {
          "_id": "cv-id-of-tom",
          "accountId": "account-id-of-tom",
          "key": "value"
        },
        "cv-id-of-pascal": {}
      },
      "skill": {
        "skill-id-of-tom": {},
        "skill-id-of-pascal": {
          "_id": "skill-id-of-pascal",
          "cvId": "cv-id-of-pascal",
          "key": "value"
        }
      }
    }""")
    val replacementJson = JsonObject("""{
      "cv": {
         "cv-id-of-pascal": {
           "_id": "cv-id-of-pascal",
          "accountId": "account-id-of-pascal",
          "key": "value"
         }
      },
      "skill": {
        "skill-id-of-tom": {
          "_id": "skill-id-of-tom",
          "cvId": "cv-id-of-tom",
          "key": "value"
        }
      }
    }""")
    val resultJson = JsonObject("""{
      "cv": {
        "cv-id-of-tom": {
          "_id": "cv-id-of-tom",
          "accountId": "account-id-of-tom",
          "key": "value"
        },
        "cv-id-of-pascal": {
          "_id": "cv-id-of-pascal",
          "accountId": "account-id-of-pascal",
          "key": "value"
        }
      },
      "skill": {
        "skill-id-of-tom": {
          "_id": "skill-id-of-tom",
          "cvId": "cv-id-of-tom",
          "key": "value"
        },
        "skill-id-of-pascal": {
          "_id": "skill-id-of-pascal",
          "cvId": "cv-id-of-pascal",
          "key": "value"
        }
      }
    }""")

    val orgSource = sourceJson.encodePrettily()

    assertEquals(resultJson.encodePrettily(),
        HttpsServerVerticle().replaceEntityInstances(sourceJson, emptyMap(), replacementJson).encodePrettily())
    assertEquals(orgSource, sourceJson.encodePrettily())
  }
}