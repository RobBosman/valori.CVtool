package nl.valori.cvtool.server.authorization

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.AuthInfo
import nl.valori.cvtool.server.CV_FETCH_ADDRESS
import nl.valori.cvtool.server.mongodb.MONGODB_FETCH_ADDRESS

internal object IntentionReadOwnCv: Intention {

  override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
    if (body !is JsonObject)
      return false

    if (address == CV_FETCH_ADDRESS && body.getString("accountId", "") == authInfo.accountId)
      return true

    if (address != MONGODB_FETCH_ADDRESS)
      return false

    body.map.entries.forEach { (entityName, criteria) ->
      // Ignore 'instances' and only consider 'criteria'.
      if (criteria !is List<*>) {
        return false
      }

      when (entityName) {
        "account" -> {
          // Only allow fetching 'own' accounts.
          criteria.forEach { criterion ->
            if (criterion !is Map<*, *>)
              return false
            val accountIdCriterion = criterion["_id"]
            if (accountIdCriterion != null && authInfo.accountId != accountIdCriterion)
              return false
          }
        }
        "cv" -> {
          // Only allow fetching 'own' cvs.
          criteria.forEach { criterion ->
            if (criterion !is Map<*, *>)
              return false
            val cvIdCriterion = criterion["_id"]
            if (cvIdCriterion != null && !authInfo.cvIds.contains(cvIdCriterion))
              return false
            val accountIdCriterion = criterion["accountId"]
            if (accountIdCriterion != null && authInfo.accountId != accountIdCriterion)
              return false
          }
        }
        else -> {
          criteria.forEach { criterion ->
            if (criterion !is Map<*, *>)
              return false
            // Don't allow fetching all instances.
            if (criterion.isEmpty())
              return false
            val accountIdCriterion = criterion["accountId"]
            val cvIdCriterion = criterion["cvId"]
            // Only accept instances that are related to an account or a cv instance.
            if (accountIdCriterion == null && cvIdCriterion == null)
              return false
            // Only allow 'own' accountId.
            if (accountIdCriterion != null && authInfo.accountId != accountIdCriterion)
              return false
            // Only allow 'own' cvIds.
            if (cvIdCriterion != null && !authInfo.cvIds.contains(cvIdCriterion))
              return false
          }
        }
      }
    }

    return true
  }
}