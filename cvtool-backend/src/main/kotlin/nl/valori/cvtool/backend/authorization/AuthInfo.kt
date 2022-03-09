package nl.valori.cvtool.backend.authorization

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.backend.authorization.AuthorizationLevel.CONSULTANT

internal class AuthInfo(val email: String, val name: String) {

    var accountId: String = ""
        private set
    private var authorizationLevel = CONSULTANT

    companion object {
        fun JsonObject.toAuthInfo() =
            AuthInfo(
                map["email"]?.toString() ?: error("Error creating AuthInfo: email not found."),
                map["name"]?.toString() ?: error("Error creating AuthInfo: name not found.")
            )
                .withAccountId(getString("accountId", ""))
                .withAuthorizationLevel(getString("authorizationLevel", ""))
    }

    fun toJson(): JsonObject =
        JsonObject()
            .put("email", email)
            .put("name", name)
            .put("accountId", accountId)
            .put("authorizationLevel", authorizationLevel.name)

    fun withAccountId(id: String): AuthInfo {
        accountId = id
        return this
    }

    fun withAuthorizationLevel(level: String): AuthInfo {
        authorizationLevel = AuthorizationLevel.values().asList().stream()
            .filter { it.name == level}
            .findAny()
            .orElse(CONSULTANT)
        return this
    }

    fun isAuthorized(requiredLevel: AuthorizationLevel) =
        authorizationLevel.includesOrSuperseeds(requiredLevel)
}