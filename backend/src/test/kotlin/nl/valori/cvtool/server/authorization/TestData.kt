package nl.valori.cvtool.server.authorization

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.AuthInfo

internal object TestData {

  val authInfoTom = AuthInfo.fromJson(JsonObject("""{
      "email": "tom@vrt.be",
      "name": "Tom Testerom",
      "roles": [],
      "accountId": "account-id-of-tom",
      "cvIds": ["cv-id-of-tom"]
    }""".trimIndent()))

  val bodyFetchAllAccounts = JsonObject("""{
      "account": [{}]
    }""".trimIndent())

  val bodyFetchAllBusinessUnits = JsonObject("""{
      "businessUnit": [{}]
    }""".trimIndent())

  val bodyFetchAuthInfoTom = JsonObject("""{
      "email": "tom@vrt.be",
      "name": "Tom Testerom"
    }""".trimIndent())

  val bodyGenerateCvTom = JsonObject("""{
      "accountId": "account-id-of-tom"
    }""".trimIndent())

  val bodyGenerateCvPascal = JsonObject("""{
      "accountId": "account-id-of-pascal"
    }""".trimIndent())

  val bodyFetchCvByAccountIdTom = JsonObject("""{
      "cv": [{ "accountId": "account-id-of-tom" }]
    }""".trimIndent())

  val bodyFetchCvByAccountIdPascal = JsonObject("""{
      "cv": [{ "accountId": "account-id-of-pascal" }]
    }""".trimIndent())

  val bodyFetchCvByCvIdTom = JsonObject("""{
      "cv": [{ "_id": "cv-id-of-tom" }]
    }""".trimIndent())

  val bodyFetchCvByCvIdPascal = JsonObject("""{
      "cv": [{ "_id": "cv-id-of-pascal" }]
    }""".trimIndent())

  val bodyFetchSkillTom = JsonObject("""{
      "skill": [{ "cvId": "cv-id-of-tom" }]
    }""".trimIndent())

  val bodyFetchSkillPascal = JsonObject("""{
      "skill": [{ "cvId": "cv-id-of-pascal" }]
    }""".trimIndent())
  
  val bodySaveCvTom = JsonObject("""{
      "cv": {
        "cv-id-of-tom": {
          "_id": "cv-id-of-tom",
          "accountId": "account-id-of-tom",
          "key": "value"
        }
      }
    }""".trimIndent())

  val bodySaveCvPascal = JsonObject("""{
      "cv": {
        "cv-id-of-pascal": {
          "_id": "cv-id-of-pascal",
          "accountId": "account-id-of-pascal",
          "key": "value"
        }
      }
    }""".trimIndent())
  
  val bodySaveSkillTom = JsonObject("""{
      "skill": {
        "skill-id": {
          "_id": "skill-id",
          "cvId": "cv-id-of-tom",
          "key": "value"
        }
      }
    }""".trimIndent())

  val bodySaveSkillPascal = JsonObject("""{
      "skill": {
        "skill-id": {
          "_id": "skill-id",
          "cvId": "cv-id-of-pascal",
          "key": "value"
        }
      }
    }""".trimIndent())

  val bodySaveAccountRoleTom = JsonObject("""{
      "account": {
        "account-id-of-tom": {
          "_id": "account-id-of-tom",
          "privileges": ["ADMIN"],
          "key": "value"
        }
      }
    }""".trimIndent())

  val bodySaveAccountRolePascal = JsonObject("""{
      "account": {
        "account-id-of-pascal": {
          "_id": "account-id-of-pascal",
          "privileges": ["ADMIN"],
          "key": "value"
        }
      }
    }""".trimIndent())
}