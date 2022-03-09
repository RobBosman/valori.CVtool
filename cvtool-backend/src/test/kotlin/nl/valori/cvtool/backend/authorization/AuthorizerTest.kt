package nl.valori.cvtool.backend.authorization

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.backend.authorization.TestData.authInfoTom
import nl.valori.cvtool.backend.authorization.TestData.messageFetchCharacteristicsByAccountIdTom
import nl.valori.cvtool.backend.authorization.TestData.messageSaveCharacteristicsPascal
import nl.valori.cvtool.backend.authorization.TestData.messageSaveCharacteristicsTom
import nl.valori.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS
import nl.valori.cvtool.backend.persistence.MONGODB_SAVE_ADDRESS
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue
import kotlin.test.fail

internal class AuthorizerTest {

    private val messageDeleteNothing = JsonObject(
        """{
            "characteristics": {
                "characteristics-id-of-tom": {
                    "_id": "characteristics-id-of-tom"
                },
                "characteristics-id-of-pascal": {
                    "_id": "characteristics-id-of-pascal"
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
        }"""
    )

    private val messageDeleteAll = JsonObject(
        """{
            "characteristics": {
                "characteristics-id-of-tom": {},
                "characteristics-id-of-pascal": {}
            },
            "skill": {
                "skill-id-of-tom": {},
                "skill-id-of-pascal": {}
            }
        }"""
    )

    private val expectedQuery = JsonObject(
        """{
            "characteristics": [
                "characteristics-id-of-tom",
                "characteristics-id-of-pascal"
            ],
            "skill": [
                "skill-id-of-tom",
                "skill-id-of-pascal"
            ]
        }"""
    )

    @Test
    fun testDeleteNothing() {
        assertTrue(Authorizer.determineDataToBeDeleted(messageDeleteNothing).isEmpty())
    }

    @Test
    fun testDeleteAll() {
        assertEquals(
            expectedQuery.encodePrettily(),
            JsonObject(Authorizer.determineDataToBeDeleted(messageDeleteAll)).encodePrettily()
        )
    }

    @Test
    fun testAuthorize() {
        assertAllowed(MONGODB_FETCH_ADDRESS, messageFetchCharacteristicsByAccountIdTom, authInfoTom)
        assertAllowed(MONGODB_SAVE_ADDRESS, messageSaveCharacteristicsTom, authInfoTom)
        assertProhibited(MONGODB_SAVE_ADDRESS, messageSaveCharacteristicsPascal, authInfoTom)
    }

    private fun assertAllowed(address: String, messageData: Any?, authInfo: AuthInfo) {
        Authorizer.authorizeIntention(address, messageData, authInfo)
    }

    private fun assertProhibited(address: String, messageData: Any?, authInfo: AuthInfo) {
        try {
            Authorizer.authorizeIntention(address, messageData, authInfo)
            fail("Expected IllegalAccessException is not thrown.")
        } catch (_: IllegalAccessException) {
            // ok
        }
    }

    @Test
    fun testReplaceEntityInstances() {
        val sourceJson = JsonObject(
            """{
                "characteristics": {
                    "characteristics-id-of-tom": {
                        "_id": "characteristics-id-of-tom",
                        "accountId": "account-id-of-tom",
                        "key": "value"
                    },
                    "characteristics-id-of-pascal": {}
                },
                "skill": {
                    "skill-id-of-tom": {},
                    "skill-id-of-pascal": {
                        "_id": "skill-id-of-pascal",
                        "accountId": "account-id-of-pascal",
                        "key": "value"
                    }
                }
            }"""
        )
        val replacementJson = JsonObject(
            """{
                "characteristics": {
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
                    }
                }
            }"""
        )
        val resultJson = JsonObject(
            """{
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

        val orgSource = sourceJson.encodePrettily()

        assertEquals(
            resultJson.encodePrettily(),
            Authorizer.replaceEntityInstances(sourceJson, emptyMap(), replacementJson).encodePrettily()
        )
        assertEquals(orgSource, sourceJson.encodePrettily())
    }
}