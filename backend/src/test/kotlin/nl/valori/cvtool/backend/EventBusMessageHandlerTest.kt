package nl.valori.cvtool.backend

import io.vertx.core.json.JsonObject
import org.junit.jupiter.api.Test

internal class EventBusMessageHandlerTest {

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

    kotlin.test.assertEquals(resultJson.encodePrettily(),
        EventBusMessageHandler.replaceEntityInstances(sourceJson, emptyMap(), replacementJson).encodePrettily())
    kotlin.test.assertEquals(orgSource, sourceJson.encodePrettily())
  }
}