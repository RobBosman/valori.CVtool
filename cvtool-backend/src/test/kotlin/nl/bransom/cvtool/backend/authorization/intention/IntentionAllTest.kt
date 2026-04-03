package nl.bransom.cvtool.backend.authorization.intention

import io.vertx.core.json.JsonObject
import nl.bransom.cvtool.backend.authorization.AUTH_INFO_FETCH_ADDRESS
import nl.bransom.cvtool.backend.authorization.AuthInfo
import nl.bransom.cvtool.backend.authorization.Intention
import nl.bransom.cvtool.backend.authorization.TestData.authInfoTom
import nl.bransom.cvtool.backend.cv.CV_DEMO_ADDRESS
import nl.bransom.cvtool.backend.cv.CV_REPORT_ADDRESS
import nl.bransom.cvtool.backend.persistence.ACCOUNT_DELETE_ADDRESS
import nl.bransom.cvtool.backend.persistence.BRAND_DELETE_ADDRESS
import nl.bransom.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS
import nl.bransom.cvtool.backend.persistence.MONGODB_SAVE_ADDRESS
import org.junit.jupiter.api.Test
import kotlin.test.assertFalse
import kotlin.test.assertTrue

internal class IntentionAllTest {

    companion object {
        private val ALL_INTENTIONS = listOf(
            IntentionCvDemo,
            IntentionCvReport,
            IntentionDeleteAccount,
            IntentionDeleteBrand,
            IntentionReadAllAccounts,
            IntentionReadAllAuthorizations,
            IntentionReadAllBrands,
            IntentionReadAllBusinessUnits,
            IntentionReadOtherCv,
            IntentionReadOwnAuthInfo,
            IntentionReadOwnCv,
            IntentionUpdateAuthorization,
            IntentionUpdateBrand,
            IntentionUpdateBusinessUnit,
            IntentionUpdateOwnCv,
            IntentionUpdateOtherCv
        )

        private val FETCH_ALL = JsonObject(
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

        private val SAVE_ALL = JsonObject(
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
                        "name": "Cerios"
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
    }

    private fun testAll(
        mongoEvent: String,
        body: JsonObject,
        authInfo: AuthInfo,
        vararg allowed: Intention
    ) {
        ALL_INTENTIONS.forEach { intentionToTest ->
            val message = "Testing class ${intentionToTest.javaClass.simpleName}"
            val result = intentionToTest.match(mongoEvent, body, authInfo)
            when {
                intentionToTest in allowed -> assertTrue(result, message)
                else -> assertFalse(result, message)
            }
        }
    }

    @Test
    fun testReadAll() {
        testAll(
            MONGODB_FETCH_ADDRESS, FETCH_ALL, authInfoTom,
            IntentionReadAllAccounts,
            IntentionReadAllAuthorizations,
            IntentionReadAllBrands,
            IntentionReadAllBusinessUnits,
            IntentionReadOtherCv,
            IntentionReadOwnCv
        )
    }

    @Test
    fun testSaveAll() {
        testAll(
            MONGODB_SAVE_ADDRESS, SAVE_ALL, authInfoTom,
            IntentionUpdateAuthorization,
            IntentionUpdateBrand,
            IntentionUpdateBusinessUnit,
            IntentionUpdateOwnCv,
            IntentionUpdateOtherCv
        )
    }

    @Test
    fun testReadOwnAuthInfo() {
        testAll(AUTH_INFO_FETCH_ADDRESS, FETCH_ALL, authInfoTom, IntentionReadOwnAuthInfo)
    }

    @Test
    fun testCvDemo() {
        testAll(CV_DEMO_ADDRESS, JsonObject(), authInfoTom, IntentionCvDemo)
    }

    @Test
    fun testCvReport() {
        testAll(CV_REPORT_ADDRESS, JsonObject(), authInfoTom, IntentionCvReport)
    }

    @Test
    fun testDeleteAccount() {
        testAll(ACCOUNT_DELETE_ADDRESS, SAVE_ALL, authInfoTom, IntentionDeleteAccount)
    }

    @Test
    fun testDeleteBrand() {
        testAll(BRAND_DELETE_ADDRESS, SAVE_ALL, authInfoTom, IntentionDeleteBrand)
    }
}