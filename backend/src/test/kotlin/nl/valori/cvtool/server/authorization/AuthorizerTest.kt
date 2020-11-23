package nl.valori.cvtool.server.authorization

import io.vertx.core.json.JsonObject
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

internal object AuthorizerTest {

  private val messageDeleteNothing = JsonObject("""{
      "cv": {
        "cv-id-of-tom": {
          "_id": "cv-id-of-tom"
        },
        "cv-id-of-pascal": {
          "_id": "cv-id-of-pascal"
        }
      },
      "skill": {
        "skill-id-of-tom": {
          "_id": "skill-id-of-tom"
        },
        "skill-id-of-pascal": {
          "_id": "skill-id-of-pascal"
        }
      }
    }""")

  private val messageDeleteAll = JsonObject("""{
      "cv": {
        "cv-id-of-tom": {},
        "cv-id-of-pascal": {}
      },
      "skill": {
        "skill-id-of-tom": {},
        "skill-id-of-pascal": {}
      }
    }""")

  private val expectedQuery = JsonObject("""{
      "cv": [
        { "_id": "cv-id-of-tom" },
        { "_id": "cv-id-of-pascal" }
      ],
      "skill": [
        { "_id": "skill-id-of-tom" },
        { "_id": "skill-id-of-pascal" }
      ]
    }""")

  @Test
  fun testDeleteNothing() {
    assertTrue(Authorizer.createQueryForDataToBeDeleted(messageDeleteNothing).isEmpty())
  }

  @Test
  fun testDeleteAll() {
    assertEquals(expectedQuery.encodePrettily(),
        JsonObject(Authorizer.createQueryForDataToBeDeleted(messageDeleteAll)).encodePrettily())
  }
}