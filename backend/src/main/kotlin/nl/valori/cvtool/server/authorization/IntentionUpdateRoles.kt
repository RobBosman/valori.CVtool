package nl.valori.cvtool.server.authorization

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.persistence.MONGODB_SAVE_ADDRESS

internal object IntentionUpdateRoles : Intention {

  override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
    // Only consider save queries.
    if (address != MONGODB_SAVE_ADDRESS || body !is JsonObject)
      return false

    // Only consider queries updating roles.
    val roleInstances = body.map["role"]
        ?: return false
    // Ignore 'criteria' and only consider 'instances'.
    if (roleInstances !is Map<*, *>)
      return false

    roleInstances.values
        .forEach { roleInstance ->
          // Ignore 'criteria' and only consider 'instances'.
          if (roleInstance !is Map<*, *>)
            return false
        }

    return true
  }
}