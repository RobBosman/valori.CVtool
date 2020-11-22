package nl.valori.cvtool.server.authorization

import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.authorization.AuthorizationRoles.CONSULTANT

internal class AuthInfo(val email: String, val name: String) {

  var accountId: String = ""
  private var roles: Set<AuthorizationRoles> = setOf(CONSULTANT)
  var cvIds: Set<String> = emptySet()
    private set

  companion object {
    fun fromJson(json: JsonObject) =
        AuthInfo(
            json.map["email"]?.toString() ?: error("Error creating AuthInfo: email not found."),
            json.map["name"]?.toString() ?: error("Error creating AuthInfo: name not found."))
            .withAccountId(json.getString("accountId", ""))
            .withRoles(json.getJsonArray("roles"))
            .withCvIds(json.getJsonArray("cvIds"))
  }

  fun toJson(): JsonObject =
      JsonObject()
          .put("email", email)
          .put("name", name)
          .put("accountId", accountId)
          .put("roles", JsonArray(roles.toList()))
          .put("cvIds", JsonArray(cvIds.toList()))

  fun withAccountId(id: String): AuthInfo {
    accountId = id
    return this
  }

  fun withRoles(json: JsonArray): AuthInfo {
    json.add(CONSULTANT.name)
    roles = json
        .map {
          try { AuthorizationRoles.valueOf(it.toString()) }
          catch (_: Exception) { CONSULTANT }
        }
        .toSet()
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

  fun isAuthorized(authorizedRoles: Set<AuthorizationRoles>) =
      authorizedRoles.isEmpty() || authorizedRoles.stream()
          .anyMatch { roles.contains(it) }
}