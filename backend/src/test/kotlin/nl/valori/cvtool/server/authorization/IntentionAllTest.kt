package nl.valori.cvtool.server.authorization

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.authorization.TestData.authInfoTom
import nl.valori.cvtool.server.persistence.MONGODB_FETCH_ADDRESS
import nl.valori.cvtool.server.persistence.MONGODB_SAVE_ADDRESS
import org.junit.jupiter.api.Test
import kotlin.test.assertTrue

internal object IntentionAllTest {

  private val bodyFetchAll = JsonObject("""{
      "email": "tom@vrt.be",
      "name": "Tom Testerom",
      "account": [
        {},
        { "_id": "account-id-of-tom" }
      ],
      "authorization": [{}],
      "businessUnit": [{}],
      "cv": [
        { "accountId": "account-id-of-tom" },
        { "accountId": "account-id-of-pascal" },
        { "_id": "cv-id-of-tom" },
        { "_id": "cv-id-of-pascal" }
      ],
      "skill": [
        { "cvId": "cv-id-of-tom" },
        { "cvId": "cv-id-of-pascal" }
      ]
  }""")

  private val bodySaveAll = JsonObject("""{
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
      },
      "authorization": {
        "authorization-id-of-pascal": {
          "_id": "authorization-id-of-pascal",
          "accountId": "account-id-of-pascal",
          "name": "ADMIN"
        }
      },
      "businessUnit": {
        "businessUnit-id": {
          "_id": "businessUnit-id",
          "contactPerson": "Pascal Klankman"
        }
      }
  }""")

  @Test
  fun testReadAll() {
    listOf(
        IntentionReadOwnCv,
        IntentionReadOtherCv,
        IntentionReadAllAccounts,
        IntentionReadAllBusinessUnits,
        IntentionReadAllAuthorizations)
        .forEach { intentionToTest ->
          assertTrue(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodyFetchAll, authInfoTom),
              "Testing class ${intentionToTest.javaClass.simpleName}")
        }
  }

  @Test
  fun testSaveAll() {
    listOf(
        IntentionUpdateOwnCv,
        IntentionUpdateOtherCv,
        IntentionUpdateAuthorizations,
        IntentionUpdateBusinessUnits)
        .forEach { intentionToTest ->
          assertTrue(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodySaveAll, authInfoTom),
              "Testing class ${intentionToTest.javaClass.simpleName}")
        }
  }
}