package nl.valori.cvtool.server.authorization

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.mongodb.MONGODB_SAVE_ADDRESS

internal object IntentionUpdateOwnCv : Intention {

  override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
    // Only consider 'save' messages.
    if (address != MONGODB_SAVE_ADDRESS || body !is JsonObject)
      return false

    val ownRoleNames = authInfo.roles.map(AuthorizationRoles::name)

    body.map.entries
        .forEach { (entityName, instances) ->
          // Ignore 'criteria' and only consider 'instances'.
          if (instances !is Map<*, *>) {
            return false
          }

          when (entityName) {
            "account" -> {
              // Only consider 'own' accountId.
              if (!listOf(authInfo.accountId).containsAll(instances.keys))
                return false
              // Don't allow changing account roles.
              instances.values
                  .forEach { instance ->
                    // Ignore 'criteria' and only consider 'instances'.
                    if (instance !is Map<*, *>)
                      return false
                    // The applied account roles must exactly match the own roles.
                    val roles = instance["roles"]
                    if (roles !is List<*> || !ownRoleNames.containsAll(roles) || !roles.containsAll(ownRoleNames))
                      return false
                  }
            }
            "role" -> {
              // Ignore queries that change account roles.
              instances.values
                  .forEach { instance ->
                    // Only consider 'instances', ignore 'criteria'.
                    if (instance is Map<*, *>)
                      return false
                  }
            }
            "cv" -> {
              // Only consider 'own' cvIds.
              if (!authInfo.cvIds.containsAll(instances.keys))
                return false
            }
            else -> {
              instances.values
                  .forEach { instance ->
                    // Ignore 'criteria' and only consider 'instances'.
                    if (instance !is Map<*, *>)
                      return false
                    val accountId = instance["accountId"]
                    val cvId = instance["cvId"]
                    // Only consider instances that are related to an account or a cv instance.
                    if (accountId == null && cvId == null)
                      return false
                    // Only consider 'own' accountId.
                    if (accountId != null && accountId != authInfo.accountId)
                      return false
                    // Only consider 'own' cvIds.
                    if (cvId != null && !authInfo.cvIds.contains(cvId))
                      return false
                  }
            }
          }
        }

    return true
  }
}