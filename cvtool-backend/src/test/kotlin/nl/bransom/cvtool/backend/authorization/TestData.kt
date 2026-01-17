package nl.bransom.cvtool.backend.authorization

import io.vertx.core.json.JsonObject
import nl.bransom.cvtool.backend.authorization.AuthInfo.Companion.toAuthInfo

internal object TestData {

    val authInfoTom =
        JsonObject(
            """{
                "email": "tom@vrt.be",
                "name": "Tom Testerom",
                "accountId": "account-id-of-tom",
                "authorizationLevel": "CONSULTANT"
            }"""
        ).toAuthInfo()

    val messageFetchAllAccounts = JsonObject(
        """{
            "account": [{}]
        }"""
    )

    val messageFetchAllBrands = JsonObject(
        """{
            "brand": [{}]
        }"""
    )

    val messageFetchAllBusinessUnits = JsonObject(
        """{
            "businessUnit": [{}]
        }"""
    )

    val messageFetchAllAuthorizations = JsonObject(
        """{
            "authorization": [{}]
        }"""
    )

    val messageFetchAuthInfoTom = JsonObject(
        """{
            "email": "tom@vrt.be",
            "name": "Tom Testerom"
        }"""
    )

    val messageGenerateCvTom = JsonObject(
        """{
            "accountId": "account-id-of-tom"
        }"""
    )

    val messageGenerateCvPascal = JsonObject(
        """{
            "accountId": "account-id-of-pascal"
        }"""
    )

    val messageFetchCharacteristicsByAccountIdTom = JsonObject(
        """{
            "characteristics": [{ "accountId": "account-id-of-tom" }]
        }"""
    )

    val messageFetchCharacteristicsByAccountIdPascal = JsonObject(
        """{
            "characteristics": [{ "accountId": "account-id-of-pascal" }]
        }"""
    )

    val messageSearchCvData = JsonObject(
        """{
            "searchText": "search-text"
        }"""
    )

    val messageFetchSkillTom = JsonObject(
        """{
            "skill": [{ "accountId": "account-id-of-tom" }]
        }"""
    )

    val messageFetchSkillPascal = JsonObject(
        """{
            "skill": [{ "accountId": "account-id-of-pascal" }]
        }"""
    )

    val messageSaveCharacteristicsTom = JsonObject(
        """{
            "characteristics": {
                "characteristics-id-of-tom": {
                    "_id": "characteristics-id-of-tom",
                    "accountId": "account-id-of-tom",
                    "key": "value"
                }
            }
        }"""
    )

    val messageSaveCharacteristicsPascal = JsonObject(
        """{
            "characteristics": {
                "characteristics-id-of-pascal": {
                    "_id": "characteristics-id-of-pascal",
                    "accountId": "account-id-of-pascal",
                    "key": "value"
                }
            }
        }"""
    )

    val messageSaveSkillTom = JsonObject(
        """{
            "skill": {
                "skill-id-of-tom": {
                    "_id": "skill-id-of-tom",
                    "accountId": "account-id-of-tom",
                    "key": "value"
                }
            }
        }"""
    )

    val messageSaveSkillPascal = JsonObject(
        """{
            "skill": {
                "skill-id-of-pascal": {
                    "_id": "skill-id-of-pascal",
                    "accountId": "account-id-of-pascal",
                    "key": "value"
                }
            }
        }"""
    )

    val messageSaveBrand = JsonObject(
        """{
            "brand": {
                "brand-id": {
                    "_id": "brand-id",
                    "name": "Cerios"
                }
            }
        }"""
    )

    val messageSaveBusinessUnit = JsonObject(
        """{
            "businessUnit": {
                "businessUnit-id": {
                    "_id": "businessUnit-id",
                    "contactPerson": "Pascal"
                }
            }
        }"""
    )

    val messageSaveAuthorizationPascal = JsonObject(
        """{
            "authorization": {
                "authorization-id-of-pascal": {
                    "_id": "authorization-id-of-pascal",
                    "accountId": "account-id-of-pascal",
                    "level": "ADMIN"
                }
            }
        }"""
    )

    val messageDeleteAccountPascal = JsonObject(
        """{
            "account": {
              "account-id-of-pascal": {}
            }
        }"""
    )

    val messageDeleteBrand = JsonObject(
        """{
            "brand": {
              "brand-id": {}
            }
        }"""
    )
}