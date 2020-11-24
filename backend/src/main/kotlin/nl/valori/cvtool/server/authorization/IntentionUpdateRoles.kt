package nl.valori.cvtool.server.authorization

import nl.valori.cvtool.server.ModelUtils.getInstances
import nl.valori.cvtool.server.ModelUtils.toJsonObject
import nl.valori.cvtool.server.persistence.MONGODB_SAVE_ADDRESS

internal object IntentionUpdateRoles : Intention {

  override fun name() = "change account roles"

  override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
    // Only consider save queries.
    if (address != MONGODB_SAVE_ADDRESS)
      return false

    val bodyJson = toJsonObject(body)
        ?: return false

    // Only consider queries updating roles.
    bodyJson.getInstances("role")
        .forEach { roleInstance ->
          // Ignore 'criteria' and only consider 'instances'.
          if (toJsonObject(roleInstance) != null)
            return true
        }

    return false
  }
}