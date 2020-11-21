package nl.valori.cvtool.server.authorization

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.mongodb.MONGODB_SAVE_ADDRESS

internal object IntentionUpdateOtherCv : Intention {

  override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
    // Only consider 'saving' messages.
    if (address != MONGODB_SAVE_ADDRESS || body !is JsonObject)
      return false

    var updatesOtherAccount = false
    var updatesOtherCv = false

    body.map.entries
        .forEach { (entityName, instances) ->
          // Ignore 'criteria' and only consider 'instances'.
          if (instances !is Map<*, *>) {
            return false
          }

          when (entityName) {
            "account" -> {
              // Referring to 'other' accountIds?
              if (!listOf(authInfo.accountId).containsAll(instances.keys))
                updatesOtherAccount = true
              instances.values
                  .forEach { instance ->
                    // Ignore 'criteria' and only consider 'instances'.
                    if (instance !is Map<*, *>)
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
              // Referring to 'other' cvIds?
              if (!authInfo.cvIds.containsAll(instances.keys))
                updatesOtherCv = true
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
                      updatesOtherAccount = true
                    // Only allow 'own' cvIds.
                    if (cvId != null && !authInfo.cvIds.contains(cvId))
                      updatesOtherCv = true
                  }
            }
          }
        }
    return updatesOtherAccount || updatesOtherCv
  }
}