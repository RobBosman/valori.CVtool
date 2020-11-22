package nl.valori.cvtool.server.authorization

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.mongodb.MONGODB_SAVE_ADDRESS

internal object IntentionUpdateOtherCv : Intention {

  override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
    // Only consider 'saving' messages.
    if (address != MONGODB_SAVE_ADDRESS || body !is JsonObject)
      return false

    body.map.entries
        .filter { (_, instances) -> instances is Map<*, *> } // Ignore 'criteria' and only consider 'instances'.
        .forEach { (entityName, instances) ->
          if (instances !is Map<*, *>)
            error("Expected instances to be of type Map<>, not '${instances.javaClass.name}'.")

          when (entityName) {
            "account" -> {
              // Referring to 'other' accountId(s)?
              when (instances.keys.size) {
                0 -> {}
                1 -> if (!instances.keys.contains(authInfo.accountId))
                  return true
                else -> return true
              }
            }
            "role" -> {}
            "businessUnit" -> {}
            "cv" -> {
              // Referring to 'other' cvIds?
              if (!authInfo.cvIds.containsAll(instances.keys))
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
                    if (accountId != null && accountId != authInfo.accountId)
                      return true
                    // Only allow 'own' cvIds.
                    if (cvId != null && !authInfo.cvIds.contains(cvId))
                      return true
                  }
            }
          }
        }

    return false
  }
}