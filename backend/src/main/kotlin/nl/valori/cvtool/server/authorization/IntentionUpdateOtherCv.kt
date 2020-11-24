package nl.valori.cvtool.server.authorization

import nl.valori.cvtool.server.ModelUtils.toJsonObject
import nl.valori.cvtool.server.persistence.MONGODB_SAVE_ADDRESS

internal object IntentionUpdateOtherCv : Intention {

  override fun name() = "change other's cv"

  override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
    // Only consider 'saving' messages.
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
                // Referring to 'other' accountId(s)?
                when (instancesMap.keys.size) {
                  0 -> {}
                  1 -> if (!instancesMap.keys.contains(authInfo.accountId))
                    return true
                  else -> return true
                }
              }
              "role" -> {}
              "businessUnit" -> {}
              "cv" -> {
                // Referring to 'other' cvIds?
                if (!authInfo.cvIds.containsAll(instancesMap.keys))
                  return true
              }
              else -> {
                instancesMap.values
                    .mapNotNull { toJsonObject(it) } // Ignore 'criteria' and only consider 'instances'.
                    .forEach { instance ->
                      val accountId = instance.map["accountId"]
                      val cvId = instance.map["cvId"]
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
        }

    return false
  }
}