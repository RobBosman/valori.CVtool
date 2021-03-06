package nl.valori.cvtool.backend.authorization

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.backend.authorization.AuthInfo.Companion.toAuthInfo

internal object TestData {

    val authInfoTom =
        JsonObject(
            """{
                "email": "tom@vrt.be",
                "name": "Tom Testerom",
                "accountId": "account-id-of-tom",
                "authorizationLevel": "CONSULTANT",
                "cvIds": ["cv-id-of-tom"]
            }"""
        ).toAuthInfo()

    val messageFetchAllAccounts = JsonObject(
        """{
            "account": [{}]
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

    val messageFetchCvByAccountIdTom = JsonObject(
        """{
            "cv": [{ "accountId": "account-id-of-tom" }]
        }"""
    )

    val messageFetchCvByAccountIdPascal = JsonObject(
        """{
            "cv": [{ "accountId": "account-id-of-pascal" }]
        }"""
    )

    val messageFetchCvByCvIdTom = JsonObject(
        """{
            "cv": [{ "_id": "cv-id-of-tom" }]
        }"""
    )

    val messageFetchCvByCvIdPascal = JsonObject(
        """{
            "cv": [{ "_id": "cv-id-of-pascal" }]
        }"""
    )

    val messageSearchCvData = JsonObject(
        """{
            "searchText": "search-text"
        }"""
    )

    val messageFetchSkillTom = JsonObject(
        """{
            "skill": [{ "cvId": "cv-id-of-tom" }]
        }"""
    )

    val messageFetchSkillPascal = JsonObject(
        """{
            "skill": [{ "cvId": "cv-id-of-pascal" }]
        }"""
    )

    val messageSaveCvTom = JsonObject(
        """{
            "cv": {
                "cv-id-of-tom": {
                    "_id": "cv-id-of-tom",
                    "accountId": "account-id-of-tom",
                    "key": "value"
                }
            }
        }"""
    )

    val messageSaveCvPascal = JsonObject(
        """{
            "cv": {
                "cv-id-of-pascal": {
                    "_id": "cv-id-of-pascal",
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
                    "cvId": "cv-id-of-tom",
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
                    "cvId": "cv-id-of-pascal",
                    "key": "value"
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
            "accountId": "account-id-of-pascal"
        }"""
    )
}