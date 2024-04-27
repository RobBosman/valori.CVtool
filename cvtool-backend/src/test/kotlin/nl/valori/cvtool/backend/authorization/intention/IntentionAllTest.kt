package nl.valori.cvtool.backend.authorization.intention

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.backend.authorization.AUTH_INFO_FETCH_ADDRESS
import nl.valori.cvtool.backend.authorization.TestData.authInfoTom
import nl.valori.cvtool.backend.persistence.ACCOUNT_DELETE_ADDRESS
import nl.valori.cvtool.backend.persistence.BRAND_DELETE_ADDRESS
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
            "brand": [{}],
            "businessUnit": [{}],
            "characteristics": [
                { "accountId": "account-id-of-tom" },
                { "accountId": "account-id-of-pascal" },
                { "_id": "characteristics-id-of-tom" },
                { "_id": "characteristics-id-of-pascal" }
            ],
            "skill": [
                { "accountId": "account-id-of-tom" },
                { "accountId": "account-id-of-pascal" }
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
            "brand": {
                "brand-id": {
                    "_id": "brand-id",
                    "name": "Valori"
                }
            },
            "businessUnit": {
                "businessUnit-id": {
                    "_id": "businessUnit-id",
                    "contactPerson": "Pascal Klankman"
                }
            },
            "characteristics": {
                "characteristics-id-of-tom": {
                    "_id": "characteristics-id-of-tom",
                    "accountId": "account-id-of-tom",
                    "key": "value"
                },
                "characteristics-id-of-pascal": {
                    "_id": "characteristics-id-of-pascal",
                    "accountId": "account-id-of-pascal",
                    "key": "value"
                }
            },
            "skill": {
                "skill-id-of-tom": {
                    "_id": "skill-id-of-tom",
                    "accountId": "account-id-of-tom",
                    "key": "value"
                },
                "skill-id-of-pascal": {
                    "_id": "skill-id-of-pascal",
                    "accountId": "account-id-of-pascal",
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
            IntentionReadAllBrands,
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
            IntentionUpdateBrand,
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
        assertTrue(
            IntentionDeleteBrand.match(BRAND_DELETE_ADDRESS, bodySaveAll, authInfoTom),
            "Testing class ${IntentionDeleteBrand.javaClass.simpleName}"
        )
    }
}