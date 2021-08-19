package nl.valori.cvtool.backend.authorization.intention

import nl.valori.cvtool.backend.ModelUtils.getInstances
import nl.valori.cvtool.backend.ModelUtils.toJsonObject
import nl.valori.cvtool.backend.authorization.AuthInfo
import nl.valori.cvtool.backend.authorization.Intention
import nl.valori.cvtool.backend.persistence.MONGODB_SAVE_ADDRESS

internal object IntentionUpdateBusinessUnit : Intention {

    override fun name() = "change businessUnit"

    override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
        // Only consider save queries.
        if (address != MONGODB_SAVE_ADDRESS)
            return false

        val bodyJson = toJsonObject(body)
            ?: return false

        // Only consider queries updating businessUnits.
        bodyJson.getInstances("businessUnit")
            .forEach { businessUnitInstance ->
                // Ignore 'criteria' (JsonArray) and only consider 'instances' (JsonObject).
                if (toJsonObject(businessUnitInstance) != null)
                    return true
            }

        return false
    }
}