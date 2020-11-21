package nl.valori.cvtool.server.authorization

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.AuthInfo
import nl.valori.cvtool.server.mongodb.MONGODB_SAVE_ADDRESS

internal object IntentionUpdateOwnCv : Intention {

  override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
    // Only consider 'saving' messages.
    if (address != MONGODB_SAVE_ADDRESS || body !is JsonObject)
      return false

    val ownRoleNames = authInfo.roles.map(AuthorizationRoles::name)

    body.map.entries.forEach { (entityName, instances) ->
      // Ignore 'criteria' and only consider 'instances'.
      if (instances !is Map<*, *>) {
        return false
      }

      when (entityName) {
        "account" -> {
          // Only allow 'own' accountId.
          if (!listOf(authInfo.accountId).containsAll(instances.keys))
            return false
          // Don't allow changing account roles.
          instances.values.forEach { instance ->
            if (instance !is Map<*, *>)
              return false
            val roles = instance["privileges"]
            if (roles !is List<*> || !ownRoleNames.containsAll(roles) || !roles.containsAll(ownRoleNames))
              return false
          }
        }
        "cv" -> {
          // Only allow 'own' cvIds.
          if (!authInfo.cvIds.containsAll(instances.keys))
            return false
        }
        else -> {
          instances.values.forEach { instance ->
            if (instance !is Map<*, *>)
              return false
            val accountId = instance["accountId"]
            val cvId = instance["cvId"]
            // Only accept instances that are related to an account or a cv instance.
            if (accountId == null && cvId == null)
              return false
            // Only allow 'own' accountId.
            if (accountId != null && accountId != authInfo.accountId)
              return false
            // Only allow 'own' cvIds.
            if (cvId != null && !authInfo.cvIds.contains(cvId))
              return false
          }
        }
      }
    }

    return true
  }
}