package nl.valori.cvtool.server.authorization

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.mongodb.MONGODB_SAVE_ADDRESS

internal object IntentionUpdateOwnCv : Intention {

  override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
    // Only consider 'save' messages.
    if (address != MONGODB_SAVE_ADDRESS || body !is JsonObject)
      return false

    body.map.entries
        .filter { (_, instances) -> instances is Map<*, *> } // Ignore 'criteria' and only consider 'instances'.
        .forEach { (entityName, instances) ->
          if (instances !is Map<*, *>)
            error("Expected instances to be of type Map<>, not '${instances.javaClass.name}'.")

          when (entityName) {
            "account" -> {
              // Only consider 'own' accountId.
              if (instances.keys.contains(authInfo.accountId))
                return true
            }
            "businessUnit" -> {}
            "role" -> {}
            "cv" -> {
              // Only consider 'own' cvIds.
              if (instances.keys.any(authInfo.cvIds::contains))
                return true
            }
            else -> {
              instances.values
                  .filterIsInstance<Map<*, *>>() // Ignore 'criteria' and only consider 'instances'.
                  .forEach { instance ->
                    val accountId = instance["accountId"]
                    val cvId = instance["cvId"]
                    // Queries that fetch all data also count here.
                    if (accountId == null && cvId == null)
                      return true
                    // Only consider 'own' accountId.
                    if (accountId == authInfo.accountId)
                      return true
                    // Only consider 'own' cvIds.
                    if (authInfo.cvIds.contains(cvId))
                      return true
                  }
            }
          }
        }

    return false
  }
}