package nl.valori.cvtool.server.authorization

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.AuthInfo
import nl.valori.cvtool.server.mongodb.MONGODB_SAVE_ADDRESS

internal object IntentionUpdateRoles: Intention {

  override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
    // Only consider save queries.
    if (address != MONGODB_SAVE_ADDRESS || body !is JsonObject)
      return false

    // Only consider queries updating accounts.
    val accountInstances = body.map["account"]
        ?: return false
    if (accountInstances !is Map<*, *>)
      return false

    var updatesRoles = false
    val ownRoleNames = authInfo.roles.map(AuthorizationRoles::name)
    accountInstances.values.forEach { accountInstance ->
      if (accountInstance !is Map<*, *>)
        return false
      // Only consider queries that change account roles.
      // TODO: verify role changes when storing the account of 'others'.
      val roles = accountInstance["privileges"]
      if (roles !is List<*> || !ownRoleNames.containsAll(roles) || !roles.containsAll(ownRoleNames))
        updatesRoles = true
    }
    return updatesRoles
  }
}