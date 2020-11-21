package nl.valori.cvtool.server.authorization

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.AuthInfo
import nl.valori.cvtool.server.mongodb.MONGODB_FETCH_ADDRESS

internal object IntentionReadAllBusinessUnits : Intention {

  override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
    // Only consider fetch queries.
    if (address != MONGODB_FETCH_ADDRESS || body !is JsonObject)
      return false

    // Only consider account queries.
    val accountCriteria = body.map["businessUnit"]
        ?: return false

    // Only consider queries without criteria.
    return accountCriteria.toString() == "[{}]"
  }
}