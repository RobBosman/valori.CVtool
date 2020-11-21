package nl.valori.cvtool.server.authorization

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.AuthInfo
import nl.valori.cvtool.server.CV_FETCH_ADDRESS
import nl.valori.cvtool.server.mongodb.MONGODB_FETCH_ADDRESS

internal object IntentionReadOtherCv : Intention {

  override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
    if (body !is JsonObject)
      return false

    if (address == CV_FETCH_ADDRESS) {
      val accountId = body.map["accountId"]
      if (accountId != null && accountId != authInfo.accountId)
        return true
    }

    if (address != MONGODB_FETCH_ADDRESS)
      return false

    var readsOtherCv = false

    body.map.entries.forEach { (entityName, criteria) ->
      // Ignore 'instances' and only consider 'criteria'.
      if (criteria !is List<*>) {
        return false
      }

      criteria.forEach { criterion ->
        // Only consider criteria that contain query objects.
        if (criterion !is Map<*, *>)
          return false

        // Ignore queries that fetch all instances.
        if (criterion.isEmpty())
          return false

        when (entityName) {
          "account" -> {
            // Ignore queries for all accounts.
            val accountIdCriterion = criterion["_id"]
                ?: return false
            // Only consider 'other' account.
            if (authInfo.accountId != accountIdCriterion)
              readsOtherCv = true
          }
          "cv" -> {
            val accountIdCriterion = criterion["accountId"]
            val cvIdCriterion = criterion["_id"]
            // Only consider queries that explicitly refer to an account or cv.
            if (accountIdCriterion == null && cvIdCriterion == null)
              return false
            // Only consider 'other' accountId.
            if (accountIdCriterion != null && authInfo.accountId != accountIdCriterion)
              readsOtherCv = true
            // Only consider 'other' cv.
            if (cvIdCriterion != null && !authInfo.cvIds.contains(cvIdCriterion))
              readsOtherCv = true
          }
          else -> {
            val accountIdCriterion = criterion["accountId"]
            val cvIdCriterion = criterion["cvId"]
            // Only consider queries that explicitly refer to an account or cv.
            if (accountIdCriterion == null && cvIdCriterion == null)
              return false
            // Only consider 'other' accountId.
            if (accountIdCriterion != null && authInfo.accountId != accountIdCriterion)
              readsOtherCv = true
            // Only consider 'other' cvIds.
            if (cvIdCriterion != null && !authInfo.cvIds.contains(cvIdCriterion))
              readsOtherCv = true
          }
        }
      }
    }

    return readsOtherCv
  }
}