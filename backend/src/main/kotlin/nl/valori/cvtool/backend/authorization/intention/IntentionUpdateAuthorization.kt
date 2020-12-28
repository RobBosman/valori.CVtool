package nl.valori.cvtool.backend.authorization.intention

import nl.valori.cvtool.backend.ModelUtils.getInstances
import nl.valori.cvtool.backend.ModelUtils.toJsonObject
import nl.valori.cvtool.backend.authorization.AuthInfo
import nl.valori.cvtool.backend.authorization.Intention
import nl.valori.cvtool.backend.persistence.MONGODB_SAVE_ADDRESS

internal object IntentionUpdateAuthorization : Intention {

  override fun name() = "change account authorization"

  override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
    // Only consider save queries.
    if (address != MONGODB_SAVE_ADDRESS)
      return false

    val bodyJson = toJsonObject(body)
        ?: return false

    // Only consider queries updating authorizations.
    bodyJson.getInstances("authorization")
        .forEach { authorizationInstance ->
          // Ignore 'criteria' (JsonArray) and only consider 'instances' (JsonObject).
          if (toJsonObject(authorizationInstance) != null)
            return true
        }

    return false
  }
}