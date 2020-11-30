package nl.valori.cvtool.server.authorization

import nl.valori.cvtool.server.ModelUtils.getCriteria
import nl.valori.cvtool.server.ModelUtils.toJsonObject
import nl.valori.cvtool.server.persistence.MONGODB_FETCH_ADDRESS

internal object IntentionReadAllAuthorizations : Intention {

  override fun name() = "read all account authorizations"

  override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
    // Only consider fetch queries.
    if (address != MONGODB_FETCH_ADDRESS)
      return false

    val bodyJson = toJsonObject(body)
        ?: return false

    return bodyJson
        .getCriteria("authorization")
        .any { criterion -> criterion.map.isEmpty() }
  }
}