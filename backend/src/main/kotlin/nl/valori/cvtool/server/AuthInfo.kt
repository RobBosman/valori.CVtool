package nl.valori.cvtool.server

import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.authorization.AuthorizationRoles

internal class AuthInfo(val email: String, val name: String) {

  private var roles: Set<AuthorizationRoles> = emptySet()
  var accountId: String = ""
  var cvIds: Set<String> = emptySet()

  companion object {
    fun fromJson(json: JsonObject) =
        AuthInfo(
            json.map["email"]?.toString() ?: error("Error creating AuthInfo: email not found."),
            json.map["name"]?.toString() ?: error("Error creating AuthInfo: name not found."))
            .withRoles(json.getJsonArray("roles"))
            .withAccountId(json.getString("accountId", ""))
            .withCvIds(json.getJsonArray("cvIds"))
  }

  fun toJson(): JsonObject =
      JsonObject()
          .put("email", email)
          .put("name", name)
          .put("accountId", accountId)
          .put("cvIds", JsonArray(cvIds.toList()))
          .put("roles", JsonArray(roles.toList()))

  fun withRoles(json: JsonArray): AuthInfo {
    roles = json.map { AuthorizationRoles.valueOf(it.toString()) }.toSet()
    return this
  }

  fun withAccountId(id: String): AuthInfo {
    accountId = id
    return this
  }

  fun withCvIds(json: JsonArray): AuthInfo {
    cvIds = json.map { it.toString() }.toSet()
    return this
  }

  fun isAuthorized(authorizedRoles: Set<AuthorizationRoles>) =
      authorizedRoles.isEmpty() || authorizedRoles.stream()
          .anyMatch { roles.contains(it) }
}