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
          if (instancesMap != null) { // Ignore 'criteria' and only consider 'instances'.
            when (entityName) {
              "account" -> {
                // Only consider 'own' accountId.
                if (instancesMap.keys.contains(authInfo.accountId))
                  return true
              }
              "businessUnit" -> {
              }
              "role" -> {
              }
              "cv" -> {
                // Only consider 'own' cvIds.
                if (instancesMap.keys.any(authInfo.cvIds::contains))
                  return true
              }
              else -> {
                instancesMap.values
                    .mapNotNull { toJsonObject(it) } // Ignore 'criteria' and only consider 'instances'.
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