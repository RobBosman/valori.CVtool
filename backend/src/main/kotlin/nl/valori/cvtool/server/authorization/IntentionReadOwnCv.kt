package nl.valori.cvtool.server.authorization

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.CV_FETCH_ADDRESS
import nl.valori.cvtool.server.mongodb.MONGODB_FETCH_ADDRESS

internal object IntentionReadOwnCv : Intention {

  override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
    if (body !is JsonObject)
      return false

    if (address == CV_FETCH_ADDRESS
        && body.map["accountId"] == authInfo.accountId)
      return true

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
                    // Only consider 'own' account.
                    if (authInfo.accountId == criterion["_id"])
                      return true
                  }
                  "cv" -> {
                    // Only consider 'own' accountId.
                    if (authInfo.accountId == criterion["accountId"])
                      return true
                    // Only consider 'own' cv.
                    if (authInfo.cvIds.contains(criterion["_id"]))
                      return true
                  }
                  else -> {
                    // Only consider 'own' accountId.
                    if (authInfo.accountId == criterion["accountId"])
                      return true
                    // Only consider 'own' cvIds.
                    if (authInfo.cvIds.contains(criterion["cvId"]))
                      return true
                  }
                }
              }
        }

    return false
  }
}