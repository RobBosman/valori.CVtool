package nl.valori.cvtool.server.authorization

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.ModelUtils.getCriteria
import nl.valori.cvtool.server.persistence.MONGODB_FETCH_ADDRESS

internal object IntentionReadAllRoles : Intention {

  override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
    // Only consider fetch queries.
    if (address != MONGODB_FETCH_ADDRESS || body !is JsonObject)
      return false

    return body
        .getCriteria("role")
        .any { criterion -> criterion.map.isEmpty() }
  }
}