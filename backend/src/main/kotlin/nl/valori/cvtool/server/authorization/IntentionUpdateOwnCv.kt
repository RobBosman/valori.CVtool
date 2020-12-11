package nl.valori.cvtool.server.authorization

import nl.valori.cvtool.server.ModelUtils.toJsonObject
import nl.valori.cvtool.server.persistence.MONGODB_SAVE_ADDRESS

internal object IntentionUpdateOwnCv : Intention {

  override fun name() = "change own cv"

  override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
    // Only consider 'save' messages.
    if (address != MONGODB_SAVE_ADDRESS)
      return false

    val bodyJson = toJsonObject(body)
        ?: return false

    bodyJson.map.entries
        .forEach { (entityName, instances) ->
          val instancesMap = toJsonObject(instances)?.map
          if (instancesMap != null) { // Ignore 'criteria' (JsonArray) and only consider 'instances' (JsonObject).
            when (entityName) {
              "account" -> {
                // Referring to 'own' accountId(s) and NOT deleting the account?
                instancesMap.values
                    .mapNotNull { toJsonObject(it) }
                    .forEach { instance ->
                      if (instance.map["_id"] == authInfo.accountId)
                        return true
                    }
              }
              "businessUnit" -> {}
              "authorization" -> {}
              "cv" -> {
                // Only consider 'own' cvIds.
                if (instancesMap.keys.any(authInfo.cvIds::contains))
                  return true
              }
              else -> {
                instancesMap.values
                    .mapNotNull { toJsonObject(it) }
                    .forEach { instance ->
                      val accountId = instance.map["accountId"]
                      val cvId = instance.map["cvId"]
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
        }

    return false
  }
}