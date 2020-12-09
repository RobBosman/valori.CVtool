package nl.valori.cvtool.server.authorization

import nl.valori.cvtool.server.ModelUtils.getInstances
import nl.valori.cvtool.server.ModelUtils.toJsonObject
import nl.valori.cvtool.server.persistence.MONGODB_SAVE_ADDRESS

internal object IntentionUpdateBusinessUnits : Intention {

  override fun name() = "change businessUnits"

  override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
    // Only consider save queries.
    if (address != MONGODB_SAVE_ADDRESS)
      return false

    val bodyJson = toJsonObject(body)
        ?: return false

    // Only consider queries updating businessUnits.
    bodyJson.getInstances("businessUnit")
        .forEach { roleInstance ->
          // Ignore 'criteria' and only consider 'instances'.
          if (toJsonObject(roleInstance) != null)
            return true
        }

    return false
  }
}