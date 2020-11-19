package nl.valori.cvtool.server

import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.server.authorization.AuthorizationRoles

internal class AuthInfo(val email: String, val name: String) {

  var accountId: String = ""
  var cvIds: Set<String> = emptySet()
  private var roles: Set<AuthorizationRoles> = emptySet()

  companion object {
    const val AUTH_INFO_HEADER_TAG = "AuthInfo"

    fun getAuthInfo(message: Message<JsonObject>): AuthInfo {
      val authInfoString = message.headers()[AUTH_INFO_HEADER_TAG]
          ?: error("Cannot get '$AUTH_INFO_HEADER_TAG' message header.")
      return fromJson(JsonObject(authInfoString))
    }

    fun fromJson(authInfoJson: JsonObject): AuthInfo {
      val email = authInfoJson.getString("email") ?: error("Error creating AuthInfo: email not found.")
      val name = authInfoJson.getString("name") ?: error("Error creating AuthInfo: name not found.")
      val authInfo = AuthInfo(email, name)
      authInfo.accountId = authInfoJson.getString("accountId")
      authInfo.setCvIds(authInfoJson.getJsonArray("cvIds"))
      authInfo.setRoles(authInfoJson.getJsonArray("roles"))
      return authInfo
    }
  }

  fun setCvIds(cvIdsJson: JsonArray) {
    cvIds = cvIdsJson.map { it.toString() }.toSet()
  }

  fun setRoles(rolesJson: JsonArray) {
    roles = rolesJson.map { AuthorizationRoles.valueOf(it.toString()) }.toSet()
  }

  fun isAuthorized(authorizedRoles: Set<AuthorizationRoles>) =
      authorizedRoles.isEmpty() || authorizedRoles.stream()
          .anyMatch { roles.contains(it) }

  fun asJson(): JsonObject =
      JsonObject()
          .put("email", email)
          .put("name", name)
          .put("accountId", accountId)
          .put("roles", JsonArray(roles.toList()))
          .put("cvIds", JsonArray(cvIds.toList()))
}