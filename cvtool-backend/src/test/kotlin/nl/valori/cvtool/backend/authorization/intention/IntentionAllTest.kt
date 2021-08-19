package nl.valori.cvtool.backend.authorization.intention

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.backend.authorization.AUTH_INFO_FETCH_ADDRESS
import nl.valori.cvtool.backend.authorization.TestData.authInfoTom
import nl.valori.cvtool.backend.persistence.ACCOUNT_DELETE_ADDRESS
import nl.valori.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS
import nl.valori.cvtool.backend.persistence.MONGODB_SAVE_ADDRESS
import org.junit.jupiter.api.Test
import kotlin.test.assertTrue

internal class IntentionAllTest {

    private val bodyFetchAll = JsonObject(
        """{
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
            ],
            "searchText": "search-text"
        }"""
    )

    private val bodySaveAll = JsonObject(
        """{
            "account": {
                "account-id-to-delete": {}
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
            },
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
        }"""
    )

    @Test
    fun testReadAll() {
        listOf(
            IntentionReadAllAccounts,
            IntentionReadAllAuthorizations,
            IntentionReadAllBusinessUnits,
            IntentionReadOtherCv,
            IntentionReadOwnCv
        )
            .forEach { intentionToTest ->
                assertTrue(
                    intentionToTest.match(MONGODB_FETCH_ADDRESS, bodyFetchAll, authInfoTom),
                    "Testing class ${intentionToTest.javaClass.simpleName}"
                )
            }
    }

    @Test
    fun testSaveAll() {
        listOf(
            IntentionUpdateAuthorization,
            IntentionUpdateBusinessUnit,
            IntentionUpdateOwnCv,
            IntentionUpdateOtherCv
        )
            .forEach { intentionToTest ->
                assertTrue(
                    intentionToTest.match(MONGODB_SAVE_ADDRESS, bodySaveAll, authInfoTom),
                    "Testing class ${intentionToTest.javaClass.simpleName}"
                )
            }
    }

    @Test
    fun testMiscellanea() {
        assertTrue(
            IntentionReadOwnAuthInfo.match(AUTH_INFO_FETCH_ADDRESS, bodyFetchAll, authInfoTom),
            "Testing class ${IntentionReadOwnAuthInfo.javaClass.simpleName}"
        )
        assertTrue(
            IntentionDeleteAccount.match(ACCOUNT_DELETE_ADDRESS, bodySaveAll, authInfoTom),
            "Testing class ${IntentionDeleteAccount.javaClass.simpleName}"
        )
    }
}