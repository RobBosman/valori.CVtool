package nl.valori.cvtool.server.authorization

import io.vertx.core.json.JsonObject
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

    body.map.entries
        .filter { (_, criteria) -> criteria is List<*> } // Ignore 'instances' and only consider 'criteria'.
        .forEach { (entityName, criteria) ->
          (criteria as List<*>)
              .filterIsInstance<Map<*, *>>() // Only consider criteria that contain query objects.
              .forEach { criterion ->
                when (entityName) {
                  "account" -> {
                    // Only consider 'other' account.
                    if (authInfo.accountId != criterion["_id"])
                      return true
                  }
                  "role" -> {}
                  "businessUnit" -> {}
                  "cv" -> {
                    val accountIdCriterion = criterion["accountId"]
                    val cvIdCriterion = criterion["_id"]
                    // 'Read all' queries also match here.
                    if (accountIdCriterion == null && cvIdCriterion == null)
                      return true
                    // Only consider 'other' accountId.
                    if (accountIdCriterion != null && authInfo.accountId != accountIdCriterion)
                      return true
                    // Only consider 'other' cv.
                    if (cvIdCriterion != null && !authInfo.cvIds.contains(cvIdCriterion))
                      return true
                  }
                  else -> {
                    val accountIdCriterion = criterion["accountId"]
                    val cvIdCriterion = criterion["cvId"]
                    // 'Read all' queries also match here.
                    if (accountIdCriterion == null && cvIdCriterion == null)
                      return true
                    // Only consider 'other' accountId.
                    if (accountIdCriterion != null && authInfo.accountId != accountIdCriterion)
                      return true
                    // Only consider 'other' cvIds.
                    if (cvIdCriterion != null && !authInfo.cvIds.contains(cvIdCriterion))
                      return true
                  }
                }
              }
        }

    return false
  }
}