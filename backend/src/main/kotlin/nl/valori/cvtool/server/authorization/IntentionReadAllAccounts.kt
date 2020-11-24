package nl.valori.cvtool.server.authorization

import nl.valori.cvtool.server.ModelUtils.getCriteria
import nl.valori.cvtool.server.ModelUtils.toJsonObject
import nl.valori.cvtool.server.persistence.MONGODB_FETCH_ADDRESS

internal object IntentionReadAllAccounts : Intention {

  override fun name() = "read all accounts"

  override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
    // Only consider fetch queries.
    if (address != MONGODB_FETCH_ADDRESS)
      return false

    val bodyJson = toJsonObject(body)
        ?: return false

    return bodyJson
        .getCriteria("account")
        .any { criterion -> criterion.map.isEmpty() }
  }
}