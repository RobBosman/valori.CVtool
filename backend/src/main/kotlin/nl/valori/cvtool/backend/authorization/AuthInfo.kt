package nl.valori.cvtool.backend.authorization

import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import nl.valori.cvtool.backend.authorization.AuthorizationLevel.CONSULTANT

internal class AuthInfo(val email: String, val name: String) {

    var accountId: String = ""
        private set
    private var authorizationLevel = CONSULTANT
    var cvIds: Set<String> = emptySet()
        private set

    companion object {
        fun fromJson(json: JsonObject) =
            AuthInfo(
                json.map["email"]?.toString() ?: error("Error creating AuthInfo: email not found."),
                json.map["name"]?.toString() ?: error("Error creating AuthInfo: name not found.")
            )
                .withAccountId(json.getString("accountId", ""))
                .withAuthorizationLevel(json.getString("authorizationLevel", ""))
                .withCvIds(json.getJsonArray("cvIds"))
    }

    fun toJson(): JsonObject =
        JsonObject()
            .put("email", email)
            .put("name", name)
            .put("accountId", accountId)
            .put("authorizationLevel", authorizationLevel.name)
            .put("cvIds", JsonArray(cvIds.toList()))

    fun withAccountId(id: String): AuthInfo {
        accountId = id
        return this
    }

    fun withAuthorizationLevel(level: String): AuthInfo {
        try {
            authorizationLevel = AuthorizationLevel.valueOf(level)
        } catch (_: Exception) {
            CONSULTANT
        }
        return this
    }

    fun withCvIds(json: JsonArray): AuthInfo {
        cvIds = json.map { it.toString() }.toSet()
        return this
    }

    fun withCvIds(cvIds: Set<String>): AuthInfo {
        this.cvIds = cvIds
        return this
    }

    fun isAuthorized(requiredAuthorizationLevel: AuthorizationLevel) =
        authorizationLevel.includesOrSuperseeds(requiredAuthorizationLevel)
}